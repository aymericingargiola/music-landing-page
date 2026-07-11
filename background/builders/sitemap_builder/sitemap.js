const fs = require('fs');
const path = require('path');

// Paths
const playlistPath = path.join(__dirname, '..', '..', '..', 'public', 'jsons', 'playlist.json');
const playlistVideoPath = path.join(__dirname, '..', '..', '..', 'public', 'jsons', 'playlistVideo.json');
const playlistExtraPath = path.join(__dirname, '..', '..', '..', 'public', 'jsons', 'playlistExtra.json');
const sitemapPath = path.join(__dirname, '..', '..', '..', 'public', 'sitemap.xml');

// Read all data files
let playlists = [], videoTracks = [], extraTracks = [];
let filesRead = 0;

function readNextFile() {
    if (filesRead >= 3) {
        generateSitemap();
        return;
    }
    
    const files = [
        { path: playlistPath, store: (data) => { playlists = data; } },
        { path: playlistVideoPath, store: (data) => { videoTracks = data; } },
        { path: playlistExtraPath, store: (data) => { extraTracks = data; } }
    ];
    
    if (filesRead >= files.length) {
        generateSitemap();
        return;
    }
    
    const file = files[filesRead];
    fs.readFile(file.path, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading ${file.path}:`, err);
            filesRead++;
            readNextFile();
            return;
        }
        try {
            file.store(JSON.parse(data));
            filesRead++;
            readNextFile();
        } catch (parseErr) {
            console.error(`Error parsing ${file.path}:`, parseErr);
            filesRead++;
            readNextFile();
        }
    });
}

// Start reading files
readNextFile();

function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'""]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '"': return '&quot;';
            case "'": return '&apos;';
            default: return c;
        }
    });
}

function urlEncodeSpecialChars(url) {
    // URL encode special characters that might cause issues in XML
    // Double encode ! as %2521 for Netlify redirect compatibility
    // Also handle already encoded %21 and convert to %2521
    return url.replace(/%21/g, '%2521').replace(/[!]/g, function (c) {
        switch (c) {
            case '!': return '%2521';
            default: return c;
        }
    });
}

function getVideoMetadata(track) {
    const slug = track.slug || '';
    const id = track.id || '';
    const name = track.name || '';
    
    // Check playlistVideo.json first (self-hosted videos)
    let videoTrack = videoTracks.find(vt => (vt.slug || '').toLowerCase() === slug.toLowerCase());
    if (!videoTrack) {
        videoTrack = videoTracks.find(vt => (vt.id || '').toLowerCase() === id.toLowerCase());
    }
    if (!videoTrack) {
        videoTrack = videoTracks.find(vt => (vt.name || '').toLowerCase() === name.toLowerCase());
    }
    
    if (videoTrack && videoTrack.url) {
        return {
            content_loc: videoTrack.url,
            player_loc: `https://www.lazerzfine.com/track/${videoTrack.slug || slug}`,
            thumbnail_loc: `https://www.lazerzfine.com/imgs/heroes/${videoTrack.id || id}.webp`,
            title: escapeXml(videoTrack.name || name),
            description: escapeXml(`Music video: ${videoTrack.name || name} by ${videoTrack.artist || track.artist || ''}`),
            publication_date: videoTrack.modified ? new Date(videoTrack.modified).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        };
    }
    
    // Check playlistExtra.json for YouTube videos
    let extraTrack = extraTracks.find(et => (et.slug || '').toLowerCase() === slug.toLowerCase());
    if (!extraTrack) {
        extraTrack = extraTracks.find(et => (et.id || '').toLowerCase() === id.toLowerCase());
    }
    if (!extraTrack) {
        extraTrack = extraTracks.find(et => (et.name || '').toLowerCase() === name.toLowerCase());
    }
    
    if (extraTrack && extraTrack.youtubeId) {
        return {
            content_loc: `https://www.youtube.com/watch?v=${extraTrack.youtubeId}`,
            player_loc: `https://www.youtube-nocookie.com/embed/${extraTrack.youtubeId}`,
            thumbnail_loc: `https://www.lazerzfine.com/imgs/heroes/${extraTrack.id || id}.webp`,
            title: escapeXml(extraTrack.name || name),
            description: escapeXml(`Music video: ${extraTrack.name || name} by ${extraTrack.artist || track.artist || ''}`),
            publication_date: extraTrack.releaseTimestamp ? new Date(extraTrack.releaseTimestamp * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        };
    }
    
    return null;
}

