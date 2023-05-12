import { Config } from '../types';

export function getCommandName(config: Config): string {
  return config.commandName ?? config.projectName;
}

export function getEslintProjectType(config: Config): string {
  return config.projectType === 'cli' ? 'node' : config.projectType;
}
