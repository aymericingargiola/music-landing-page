const { init } = require('../../background/builders/playlist_builder/playlist');
exports.handler = async function(event, context) {
    return await init()
}