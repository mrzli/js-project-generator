import { GenerateInput, TemplateAppDataCli } from '../types';

export function isAppReactTemplate(input: GenerateInput): boolean {
  const { projectData } = input;
  return projectData.kind === 'app' && projectData.template.kind === 'react';
}

export function isAppNestTemplate(input: GenerateInput): boolean {
  const { projectData } = input;
  return projectData.kind === 'app' && projectData.template.kind === 'nest';
}

export function isAppCliTemplate(input: GenerateInput): boolean {
  const { projectData } = input;
  return projectData.kind === 'app' && projectData.template.kind === 'cli';
}

export function getAppCliTemplateOrUndefined(
  input: GenerateInput,
): TemplateAppDataCli | undefined {
  const { projectData } = input;

  return projectData.kind === 'app' && projectData.template.kind === 'cli'
    ? projectData.template
    : undefined;
}

export function getEslintProjectType(input: GenerateInput): string {
  const { projectData } = input;

  const isNode =
    projectData.kind === 'app' &&
    (projectData.template.kind === 'cli' ||
      projectData.template.kind === 'nest');

  return isNode ? 'node' : projectData.template.kind;
}
