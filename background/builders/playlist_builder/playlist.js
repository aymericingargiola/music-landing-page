const fs = require('fs');
const path = require("path");
const axios = require('axios');
const cheerio = require('cheerio');
const globalFunctions = require('../../global-functions');
const config = require('./config.json');
const defaultUrl = config.userSettings.defaultUrl;
const losslessUrl = config.userSettings.losslessUrl;
const videoUrl = config.userSettings.videoUrl;
const saveJsonPath = config.userSettings.saveJsonPath;
const losslessSaveJsonPath = config.userSettings.losslessSaveJsonPath;
const videoSaveJsonPath = config.userSettings.videoSaveJsonPath;
const thumbnailPath = config.userSettings.thumbnail.path;
const thumbnailExtension = config.userSettings.thumbnail.extension;

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
            console.log("File writed on " + path.resolve(saveJsonPath));
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
        console.group("\File list already exist, check files:");
        console.time("Time");
        var newFiles = 0;
        var oldFiles = 0;
        oldFileList = JSON.parse(fs.readFileSync(savePath, 'utf8'));
        newFileList.forEach(function (item, index) {
            if (oldFileList.map(function (items) { return items['id']; }).indexOf(item.id) === -1) {
                console.log("New file : " + item.fileName);
                ++newFiles;
            }
        });
        oldFileList.forEach(function (item, index) {
            if (newFileList.map(function (items) { return items['id']; }).indexOf(item.id) === -1) {
                console.log("Removed file : " + item.fileName);
                ++oldFiles;
            }
        });
        console.log("New file(s) : " + newFiles);
        console.log("Removed file(s) : " + oldFiles);
        console.timeEnd("Time");
        console.groupEnd();
        if (newFiles != 0 || oldFiles != 0) {
            writeJson(newFileList, savePath);
        }
    } else if (savePath && savePath != "") {
        return writeJson(newFileList, savePath);
    } else {
        return console.log("No path in config.json to save the json, the file was not saved.");
    }
}

/**
  * @desc Build custom file list
  * @param object filelist - Original file list from Owncloud
  * @return object newList -> New file list
*/
async function buildJson(filelist) {
    console.time("Json build");
    var newFileList = [];
    await globalFunctions.asyncForEach(filelist, async function (item, index) {
        let name, cleanName, extension, artist, artistfilter, titlefilter, title, filter, url, bytes, mimetype;
        await axios(item.url, {method: 'head'}).then(async (response) => { bytes = response.headers['content-length']; mimetype = response.headers['content-type'] })
        name = item.name.replace(/ +/g, " ").replace(/\n/g, "").trim();
        cleanName = name.lastIndexOf(".") != -1 ? name.substr(0, name.lastIndexOf(".")).trim() : name;
        filter = cleanName.normalize("NFD").replace(/[\u0300-\u036f-.()]/g, "").replace(/ +/g, ' ').toLowerCase();
        thumbnailName = filter.replace(/[']/g, "").replace(/ /g,"-");
        extension = name.lastIndexOf(".") != -1 ? name.substr(name.lastIndexOf(".") + 1).trim() : item.mimetype.match(/^(httpd\/unix-directory)$/) ? "zip" : "";
        url = item.url;
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
        itemDatas = {
            "id": Buffer.from(cleanName).toString('base64'),
            "fileName": name,
            "name": cleanName,
            "filter": filter,
            "extension": extension,
            "mimetype": mimetype,
            "url": url,
            "bytes": bytes,
            "size": globalFunctions.bytesToSize(bytes),
            "thumbnail": (thumbnailPath != "" && thumbnailExtension != "" ? thumbnailPath + thumbnailName + thumbnailExtension : undefined),
            "artist": (artist ? artist : undefined),
            "artistfilter": (artist ? artistfilter : undefined),
            "title": (title ? title : undefined),
            "titlefilter": (artist ? titlefilter : title ? filter : undefined),
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
async function getFileList(url) {
    console.time("Time")
    console.group("\nRequest: " + globalFunctions.dateDisplay());
    const fileList = await axios.get(url).then(async (response) => {
        let $ = cheerio.load(response.data);
        let files = []
        $('a').each(function (i, e) {
            if (i === 0) return
            files.push({
                name: decodeURI($(e).attr('href')).replaceAll("%26", "&").replaceAll("%2C", ","),
                url: `${url}${$(e).attr('href')}`
            })
        })
        return files
    })
    return buildJson(fileList);
}

/**
  * @desc Init app based on init options
  * @param object initOptions - Init options
*/
async function init(initOptions) {
    if (initOptions.checkFiles) {
        const url = initOptions.format === "lossless" ? losslessUrl : initOptions.format === "video" ? videoUrl : defaultUrl;
        const savePath = initOptions.format === "lossless" ? losslessSaveJsonPath : initOptions.format === "video" ? videoSaveJsonPath : saveJsonPath;
        if (url && url != "") {
            getFileList(url).then((newFileList) => {
                checkFiles(newFileList, savePath);
            });
        } else {
            console.log("No default url set in config.json, please set an url in config.json");
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