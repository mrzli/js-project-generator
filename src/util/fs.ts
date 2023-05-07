import klaw from 'klaw';
import { Observable } from 'rxjs';
import { FilePathStats } from '@gmjs/fs-shared';

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
