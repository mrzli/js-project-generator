import { FilePathTextContent, FilePathBinaryContent } from '@gmjs/file-system';

export interface GeneratedFiles {
  readonly textFiles: readonly FilePathTextContent[];
  readonly binaryFiles: readonly FilePathBinaryContent[];
}
