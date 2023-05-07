import { relative, join } from 'node:path';
import {
  ObservableInput,
  filter,
  from,
  lastValueFrom,
  mergeMap,
  toArray,
} from 'rxjs';
import ejs from 'ejs';
import { fromFindFsEntries } from './util/fs';
import { Config } from './types/types';
import { generatePackageJson } from './generators/package-json';
import { FilePathStats, FilePathTextContent } from '@gmjs/fs-shared';
import { createFileAsync, readTextAsync, writeTextAsync } from '@gmjs/fs-async';
import { pathExtension } from '@gmjs/path';

export async function generate(config: Config): Promise<void> {
  const templatesPath = './templates/project';

  const filesFromTemplates: readonly FilePathTextContent[] =
    await lastValueFrom(
      fromFindFsEntries(templatesPath).pipe(
        filter((item) => item.stats.isFile()),
        mergeMap<FilePathStats, ObservableInput<FilePathTextContent>>(
          (item) => {
            return from(processTemplateFile(item.path, templatesPath, config));
          }
        ),
        toArray()
      )
    );

  const filesFromNonTemplates = await generateNonTemplateFiles(config);

  const files: readonly FilePathTextContent[] = [
    ...filesFromTemplates,
    ...filesFromNonTemplates,
  ];

  await lastValueFrom(
    from(files).pipe(
      mergeMap((file) => from(writeTextFile(config.output, file)))
    )
  );
}

async function writeTextFile(
  destinationDirectory: string,
  file: FilePathTextContent
): Promise<void> {
  const targetFilePath = join(destinationDirectory, file.path);
  await createFileAsync(targetFilePath);
  await writeTextAsync(targetFilePath, file.content);
}

async function processTemplateFile(
  fullFilePath: string,
  templatesPath: string,
  config: Config
): Promise<FilePathTextContent> {
  const relativePath = relative(templatesPath, fullFilePath);
  const content = await readTextAsync(fullFilePath);

  const extension = pathExtension(relativePath);

  if (extension === 'ejs') {
    const processedContent = ejs.render(content, {
      ...config,
      people: ['geddy', 'neil', 'alex'],
    });
    const processedPath = relativePath.replace(/\.ejs$/, '');
    return {
      path: processedPath,
      content: processedContent,
    };
  } else if (extension === 'plain') {
    const processedPath = relativePath.replace(/\.plain$/, '');
    return {
      path: processedPath,
      content,
    };
  }

  return {
    path: relativePath,
    content,
  };
}

async function generateNonTemplateFiles(
  config: Config
): Promise<readonly FilePathTextContent[]> {
  const packageJson = await generatePackageJson(config);

  return [
    {
      path: 'package.json',
      content: packageJson,
    },
  ];
}
