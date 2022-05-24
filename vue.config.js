const path = require('path');
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, './src/styles/mixins/import.scss'),
        path.resolve(__dirname, './src/styles/variables/import.scss'),
      ],
    },
  },
});
