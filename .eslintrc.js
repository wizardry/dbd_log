const path = require('path');

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017,
    sourceType: 'module',
  },
//  extends: ['prettier', 'airbnb-base', 'plugin:vue/recommended'],
//  plugins: ['prettier'],
  extends: ['airbnb-base', 'plugin:vue/recommended'],
  plugins: [],
  settings: {
    'import/resolver': {
      alias: {
        map: [['~', path.join(__dirname, 'src/')]],
      },
    },
    'import/core-modules': [],
  },
  // add your custom rules here
  rules: {
/*
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        semi: true,
      },
    ],
*/
    semi: ['off'], // prettier does this
    'function-paren-newline': ['off'], // prettier does this
    'comma-dangle': ['off'], // prettier does this
    'no-param-reassign': ['off'],
    'arrow-parens': ['error', 'as-needed'],
    'consistent-return': ['off'],
    'no-console': ['off'],
    'max-len': ['error', { code: 80, ignoreUrls: true }],
    'no-eol-whitespace': ['off'],
  },

  // setting for test files
  overrides: [
    {
      files: ['**/*.spec.js'],
      env: {
        jest: true,
      },
      plugins: ['jest'],
      rules: {},
    },
  ],
};
