import { invariant } from '@gmjs/assert';
import { SetRequired } from 'type-fest';
import { Config, ConfigBase, ConfigCli, ProjectType } from '../../types';

export type ConfigUnvalidated = Partial<Config>;
export type ConfigValidProjectType = SetRequired<
  ConfigUnvalidated,
  'projectType'
>;

export function validateConfig(config: ConfigUnvalidated): Config {
  const { projectType } = config;

  invariant(!!projectType, `Missing ${'projectType'}.`);

  const configValidProjectType: ConfigValidProjectType = {
    ...config,
    projectType,
  };

  return validateConfigValidProjectType(configValidProjectType);
}

export function validateConfigValidProjectType(
  config: ConfigValidProjectType
): Config {
  const { projectType } = config;

  switch (projectType) {
    case 'shared':
    case 'node':
    case 'browser':
    case 'react': {
      return validateConfigNonCli(projectType, config);
    }
    case 'cli': {
      return validateConfigCli(config);
    }
    default: {
      invariant(false, `Unknown project type: ${projectType}`);
    }
  }
}

function validateConfigNonCli<TProjectType extends Exclude<ProjectType, 'cli'>>(
  projectType: TProjectType,
  config: Partial<ConfigBase>
): Exclude<Config, ConfigCli> {
  return {
    ...validateConfigBase(config),
    projectType,
  };
}

function validateConfigCli(config: Partial<ConfigCli>): ConfigCli {
  const { projectType, commandName } = config;

  invariant(!!projectType, `Missing ${'projectType'}.`);
  invariant(projectType === 'cli', `Project type is expected to be 'cli'.`);
  invariant(!!commandName, `Missing ${'commandName'}.`);

  return {
    ...validateConfigBase(config),
    projectType,
    commandName,
  };
}

function validateConfigBase(config: Partial<ConfigBase>): ConfigBase {
  const {
    projectType,
    output,
    scopeName,
    projectName,
    author,
    email,
    authorUrl,
    githubUserOrOrg,
  } = config;

  invariant(!!projectType, `Missing ${'projectType'}.`);
  invariant(!!output, `Missing ${'output'}.`);
  invariant(!!scopeName, `Missing ${'scopeName'}.`);
  invariant(!!projectName, `Missing ${'projectName'}.`);
  invariant(!!author, `Missing ${'author'}.`);
  invariant(!!email, `Missing ${'email'}.`);
  invariant(!!githubUserOrOrg, `Missing ${'githubUserOrOrg'}.`);

  return {
    projectType,
    output,
    scopeName,
    projectName,
    author,
    email,
    authorUrl,
    githubUserOrOrg,
  };
}
