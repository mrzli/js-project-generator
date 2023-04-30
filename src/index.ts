import { join } from 'node:path';
import { Command } from 'commander';
import { invariant } from '@gmjs/util';
import { generate } from './generate';
import { Config } from './types/types';
import { readTextFileAsync } from './util/fs';

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

async function getPackageJson(): Promise<Record<string, unknown>> {
  return JSON.parse(
    await readTextFileAsync(join(__dirname, '..', 'package.json'))
  ) as Record<string, unknown>;
}

function createProgram(packageJson: Record<string, unknown>): Command {
  const program = new Command();
  program
    .name('jsgen')
    .description(packageJson['description'] as string)
    .version(packageJson['version'] as string)
    .usage('<command> [options]');

  program
    // .command('jsgen')
    .description('Generate a new JavaScript/TypeScript project')
    // .argument('<string>', 'string to split')
    .requiredOption('-c, --config <path>', 'path to config file')
    .option('-o, --output <path>', 'output directory')
    .option('-p, --project-name <name>', 'project name');
  return program;
}

async function run(): Promise<void> {
  const packageJson = await getPackageJson();
  const program = createProgram(packageJson);
  program.parse(process.argv);

  const commandName = program.name();
  // eslint-disable-next-line unicorn/prevent-abbreviations
  const args = program.args;
  const options = program.opts();

  console.log(commandName, args, options);

  const config = await getConfig(options);
  await generate(config);
}

async function getConfig(options: Record<string, unknown>): Promise<Config> {
  const configPath = options['config'] as string;
  const cliOutput = options['output'] as string | undefined;
  const cliProjectName = options['projectName'] as string | undefined;

  const config = JSON.parse(
    await readTextFileAsync(configPath)
  ) as Partial<Config>;

  const {
    output,
    projectType,
    scopeName,
    projectName,
    author,
    email,
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
