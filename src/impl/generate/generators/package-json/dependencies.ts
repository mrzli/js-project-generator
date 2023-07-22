import { ProjectType } from '../../../../types';

export function getDependencies(projectType: ProjectType): readonly string[] {
  return [
    ...DEPENDENCIES_RUNTIME,
    ...(projectType === 'cli'
      ? ['@gmjs/cli-wrapper', '@gmjs/package-json']
      : []),
  ];
}

const DEPENDENCIES_RUNTIME: readonly string[] = ['tslib'];

export function getDevDependencies(
  projectType: ProjectType,
): readonly string[] {
  return [
    ...DEV_DEPENDENCIES_GMJS_CONFIGS,
    ...getDevDependenciesLinting(projectType),
    ...DEV_DEPENDENCIES_TEST,
    ...DEV_DEPENDENCIES_TYPESCRIPT,
    ...DEV_DEPENDENCIES_TOOLING,
  ];
}

const DEV_DEPENDENCIES_GMJS_CONFIGS: readonly string[] = [
  '@gmjs/eslint-config',
  '@gmjs/jest-config',
  '@gmjs/prettier-config',
  '@gmjs/tsconfig',
];

function getDevDependenciesLinting(
  projectType: ProjectType,
): readonly string[] {
  return [
    '@types/eslint',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'eslint',
    'eslint-config-prettier',
    'eslint-import-resolver-typescript',
    'eslint-plugin-import',
    'eslint-plugin-unicorn',
    'prettier',
    ...(projectType === 'node' || projectType === 'cli'
      ? ['eslint-plugin-n']
      : []),
    ...(projectType === 'react'
      ? [
          'eslint-plugin-jsx-a11y',
          'eslint-plugin-react',
          'eslint-plugin-react-hooks',
        ]
      : []),
  ];
}

const DEV_DEPENDENCIES_TEST: readonly string[] = [
  '@jest/globals',
  'jest',
  'ts-jest',
];

const DEV_DEPENDENCIES_TYPESCRIPT: readonly string[] = [
  'ts-node',
  'typescript',
];

const DEV_DEPENDENCIES_TOOLING: readonly string[] = [
  '@gmjs/npm-publish-cli',
  'shx',
];
