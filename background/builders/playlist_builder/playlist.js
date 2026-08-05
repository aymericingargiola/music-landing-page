const fs = require('fs');
const path = require("path");
const globalFunctions = require('../../global-functions');
const config = require('./config.json');
const mediaUrls = config.userSettings.mediaUrls;
const mediaDirectories = config.userSettings.mediaDirectories;
const saveJsonPath = config.userSettings.saveJsonPath;
const losslessSaveJsonPath = config.userSettings.losslessSaveJsonPath;
const videoSaveJsonPath = config.userSettings.videoSaveJsonPath;
const buildSavePath = config.userSettings.buildSavePath;
const distSavePath = config.userSettings.distSavePath;

const formatSettings = {
    mp3: {
        directory: mediaDirectories.mp3,
        url: mediaUrls.mp3,
        extensions: ['.mp3'],
    },
    lossless: {
        directory: mediaDirectories.wav,
        url: mediaUrls.wav,
        extensions: ['.wav'],
    },
    video: {
        directory: mediaDirectories.video,
        url: mediaUrls.videoDownload,
        streamUrl: mediaUrls.videoStream,
        extensions: ['.mp4', '.mkv'],
    },
};

/**
  * @desc This function will write the json file on specified path from "saveJsonPath" in config.json,
  *  it will also compare the new file list with already existing json file with same name
  * @param newFileList newFilelist - File list build from original Owncloud file list with buildJson()
*/
function writeJson(newFileList, savePath) {
    fs.writeFile(savePath, JSON.stringify(newFileList), function (error) {
        if (error) {
            console.error("Error:  " + error.message);
        } else {
            console.log("File writed on " + path.resolve(savePath));
        }
    });
}

/**
  * @desc This function will check the new file list with any already existing json file with same name
  * @param object newFilelist - File list build from original Owncloud file list with buildJson()
*/
function checkFiles(newFileList, savePath) {
    if (newFileList.error) {
        return console.log("New file list request returned an error");
    } else if (globalFunctions.fileExist(savePath) && savePath != "") {
        console.group("File list already exist, check files:");
        console.time("Time");
        var newFiles = 0;
        var oldFiles = 0;
        var updatedFiles = 0;
        const oldFileList = JSON.parse(fs.readFileSync(savePath, 'utf8'));
        newFileList.forEach(function (item) {
            const idx = oldFileList.findIndex((i) => i.id === item.id);
            if (idx === -1) {
                console.log("New file : " + item.fileName);
                newFiles++;
            } else if (JSON.stringify(oldFileList[idx]) !== JSON.stringify(item)) {
                console.log("Updated file : " + item.fileName);
                updatedFiles++;
            }
        });
        oldFileList.forEach(function (item) {
            if (newFileList.map(function (items) { return items['id']; }).indexOf(item.id) === -1) {
                console.log("Removed file : " + item.fileName);
                oldFiles++;
            }
        });
        console.log("New file(s) : " + newFiles);
        console.log("Removed file(s) : " + oldFiles);
        console.timeEnd("Time");
        console.groupEnd();
        if (newFiles > 0 || oldFiles > 0 || updatedFiles > 0) {
            writeJson(newFileList, savePath);
        }
    } else if (savePath && savePath != "") {
        return writeJson(newFileList, savePath);
    } else {
        return console.log("No path in config.json to save the json, the file was not saved.");
    }
}

/**
 * @desc Build custom file list from local media files.
 * @param object filelist - Local media file list
  * @return object newList -> New file list
*/
async function buildJson(filelist) {
    console.time("Json build");
    var newFileList = [];
    await globalFunctions.asyncForEach(filelist, async function (item) {
        let name, cleanName, extension, artist, artistfilter, titlefilter, title, filter, url, bytes, modified;
        name = item.name.replace(/ +/g, " ").replace(/\n/g, "").trim();
        cleanName = name.lastIndexOf(".") != -1 ? name.substr(0, name.lastIndexOf(".")).trim() : name;
        filter = cleanName.normalize("NFD").replace(/[\u0300-\u036f-.()]/g, "").replace(/ +/g, ' ').toLowerCase();
        extension = name.lastIndexOf(".") != -1 ? name.substr(name.lastIndexOf(".") + 1).trim().toLowerCase() : "";
        url = item.url;
        bytes = item.stats.size;
        modified = item.stats.mtime.toUTCString();
        if (extension.match(/^(mp3|wav|ogg|flac|wma|mid|mp4|mkv)$/)) {
            if (/[-]+/.test(cleanName)) {
                artist = cleanName.match(/[^-]*/i)[0].trim();
                artistfilter = artist.normalize("NFD").replace(/[\u0300-\u036f-.()]/g, "").replace(/ +/g, ' ').toLowerCase();
                title = cleanName.match(/-([\s\S]*)$/)[1].trim()
                titlefilter = title.normalize("NFD").replace(/[\u0300-\u036f-.()]/g, "").replace(/ +/g, ' ').toLowerCase();
            } else {
                title = cleanName;
            }
        }
        const itemDatas = {
            "id": Buffer.from(cleanName).toString('base64'),
            "slug": cleanName.normalize("NFD").replace(/[\u0300-\u036f-.()]/g, "").replace(/!/g, "%21").replace(/ +/g, '-').toLowerCase(),
            "name": cleanName,
            "artist": (artist ? artist : undefined),
            "title": (title ? title : undefined),
            "artistfilter": (artist ? artistfilter : undefined),
            "titlefilter": (artist ? titlefilter : title ? filter : undefined),
            "filter": filter,
            "fileName": name,
            "extension": extension,
            "url": url,
            "streamUrl": item.streamUrl,
            "bytes": bytes,
            "size": globalFunctions.bytesToSize(bytes),
            "modified": modified
        }
        newFileList.push(itemDatas);
    });
    console.timeEnd("Json build");
    console.timeEnd("Time");
    console.groupEnd();
    return newFileList;
}

