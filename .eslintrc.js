// .eslintrc.js
module.exports = {
  parser: '@babel/eslint-parser', // If you are using Babel
  extends: [
    'eslint:recommended',
    'plugin:react/recommended', // If you are using React
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors
  ],
  settings: {
    react: {
      version: 'detect', // Detects the React version
    },
  },
  env: {
    node: true, // Node.js global variables and Node.js scoping
    browser: true, // Browser global variables
    es6: true, // Enables ES6 features
  },
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  rules: {
    // You can override or add rules here
  },
};
