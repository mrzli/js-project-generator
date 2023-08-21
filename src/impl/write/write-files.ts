import { join } from '@gmjs/path';
import {
  createFileAsync,
  writeBinaryAsync,
  writeTextAsync,
} from '@gmjs/fs-async';
import { FilePathBinaryContent, FilePathTextContent } from '@gmjs/fs-shared';
import { GenerateInput, GeneratedFiles } from '../../types';
import { lastValueFrom, from, mergeMap } from 'rxjs';

export async function writeGeneratedFiles(
  input: GenerateInput,
  files: GeneratedFiles,
): Promise<void> {
  const { textFiles, binaryFiles } = files;

  if (textFiles.length > 0) {
    await lastValueFrom(
      from(textFiles).pipe(
        mergeMap((file) => from(writeTextFile(input.output, file))),
      ),
    );
  }

  if (binaryFiles.length > 0) {
    await lastValueFrom(
      from(binaryFiles).pipe(
        mergeMap((file) => from(writeBinaryFile(input.output, file))),
      ),
    );
  }
}

async function writeTextFile(
  destinationDirectory: string,
  file: FilePathTextContent,
): Promise<void> {
  const targetFilePath = join(destinationDirectory, file.path);
  await createFileAsync(targetFilePath);
  await writeTextAsync(targetFilePath, file.content);
}

async function writeBinaryFile(
  destinationDirectory: string,
  file: FilePathBinaryContent,
): Promise<void> {
  const targetFilePath = join(destinationDirectory, file.path);
  await createFileAsync(targetFilePath);
  await writeBinaryAsync(targetFilePath, file.content);
}
