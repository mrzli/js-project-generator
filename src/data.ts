import { Placeholders, Config } from './types/types';

const PLACEHOLDERS: Placeholders = {
  scopeName: 'gmjs',
  projectName: 'eslint-config',
  author: 'Goran Mržljak',
  email: 'goran.mrzljak@gmail.com',
  githubUserOrOrg: 'mrzli',
};

export const CONFIG: Config = {
  placeholders: PLACEHOLDERS,
  dependencies: ['tslib'],
  devDependencies: [
    '@gmjs/prettier-config',
    '@types/eslint',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'eslint',
    'eslint-config-prettier',
    'eslint-import-resolver-typescript',
    'eslint-plugin-import',
    // 'eslint-plugin-jsx-a11y',
    // 'eslint-plugin-react',
    // 'eslint-plugin-react-hooks',
    'prettier',
    'typescript',
  ],
};
