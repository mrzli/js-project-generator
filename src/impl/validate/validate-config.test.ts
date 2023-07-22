import { describe, expect, it } from '@jest/globals';
import { Config } from '../../types';
import { validateConfig } from './validate-config';
import { Except } from 'type-fest';

describe('validate-config', () => {
  const DEFAULT_CONFIG_VALUES: Except<Config, 'projectType'> = {
    output: 'output',
    scopeName: 'scope',
    projectName: 'project-name',
    author: 'First Last',
    email: 'first.last@email.com',
    authorUrl: 'https://fistlast.com',
    githubUserOrOrg: 'firstlast',
  };

  describe('validateConfig()', () => {
    describe('valid', () => {
      interface Example {
        readonly input: Partial<Config>;
        readonly expected: Config;
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: {
            ...DEFAULT_CONFIG_VALUES,
            projectType: 'node',
          },
          expected: {
            ...DEFAULT_CONFIG_VALUES,
            projectType: 'node',
          },
        },
        {
          input: {
            ...DEFAULT_CONFIG_VALUES,
            projectType: 'node',
            authorUrl: undefined,
          },
          expected: {
            ...DEFAULT_CONFIG_VALUES,
            projectType: 'node',
            authorUrl: undefined,
          },
        },
        {
          input: {
            ...DEFAULT_CONFIG_VALUES,
            projectType: 'cli',
            commandName: 'command-name',
          },
          expected: {
            ...DEFAULT_CONFIG_VALUES,
            projectType: 'cli',
            commandName: 'command-name',
          },
        },
      ];

      for (const example of EXAMPLES) {
        it(JSON.stringify(example), () => {
          const actual = validateConfig(example.input);
          expect(actual).toEqual(example.expected);
        });
      }
    });

    describe('throws', () => {
      interface Example {
        readonly input: Partial<Config>;
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: {
            ...DEFAULT_CONFIG_VALUES,
            projectType: undefined,
          },
        },
        {
          input: {
            ...DEFAULT_CONFIG_VALUES,
            projectType: 'node',
            output: undefined,
          },
        },
        {
          input: {
            ...DEFAULT_CONFIG_VALUES,
            projectType: 'node',
            scopeName: undefined,
          },
        },
        {
          input: {
            ...DEFAULT_CONFIG_VALUES,
            projectType: 'node',
            projectName: undefined,
          },
        },
        {
          input: {
            ...DEFAULT_CONFIG_VALUES,
            projectType: 'node',
            author: undefined,
          },
        },
        {
          input: {
            ...DEFAULT_CONFIG_VALUES,
            projectType: 'node',
            email: undefined,
          },
        },
        {
          input: {
            ...DEFAULT_CONFIG_VALUES,
            projectType: 'node',
            githubUserOrOrg: undefined,
          },
        },
      ];

      for (const example of EXAMPLES) {
        it(JSON.stringify(example), () => {
          const call = (): Config => validateConfig(example.input);
          expect(call).toThrow();
        });
      }
    });
  });
});
