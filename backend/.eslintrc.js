module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-typescript'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: ['tsconfig.json'],
  },
  plugins: ['@typescript-eslint'],
  rules: {},
};
