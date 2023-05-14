import { join } from 'node:path';
import { generateProject } from './impl';
import { Config } from './types';
import { readTextAsync } from '@gmjs/fs-async';
import { invariant } from '@gmjs/assert';

async function run(): Promise<void> {
  const options: Record<string, unknown> = {
    config: join('example-configs', 'node.json'),
    output: 'output',
    projectName: 'test-util',
  };

  const config = await getConfig(options);
  await generateProject(config);
}

async function getConfig(options: Record<string, unknown>): Promise<Config> {
  const configPath = options['config'] as string;
  const cliOutput = options['output'] as string | undefined;
  const cliProjectName = options['projectName'] as string | undefined;

  const configContent = await readTextAsync(configPath);
  const config = JSON.parse(configContent) as Partial<Config>;

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

run().then(() => {
  console.log('Finished');
});
