import { TemplateMappingEntry } from './template-mapping-entry';

export interface TemplateMappingGroup {
  readonly group: string;
  readonly files: readonly TemplateMappingEntry[];
}
