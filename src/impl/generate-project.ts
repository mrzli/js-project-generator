import { GenerateInfrastructure, GenerateInput } from '../types';
import { getLatestVersion } from '../util';
import { writeGeneratedFiles } from './write/write-files';
import { generate } from './generate';

const INFRA: GenerateInfrastructure = {
  getDepLatestVersion: getLatestVersion,
};

export async function generateProject(input: GenerateInput): Promise<void> {
  const generatedFiles = await generate(input, INFRA);
  await writeGeneratedFiles(input, generatedFiles);
}
