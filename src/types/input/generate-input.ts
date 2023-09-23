import { AuthorData } from './author-data';
import { ProjectDataAny } from './project-data';

export interface GenerateInput {
  readonly output: string;
  readonly projectName: string;
  readonly authorData: AuthorData;
  readonly projectData: ProjectDataAny;
}
