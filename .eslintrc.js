const { getEsLintConfig } = require('@gmjs/eslint-config');

module.exports = {
  ...getEsLintConfig('node'),
  // root: true,
  // plugins: [
  //   '@typescript-eslint',
  //   'import',
  //   // 'react',
  //   // 'react-hooks',
  //   // 'jsx-a11y',
  // ],
  // env: {
  //   // es2022: true,
  //   // node: true,
  //   // commonjs: true,
  //   // browser: true,
  //   // jest: true,
  // },
  // parser: '@typescript-eslint/parser',
  // parserOptions: {
  //   project: ['./tsconfig.json'],
  // },
  // extends: [
  //   'eslint:recommended',
  //   'plugin:@typescript-eslint/recommended',
  //   'plugin:import/recommended',
  //   // 'plugin:react/recommended',
  //   // 'plugin:react-hooks/recommended',
  //   // 'plugin:jsx-a11y/recommended',
  //   'prettier',
  // ],
  // settings: {
  //   'import/resolver': {
  //     typescript: true,
  //   },
  // },
  // rules: {},
};
