import { promises as fs } from 'node:fs';
import klaw from 'klaw';
import { Observable } from 'rxjs';
import { ENCODING_UTF8, FilePathStats } from '@gmjs/fs-shared';

export function fromFindFsEntries(
  directory: string
): Observable<FilePathStats> {
  return new Observable((subscriber) => {
    klaw(directory)
      .on('data', (item) => {
        subscriber.next(item);
      })
      .on('error', (error) => {
        subscriber.error(error);
      })
      .on('end', () => {
        subscriber.complete();
      });
  });
}

export async function readTextFileAsync(filePath: string): Promise<string> {
  return await fs.readFile(filePath, ENCODING_UTF8);
}

export async function writeTextFileAsync(
  filePath: string,
  content: string
): Promise<void> {
  await fs.writeFile(filePath, content, ENCODING_UTF8);
}
