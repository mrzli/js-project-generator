import { Config } from './types/types';

const DEPENDENCIES: readonly string[] = ['tslib'];

const DEV_DEPENDENCIES: readonly string[] = [
  '@gmjs/eslint-config',
  '@gmjs/prettier-config',
  '@jest/globals',
  '@types/eslint',
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  'eslint',
  'eslint-config-prettier',
  'eslint-import-resolver-typescript',
  'eslint-plugin-import',
  'eslint-plugin-unicorn',
  'eslint-plugin-n',
  // 'eslint-plugin-jsx-a11y',
  // 'eslint-plugin-react',
  // 'eslint-plugin-react-hooks',
  'jest',
  'prettier',
  'ts-jest',
  'ts-node',
  'typescript',
];

export const CONFIG: Config = {
  targetRootDirectory: 'output',
  projectType: 'node',
  scopeName: 'gmjs',
  projectName: 'eslint-config',
  author: 'Goran Mržljak',
  email: 'goran.mrzljak@gmail.com',
  githubUserOrOrg: 'mrzli',
  dependencies: DEPENDENCIES,
  devDependencies: DEV_DEPENDENCIES,
};
