import { Config, GenerateInfrastructure } from '../types';
import { getLatestVersion } from '../util';
import { writeGeneratedFiles } from './write-files';
import { generate } from './generate';

const INFRA: GenerateInfrastructure = {
  getDepLatestVersion: getLatestVersion,
};

export async function generateProject(config: Config): Promise<void> {
  const generatedFiles = await generate(config, INFRA);
  await writeGeneratedFiles(config, generatedFiles);
}
