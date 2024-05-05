import {
  ProjectDataAny,
  ProjectDataAppReact,
  ProjectDataAppVanilla,
} from '../types';

export function isFrontendProject(
  projectData: ProjectDataAny,
): projectData is ProjectDataAppVanilla | ProjectDataAppReact {
  const kind = projectData.kind;
  return kind === 'app-vanilla' || kind === 'app-react';
}
