export const KINDS_OF_TEMPLATE_LIB = [
  'shared',
  'node',
  'browser',
  'react',
] as const;

export type TemplateLibKind = (typeof KINDS_OF_TEMPLATE_LIB)[number];

export interface TemplateLibDataBase {
  readonly kind: TemplateLibKind;
}

export interface TemplateLibDataShared extends TemplateLibDataBase {
  readonly kind: 'shared';
}

export interface TemplateLibDataNode extends TemplateLibDataBase {
  readonly kind: 'node';
}

export interface TemplateLibDataBrowser extends TemplateLibDataBase {
  readonly kind: 'browser';
}

export interface TemplateLibDataReact extends TemplateLibDataBase {
  readonly kind: 'react';
}

export type TemplateLibDataAny =
  | TemplateLibDataShared
  | TemplateLibDataNode
  | TemplateLibDataBrowser
  | TemplateLibDataReact;
