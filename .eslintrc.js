module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    babelOptions: {
      babelrc: false,
      configFile: false,
      presets: ['@babel/preset-env'],
    },
  },
  rules: {
    'no-undef': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/require-default-prop': 'off',
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
  },
  ignorePatterns: ['dist/', 'node_modules/', 'vue.config.js'],
};