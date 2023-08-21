import { FilePathTextContent, FilePathBinaryContent } from '@gmjs/fs-shared';

export interface GeneratedFiles {
  readonly textFiles: readonly FilePathTextContent[];
  readonly binaryFiles: readonly FilePathBinaryContent[];
}
