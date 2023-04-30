export type ProjectType = 'shared' | 'node' | 'browser' | 'react';

export interface Config {
  readonly output: string;
  readonly projectType: ProjectType;
  readonly scopeName: string;
  readonly projectName: string;
  readonly author: string;
  readonly email: string;
  readonly githubUserOrOrg: string;
  readonly dependencies: readonly string[];
  readonly devDependencies: readonly string[];
}

export interface DependencyWithVersion {
  readonly name: string;
  readonly version: string;
}
