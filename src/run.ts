import { generateProject } from './impl';
import { GenerateInput } from './types';

async function run(): Promise<void> {
  const config = getConfig();
  await generateProject(config);
}

function getConfig(): GenerateInput {
  // return {
  //   output: 'output',
  //   projectName: 'test-project',
  //   authorData: {
  //     scopeName: 'scope',
  //     author: 'John Smith',
  //     email: 'john.smith@example.com',
  //     authorUrl: 'https://example.com',
  //     githubAccount: 'johnsmith',
  //   },
  //   projectData: {
  //     kind: 'app',
  //     template: {
  //       kind: 'cli',
  //       commandName: 'test-command',
  //     },
  //   },
  // };
  return {
    output: '../output',
    projectName: 'js-project-generator-cli',
    authorData: {
      scopeName: 'gmjs',
      author: 'Goran Mržljak',
      email: 'goran.mrzljak@gmail.com',
      authorUrl: 'https://mrzli.com',
      githubAccount: 'mrzli',
    },
    projectData: {
      kind: 'app',
      template: {
        kind: 'cli',
        commandName: 'jsgen',
      },
    },
  };
}

run().then(() => {
  console.log('Finished');
});
