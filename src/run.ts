import { generateProject } from './impl';
import { GenerateInput } from './types';

async function run(): Promise<void> {
  const config = getConfig();
  await generateProject(config);
}

function getConfig(): GenerateInput {
  const experimentDir =
    'C:\\Users\\Mrzli\\Development\\Projects\\private\\projects\\js\\trading';

  return {
    output: experimentDir,
    projectName: 'gm-trading-fe',
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
        kind: 'react',
      },
    },
  };
}

run().then(() => {
  console.log('Finished');
});
