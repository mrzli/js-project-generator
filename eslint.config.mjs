import { getEsLintConfigs } from '@gmjs/eslint-config';

export default [
  {
    ignores: ['dist/', 'jest.config.ts', 'eslint.config.mjs'],
  },
  ...getEsLintConfigs({ projectType: 'node' }),
];
