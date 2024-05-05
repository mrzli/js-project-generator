import { ProjectDataAny, ProjectDataAppReact } from '../types';

export function isFrontendProject(
  projectData: ProjectDataAny,
): projectData is ProjectDataAppReact {
  const kind = projectData.kind;
  return kind === 'app-react';
}
