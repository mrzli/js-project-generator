export const KINDS_OF_PROJECTS = [
  'app-react',
  'app-nest',
  'app-cli',
  'lib-node',
  'lib-shared',
] as const;

export type ProjectKind = (typeof KINDS_OF_PROJECTS)[number];

export interface ProjectDataBase {
  readonly kind: ProjectKind;
}

export interface ProjectDataAppReact extends ProjectDataBase {
  readonly kind: 'app-react';
}

export interface ProjectDataAppNest extends ProjectDataBase {
  readonly kind: 'app-nest';
}

export interface ProjectDataAppCli extends ProjectDataBase {
  readonly kind: 'app-cli';
  readonly commandName: string;
}

export interface ProjectDataLibNode extends ProjectDataBase {
  readonly kind: 'lib-node';
}

export interface ProjectDataLibShared extends ProjectDataBase {
  readonly kind: 'lib-shared';
}

export type ProjectDataAny =
  | ProjectDataAppReact
  | ProjectDataAppNest
  | ProjectDataAppCli
  | ProjectDataLibNode
  | ProjectDataLibShared;
