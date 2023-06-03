import { Config } from '../types';

export function getEslintProjectType(config: Config): string {
  return config.projectType === 'cli' ? 'node' : config.projectType;
}
