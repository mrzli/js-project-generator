import { FilePathBinaryContent, FilePathTextContent } from '@gmjs/fs-shared';

export const PROJECT_TYPE_LIST = [
  'shared',
  'node',
  'cli',
  'browser',
  'react',
] as const;

export type ProjectType = (typeof PROJECT_TYPE_LIST)[number];

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
  readonly target: string;
}
