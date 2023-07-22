import { join } from 'node:path';
import {
  createFileAsync,
  writeBinaryAsync,
  writeTextAsync,
} from '@gmjs/fs-async';
import { FilePathBinaryContent, FilePathTextContent } from '@gmjs/fs-shared';
import { Config, GeneratedFiles } from '../../types';
import { lastValueFrom, from, mergeMap } from 'rxjs';

export async function writeGeneratedFiles(
  config: Config,
  files: GeneratedFiles,
): Promise<void> {
  const { textFiles, binaryFiles } = files;

  if (textFiles.length > 0) {
    await lastValueFrom(
      from(textFiles).pipe(
        mergeMap((file) => from(writeTextFile(config.output, file))),
      ),
    );
  }

  if (binaryFiles.length > 0) {
    await lastValueFrom(
      from(binaryFiles).pipe(
        mergeMap((file) => from(writeBinaryFile(config.output, file))),
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
