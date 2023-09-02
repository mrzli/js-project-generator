import { GenerateInput, TemplateAppDataCli } from '../types';

export function isAppCliTemplate(input: GenerateInput): boolean {
  const { projectData } = input;
  return projectData.kind === 'app' && projectData.template.kind === 'cli';
}

export function isAppReactTemplate(input: GenerateInput): boolean {
  const { projectData } = input;
  return projectData.kind === 'app' && projectData.template.kind === 'react';
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

  return projectData.kind === 'app' && projectData.template.kind === 'cli'
    ? 'node'
    : projectData.template.kind;
}
