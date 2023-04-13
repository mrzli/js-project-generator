import fs from 'node:fs';
import klaw from 'klaw';
import { Observable } from 'rxjs';

export interface FileItem {
  readonly path: string;
  readonly stats: fs.Stats;
}

export interface FilePathWithTextContent {
  readonly path: string;
  readonly content: string;
}

export function fromFindFsEntries(dir: string): Observable<FileItem> {
  return new Observable((subscriber) => {
    klaw(dir)
      .on('data', (item) => {
        subscriber.next(item);
      })
      .on('error', (err) => {
        subscriber.error(err);
      })
      .on('end', () => {
        subscriber.complete();
      });
  });
}