function generateSitemap() {
    const currentDate = new Date().toISOString().split('T')[0];

    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:audio="http://www.google.com/schemas/sitemap-audio/1.1">
    <!-- Homepage -->
    <url>
        <loc>https://www.lazerzfine.com/</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>`;

    playlists.forEach(track => {
        const trackUrl = `https://www.lazerzfine.com/track/${track.slug}`;
        const encodedUrl = urlEncodeSpecialChars(trackUrl);
        const escapedUrl = escapeXml(encodedUrl);
        const videoMetadata = getVideoMetadata(track);
        
        sitemapContent += `
    <url>
        <loc>${escapedUrl}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>`;
        
        if (videoMetadata) {
            const publicationDate = videoMetadata.publication_date || currentDate;
            const artist = track.artist || track.artistfilter || '';
            const title = track.name || '';
            const audioUrl = track.url || '';
            
            // Add video metadata
            sitemapContent += `
        <video:video>
            <video:content_loc>${escapeXml(videoMetadata.content_loc)}</video:content_loc>
            <video:player_loc>${escapeXml(videoMetadata.player_loc)}</video:player_loc>
            <video:thumbnail_loc>${escapeXml(videoMetadata.thumbnail_loc)}</video:thumbnail_loc>
            <video:title>${videoMetadata.title}</video:title>
            <video:description>${videoMetadata.description}</video:description>
            <video:publication_date>${publicationDate}</video:publication_date>
            <video:family_friendly>yes</video:family_friendly>`;
            
            if (artist) {
                sitemapContent += `
            <video:tag>${escapeXml(artist)}</video:tag>
            <video:tag>Music</video:tag>
            <video:tag>Remix</video:tag>
            <video:tag>Bootleg</video:tag>`;
            }
            
            sitemapContent += `
        </video:video>`;
            
            // Also add audio metadata since the page has an audio player too
            if (audioUrl) {
                sitemapContent += `
        <audio:audio>
            <audio:title>${escapeXml(title)}</audio:title>
            <audio:artist>${escapeXml(artist)}</audio:artist>
            <audio:audio_file>${escapeXml(audioUrl)}</audio:audio_file>
            <audio:duration>${track.size || ''}</audio:duration>
            <audio:publication_date>${currentDate}</audio:publication_date>
            <audio:family_friendly>yes</audio:family_friendly>`;
            
                if (artist) {
                    sitemapContent += `
            <audio:tag>${escapeXml(artist)}</audio:tag>
            <audio:tag>Music</audio:tag>
            <audio:tag>Remix</audio:tag>
            <audio:tag>Bootleg</audio:tag>`;
                }
            
                sitemapContent += `
        </audio:audio>`;
            }
        } else {
            // Add audio metadata for tracks without video
            const artist = track.artist || track.artistfilter || '';
            const title = track.name || '';
            const audioUrl = track.url || '';
            
            if (audioUrl) {
                sitemapContent += `
        <audio:audio>
            <audio:title>${escapeXml(title)}</audio:title>
            <audio:artist>${escapeXml(artist)}</audio:artist>
            <audio:audio_file>${escapeXml(audioUrl)}</audio:audio_file>
            <audio:duration>${track.size || ''}</audio:duration>
            <audio:publication_date>${currentDate}</audio:publication_date>
            <audio:family_friendly>yes</audio:family_friendly>`;
            
            if (artist) {
                sitemapContent += `
            <audio:tag>${escapeXml(artist)}</audio:tag>
            <audio:tag>Music</audio:tag>
            <audio:tag>Remix</audio:tag>
            <audio:tag>Bootleg</audio:tag>`;
            }
            
            sitemapContent += `
        </audio:audio>`;
            }
        }
        
        sitemapContent += `
    </url>`;
    });

    sitemapContent += `
</urlset>`;

    fs.writeFile(sitemapPath, sitemapContent, 'utf8', (err) => {
        if (err) {
            console.error('Error writing sitemap:', err);
            return;
        }
        console.log('Sitemap generated successfully:', sitemapPath);
    });
}