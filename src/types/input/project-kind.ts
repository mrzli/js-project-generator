import { TemplateAppDataAny } from './template-app';
import { TemplateLibDataAny } from './template-lib';

export const KINDS_OF_PROJECTS = ['app', 'lib'] as const;

export type ProjectKind = (typeof KINDS_OF_PROJECTS)[number];

export interface ProjectDataBase {
  readonly kind: ProjectKind;
}

export interface ProjectDataApp extends ProjectDataBase {
  readonly kind: 'app';
  readonly template: TemplateAppDataAny;
}

export interface ProjectDataLib extends ProjectDataBase {
  readonly kind: 'lib';
  readonly template: TemplateLibDataAny;
}

export type ProjectDataAny = ProjectDataApp | ProjectDataLib;
