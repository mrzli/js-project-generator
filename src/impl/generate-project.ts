import { Config, GenerateInfrastructure } from '../types';
import { getLatestVersion } from '../util';
import { writeGeneratedFiles } from './write/write-files';
import { generate } from './generate';
import { validateConfig } from './validate';

const INFRA: GenerateInfrastructure = {
  getDepLatestVersion: getLatestVersion,
};

export async function generateProject(config: Partial<Config>): Promise<void> {
  const validatedConfig = validateConfig(config);
  const generatedFiles = await generate(validatedConfig, INFRA);
  await writeGeneratedFiles(validatedConfig, generatedFiles);
}