/**
  * @desc Get the file list from Owncloud url with headless browser PhantomJS
  * @param object url - Url where to get the file list
  * @return function buildJson() -> Build custom file list based on Owncloud's file list object
*/
function encodeObjectPath(relativePath) {
    return relativePath.split(path.sep).map((segment) => encodeURIComponent(segment)
        .replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`))
        .join('/');
}

function objectUrl(baseUrl, relativePath) {
    return `${baseUrl.replace(/\/$/, '')}/${encodeObjectPath(relativePath)}`;
}

function isOptiWebVideo(fileName) {
    return /_optweb\.mp4$/i.test(fileName);
}

function getLocalFiles(directory) {
    if (!fs.existsSync(directory)) {
        throw new Error(`Media directory does not exist: ${directory}`);
    }

    const files = [];
    const walk = (currentDirectory) => {
        fs.readdirSync(currentDirectory, { withFileTypes: true }).forEach((entry) => {
            const entryPath = path.join(currentDirectory, entry.name);
            if (entry.isDirectory()) {
                walk(entryPath);
            } else if (entry.isFile()) {
                files.push({
                    name: entry.name,
                    path: entryPath,
                    relativePath: path.relative(directory, entryPath),
                    stats: fs.statSync(entryPath),
                });
            }
        });
    };

    walk(directory);
    return files;
}

/**
 * @desc Build a local media list and map it to public R2 object URLs.
 */
async function getFileList(format) {
    console.time("Time")
    console.group("\nRequest: " + globalFunctions.dateDisplay());
    const settings = formatSettings[format];
    const localFiles = getLocalFiles(settings.directory).filter((file) => settings.extensions
        .includes(path.extname(file.name).toLowerCase()));
    const streamPaths = new Set(localFiles.filter((file) => isOptiWebVideo(file.name))
        .map((file) => file.relativePath.toLowerCase()));
    const fileList = localFiles.filter((file) => format !== 'video' || !isOptiWebVideo(file.name))
        .sort((first, second) => first.relativePath.localeCompare(second.relativePath))
        .map((file) => {
            const item = {
                ...file,
                url: objectUrl(settings.url, file.relativePath),
            };
            if (format === 'video') {
                const streamRelativePath = file.relativePath.replace(/\.[^.]+$/, ' _optweb.mp4');
                if (streamPaths.has(streamRelativePath.toLowerCase())) {
                    item.streamUrl = objectUrl(settings.streamUrl, streamRelativePath);
                } else {
                    console.warn(`No optimized streaming video for: ${file.relativePath}`);
                }
            }
            return item;
        });
    return buildJson(fileList);
}

/**
  * @desc Init app based on init options
  * @param object initOptions - Init options
*/
const init = async function (initOptions) {
    if (initOptions.checkFiles) {
        const format = initOptions.format === "lossless" ? "lossless" : initOptions.format === "video" ? "video" : "mp3";
        const savePath = `${initOptions.dist ? distSavePath : buildSavePath}${initOptions.format === "lossless" ? losslessSaveJsonPath : initOptions.format === "video" ? videoSaveJsonPath : saveJsonPath}`;
        if (formatSettings[format].directory && formatSettings[format].url) {
            const newFileList = await getFileList(format);
            checkFiles(newFileList, savePath, initOptions.format);
            return true
        } else {
            console.log("No media directory or public URL set in config.json");
            return false
        }
    }
}

/**
  * @desc Check if command line contains a first parameter
  * @param string process.argv[2] -> First command line parameter
  * @param string process.argv[2] === "--write-json" -> Only write json to directory configured in config.json
*/
switch (process.argv[2]) {
    case "--write-json":
        init(globalFunctions.initOptions(checkFilesParam = true));
        break;
    case "--write-json-lossless":
        init(globalFunctions.initOptions(checkFilesParam = true, format = "lossless"));
        break
    case "--write-json-video":
        init(globalFunctions.initOptions(checkFilesParam = true, format = "video"));
        break
    default:
        init(globalFunctions.initOptions());
}

module.exports = {
    buildAll: async function (dist) {
        await init(globalFunctions.initOptions(true, false, dist))
        await init(globalFunctions.initOptions(true, "lossless", dist))
        await init(globalFunctions.initOptions(true, "video", dist))
        return console.log("Jsons updated")
    }
}