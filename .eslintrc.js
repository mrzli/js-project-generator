module.exports = {
  root: true,
  ignorePatterns: ['node_modules/*', 'dist/*', '.eslintrc.js'],
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    // browser: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  plugins: [
    '@typescript-eslint',
    'import',
    // 'react',
    // 'react-hooks',
    // 'jsx-a11y',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    // 'plugin:react/recommended',
    // 'plugin:react-hooks/recommended',
    // 'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      typescript: true,
    },
  },
  rules: {},
};
