import { join } from 'node:path';
import { generateProject } from './impl';
import { Config } from './types';
// import { readTextAsync } from '@gmjs/fs-async';
import { invariant } from '@gmjs/assert';

async function run(): Promise<void> {
  const options: Record<string, unknown> = {
    config: join('example-configs', 'node.json'),
    output: 'output',
    projectName: 'jest-config',
  };

  const config = await getConfig(options);
  await generateProject(config);
}

async function getConfig(options: Record<string, unknown>): Promise<Config> {
  const configPath = options['config'] as string;
  const cliOutput = options['output'] as string | undefined;
  const cliProjectName = options['projectName'] as string | undefined;

  const config = await readConfig(configPath);

  const {
    output,
    projectType,
    scopeName,
    projectName,
    author,
    email,
    authorUrl,
    githubUserOrOrg,
    dependencies,
    devDependencies,
  } = config;

  const finalOutput = cliOutput ?? output;
  const finalProjectName = cliProjectName ?? projectName;

  if (
    !finalOutput ||
    !projectType ||
    !scopeName ||
    !finalProjectName ||
    !author ||
    !email ||
    !githubUserOrOrg ||
    !dependencies ||
    !devDependencies
  ) {
    invariant(false, `Invalid config: ${configPath}`);
  }

  const finalConfig: Config = {
    output: finalOutput,
    projectType,
    scopeName,
    projectName: finalProjectName,
    author,
    authorUrl,
    email,
    githubUserOrOrg,
    dependencies,
    devDependencies,
  };

  return finalConfig;
}

async function readConfig(_configPath: string): Promise<Config> {
  // const configContent = await readTextAsync(configPath);
  // const config = JSON.parse(configContent) as Partial<Config>;

  return {
    output: 'output',
    projectType: 'node',
    scopeName: 'gmjs',
    projectName: 'project',
    author: 'Goran Mržljak',
    email: 'goran.mrzljak@gmail.com',
    authorUrl: 'https://mrzli.com',
    githubUserOrOrg: 'mrzli',
    dependencies: ['tslib'],
    devDependencies: [
      '@gmjs/eslint-config',
      '@gmjs/prettier-config',
      '@gmjs/tsconfig',
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
      'jest',
      'prettier',
      'shx',
      'ts-jest',
      'ts-node',
      'typescript',
    ],
  };
}

run().then(() => {
  console.log('Finished');
});
