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
        sitemapContent += `
    <url>
        <loc>${trackUrl}</loc>
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