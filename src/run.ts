import { join } from 'node:path';
import { generateProject } from './impl';
import { Config } from './types';
// import { readTextAsync } from '@gmjs/fs-async';

async function run(): Promise<void> {
  const options: Record<string, unknown> = {
    config: join('example-configs', 'node.json'),
    output: 'output',
    projectName: 'jest-config',
  };

  const config = await getConfig(options);
  await generateProject(config);
}

async function getConfig(
  options: Record<string, unknown>
): Promise<Partial<Config>> {
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
  } = config;

  const finalOutput = cliOutput ?? output;
  const finalProjectName = cliProjectName ?? projectName;

  const finalConfig: Partial<Config> = {
    output: finalOutput,
    projectType,
    scopeName,
    projectName: finalProjectName,
    author,
    authorUrl,
    email,
    commandName: projectType === 'cli' ? finalProjectName : undefined,
    githubUserOrOrg,
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
  };
}

run().then(() => {
  console.log('Finished');
});
