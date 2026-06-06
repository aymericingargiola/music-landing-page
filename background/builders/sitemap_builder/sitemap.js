const fs = require('fs');
const path = require('path');

// Chemin vers votre fichier playlist.json
const playlistPath = path.join(__dirname, '..', '..', '..', 'public', 'jsons', 'playlist.json');
// Chemin où le sitemap sera sauvegardé
const sitemapPath = path.join(__dirname, '..', '..', '..', 'public', 'sitemap.xml');

// Lire le fichier playlist.json
fs.readFile(playlistPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Erreur lors de la lecture du fichier playlist.json:', err);
        return;
    }

    try {
        const playlists = JSON.parse(data);
        generateSitemap(playlists);
    } catch (parseErr) {
        console.error('Erreur lors du parsing du JSON:', parseErr);
    }
});

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

function generateSitemap(playlists) {
    // Définir la date actuelle pour lastmod
    const currentDate = new Date().toISOString().split('T')[0];

    // Créer le contenu du sitemap
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- URL de la page d'accueil -->
    <url>
        <loc>https://www.lazerzfine.com/</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>`;

    // Ajouter les URLs des tracks
    playlists.forEach(track => {
        const trackUrl = `https://www.lazerzfine.com/track/${track.slug}`;
        const encodedUrl = urlEncodeSpecialChars(trackUrl);
        const escapedUrl = escapeXml(encodedUrl);
        sitemapContent += `
    <url>
        <loc>${escapedUrl}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
    });

    // Fermer le sitemap
    sitemapContent += `
</urlset>`;

    // Écrire le sitemap dans un fichier
    fs.writeFile(sitemapPath, sitemapContent, 'utf8', (err) => {
        if (err) {
            console.error('Erreur lors de l\'écriture du sitemap:', err);
            return;
        }
        console.log('Sitemap généré avec succès:', sitemapPath);
    });
}