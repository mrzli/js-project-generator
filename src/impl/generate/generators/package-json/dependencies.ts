import { GenerateInput } from '../../../../types';
import { isAppCliTemplate } from '../../../../util';

export function getDependencies(input: GenerateInput): readonly string[] {
  return [
    ...DEPENDENCIES_RUNTIME,
    ...(isAppCliTemplate(input) ? ['@gmjs/package-json', 'commander'] : []),
  ];
}

const DEPENDENCIES_RUNTIME: readonly string[] = ['tslib'];

export function getDevDependencies(input: GenerateInput): readonly string[] {
  return [
    ...DEV_DEPENDENCIES_GMJS_CONFIGS,
    ...getDevDependenciesLinting(input),
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

function getDevDependenciesLinting(input: GenerateInput): readonly string[] {
  const templateKind = input.projectData.template.kind;

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
    ...(templateKind === 'node' || templateKind === 'cli'
      ? ['eslint-plugin-n']
      : []),
    ...(templateKind === 'react'
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
