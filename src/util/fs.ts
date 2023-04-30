import { promises as fs, Stats } from 'node:fs';
import klaw from 'klaw';
import { Observable } from 'rxjs';

const ENCODING_UTF8 = 'utf8';

export interface FileItem {
  readonly path: string;
  readonly stats: Stats;
}

export interface FilePathWithTextContent {
  readonly path: string;
  readonly content: string;
}

export function fromFindFsEntries(directory: string): Observable<FileItem> {
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

export async function writeTextFileAsync(
  filePath: string,
  content: string
): Promise<void> {
  await fs.writeFile(filePath, content, ENCODING_UTF8);
}
