import { describe, expect, it } from '@jest/globals';
import { createFsTestCases, FilesContainer } from '@gmjs/test-util';
import { readTextAsync } from '@gmjs/file-system';
import { join } from '@gmjs/path';
import { generate } from './generate';
import { GenerateInfrastructure, GenerateInput } from '../../types';

describe('generate', () => {
  const testCasesParentDirectory = join(__dirname, 'test-assets');

  describe('generateImpl()', () => {
    const testCaseRuns = createFsTestCases(
      testCasesParentDirectory,
      getActualFiles,
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
  const inputContent = await readTextAsync(
    join(testCaseDirectory, 'input/input.json'),
  );
  const input = parseInput(inputContent);

  const infra: GenerateInfrastructure = {
    getDepLatestVersion: () => Promise.resolve('1.0.0'),
  };

  return await generate(input, infra);
}

function parseInput(inputJson: string): GenerateInput {
  const config = JSON.parse(inputJson);
  // validate if necessary
  return config;
}
