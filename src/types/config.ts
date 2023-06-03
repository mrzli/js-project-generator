import { ProjectType } from './types';

export interface ConfigBase {
  readonly projectType: ProjectType;
  readonly output: string;
  readonly scopeName: string;
  readonly projectName: string;
  readonly author: string;
  readonly email: string;
  readonly authorUrl?: string;
  readonly githubUserOrOrg: string;
}

export interface ConfigShared extends ConfigBase {
  readonly projectType: 'shared';
}

export interface ConfigNode extends ConfigBase {
  readonly projectType: 'node';
}

export interface ConfigCli extends ConfigBase {
  readonly projectType: 'cli';
  readonly commandName: string;
}

export interface ConfigBrowser extends ConfigBase {
  readonly projectType: 'browser';
}

export interface ConfigReact extends ConfigBase {
  readonly projectType: 'react';
}

export type Config =
  | ConfigShared
  | ConfigNode
  | ConfigCli
  | ConfigBrowser
  | ConfigReact;
