import { GenerateInput } from '../../../../types';
import { isAppCliTemplate, isAppNestTemplate } from '../../../../util';

export function getDependencies(input: GenerateInput): readonly string[] {
  return [
    ...DEPENDENCIES_RUNTIME,
    ...(isAppCliTemplate(input) ? DEPENDENCIES_APP_CLI : []),
    ...(isAppNestTemplate(input) ? DEPENDENCIES_APP_NEST : []),
  ];
}

const DEPENDENCIES_RUNTIME: readonly string[] = ['tslib'];

const DEPENDENCIES_APP_CLI: readonly string[] = [
  '@gmjs/package-json',
  'commander',
];

const DEPENDENCIES_APP_NEST: readonly string[] = [
  '@gmjs/number-util',
  '@nestjs/common',
  '@nestjs/core',
  '@nestjs/platform-express',
  'cookie-parser',
  'dotenv',
  'helmet',
  'reflect-metadata',
  'rxjs',
  'tslib',
  'zod',
];

export function getDevDependencies(input: GenerateInput): readonly string[] {
  return [
    ...getDevDependenciesGeneric(input),
    ...DEV_DEPENDENCIES_GMJS_CONFIGS,
    ...getDevDependenciesRuntimeLibTypes(input),
    ...(isAppNestTemplate(input) ? DEV_DEPENDENCIES_NEST_JS : []),
    ...getDevDependenciesLinting(input),
    ...getDevDependenciesTest(input),
    ...DEV_DEPENDENCIES_TYPESCRIPT,
    ...getDevDependenciesTooling(input),
  ];
}

function getDevDependenciesGeneric(input: GenerateInput): readonly string[] {
  return [...(isAppNestTemplate(input) ? ['type-fest'] : []), '@types/node'];
}

const DEV_DEPENDENCIES_GMJS_CONFIGS: readonly string[] = [
  '@gmjs/eslint-config',
  '@gmjs/jest-config',
  '@gmjs/prettier-config',
  '@gmjs/tsconfig',
];

function getDevDependenciesRuntimeLibTypes(
  input: GenerateInput,
): readonly string[] {
  return [
    ...(isAppNestTemplate(input)
      ? ['@types/cookie-parser', '@types/express']
      : []),
  ];
}

const DEV_DEPENDENCIES_NEST_JS: readonly string[] = [
  '@nestjs/cli',
  '@nestjs/schematics',
  '@nestjs/testing',
];

function getDevDependenciesLinting(input: GenerateInput): readonly string[] {
  const templateKind = input.projectData.template.kind;

  const isNode =
    templateKind === 'node' ||
    templateKind === 'cli' ||
    templateKind === 'nest';

  return [
    '@types/eslint',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'eslint',
    'eslint-config-prettier',
    'eslint-import-resolver-typescript',
    'eslint-plugin-import',
    'eslint-plugin-prettier',
    'eslint-plugin-unicorn',
    'prettier',
    ...(isNode ? ['eslint-plugin-n'] : []),
    ...(templateKind === 'react'
      ? [
          'eslint-plugin-jsx-a11y',
          'eslint-plugin-react',
          'eslint-plugin-react-hooks',
        ]
      : []),
  ];
}

function getDevDependenciesTest(input: GenerateInput): readonly string[] {
  return [
    ...(isAppNestTemplate(input) ? ['supertest', '@types/supertest'] : []),
    '@jest/globals',
    'jest',
    'ts-jest',
  ];
}

const DEV_DEPENDENCIES_TYPESCRIPT: readonly string[] = [
  'ts-node',
  'typescript',
];

function getDevDependenciesTooling(input: GenerateInput): readonly string[] {
  const { projectData } = input;

  const isPublishable =
    projectData.kind !== 'app' || projectData.template.kind === 'cli';

  return [
    ...(isPublishable ? ['@gmjs/npm-publish-cli'] : []),
    ...(isAppNestTemplate(input)
      ? ['source-map-support', 'ts-loader', 'tsconfig-paths']
      : []),
    'shx',
  ];
}
