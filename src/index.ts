import { join } from 'node:path';
import { generate } from './generate';
import { Config } from './types/types';
import { readTextAsync } from '@gmjs/fs-async';
import { invariant } from '@gmjs/assert';

// const cli = meow(
//   `
//   Usage
//     $ jsgen <input>

//   Options
//     --config, -c  Path to config file
//     --output, -o  Output directory
//     --project-name, -p  Project name

//   Examples
//     $ jsgen --config config.json --output . --project-name my-project
// `,
//   {
//     importMeta: import.meta,
//     flags: {
//       config: {
//         type: 'string',
//         alias: 'c',
//         isRequired: true,
//       },
//       output: {
//         type: 'string',
//         alias: 'o',
//         isRequired: false,
//       },
//       projectName: {
//         type: 'string',
//         alias: 'p',
//         isRequired: false,
//       },
//     },
//   }
// );

// async function getPackageJson(): Promise<Record<string, unknown>> {
//   return JSON.parse(
//     await readTextFileAsync(join(__dirname, '..', 'package.json'))
//   ) as Record<string, unknown>;
// }

async function run(): Promise<void> {
  const options: Record<string, unknown> = {
    config: join('example-configs', 'node.json'),
    output: 'output',
    projectName: 'path',
  };

  const config = await getConfig(options);
  await generate(config);
}

async function getConfig(options: Record<string, unknown>): Promise<Config> {
  const configPath = options['config'] as string;
  const cliOutput = options['output'] as string | undefined;
  const cliProjectName = options['projectName'] as string | undefined;

  const config = JSON.parse(
    await readTextAsync(configPath)
  ) as Partial<Config>;

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
