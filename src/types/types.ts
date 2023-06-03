import { FilePathBinaryContent, FilePathTextContent } from '@gmjs/fs-shared';

export type ProjectType = 'shared' | 'node' | 'cli' | 'browser' | 'react';

export interface DependencyWithVersion {
  readonly name: string;
  readonly version: string;
}

export interface GenerateInfrastructure {
  readonly getDepLatestVersion: (dep: string) => Promise<string>;
}

export interface GeneratedFiles {
  readonly textFiles: readonly FilePathTextContent[];
  readonly binaryFiles: readonly FilePathBinaryContent[];
}

export interface TemplateMappingEntry {
  readonly template: string;
  readonly output: string;
}
