import { describe, expect, it } from '@jest/globals';
import { FilesContainer, getFileSystemTestCaseRuns } from '@gmjs/test-util';
import { readTextAsync } from '@gmjs/fs-async';
import { join } from '@gmjs/path';
import { generate } from './generate';
import { Config, GenerateInfrastructure } from '../../types';

describe('generate', () => {
  const testCasesParentDirectory = join(__dirname, 'test-assets');

  describe('generateImpl()', () => {
    const testCaseRuns = getFileSystemTestCaseRuns(
      testCasesParentDirectory,
      getActualFiles,
      {
        sharedDirectoryRelativePath: '../../../shared/files',
      },
    );

    for (const testCaseRun of testCaseRuns) {
      it(testCaseRun.name, async () => {
        const { expected, actual } = await testCaseRun.run();
        expect(actual).toBe(expected);
      });
    }
  });
});

async function getActualFiles(
  testCaseDirectory: string,
): Promise<FilesContainer> {
  const configContent = await readTextAsync(
    join(testCaseDirectory, 'input/config.json'),
  );
  const config = parseConfig(configContent);

  const infra: GenerateInfrastructure = {
    getDepLatestVersion: () => Promise.resolve('1.0.0'),
  };

  return await generate(config, infra);
}

function parseConfig(configContent: string): Config {
  const config = JSON.parse(configContent);
  // validate if necessary
  return config;
}
