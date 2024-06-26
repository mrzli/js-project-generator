import { generateProject } from '../impl';
import { GenerateInput } from '../types';
import { parseEnv } from './env';

import './setup-env';

async function run(): Promise<void> {
  const config = getConfig();
  await generateProject(config);
}

function getConfig(): GenerateInput {
  const env = parseEnv(process.env);

  const experimentDir = env.targetDir;

  return {
    output: experimentDir,
    projectName: 'example-lib-node',
    authorData: {
      scopeName: 'gmjs',
      author: 'Goran Mržljak',
      email: 'goran.mrzljak@gmail.com',
      authorUrl: 'https://mrzli.com',
      githubAccount: 'mrzli',
    },
    projectData: {
      kind: 'lib-node',
    },
  };
}

run().then(() => {
  console.log('Finished');
});
