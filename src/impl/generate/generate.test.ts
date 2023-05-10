import { join } from 'node:path';
import { describe, expect, it } from '@jest/globals';
import { readFakeFiles, filesToTestString } from '@gmjs/test-util';
import { generate } from './generate';
import { readTextAsync } from '@gmjs/fs-async';
import { Config, GenerateInfrastructure } from '../../types';

describe('generate', () => {
  describe('generate()', () => {
    it('should add 2 to a number', async () => {
      const configContent = await readTextAsync(
        join(__dirname, 'test-assets/example-00/input/config.json')
      );
      const config = parseConfig(configContent);

      const files = await readFakeFiles(
        join(__dirname, 'test-assets/example-00/expected'),
        { sharedDirectoryRelativePath: '../../../shared/files' }
      );

      const infra: GenerateInfrastructure = {
        getDepLatestVersion: () => Promise.resolve('1.0.0'),
      };

      const generatedFiles = await generate(config, infra);

      const expected = filesToTestString(files.textFiles, files.binaryFiles);
      const actual = filesToTestString(
        generatedFiles.textFiles,
        generatedFiles.binaryFiles
      );

      // console.log('expected');
      // console.log(expected);
      // console.log('actual')
      // console.log(actual);

      expect(actual).toBe(expected);
    });
  });
});

function parseConfig(configContent: string): Config {
  const config = JSON.parse(configContent);
  // validate if necessary
  return config;
}
