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
import {
  FileItem,
  FilePathWithTextContent,
  fromFindFsEntries,
  writeTextFileAsync,
} from './util/fs';
import { pathExtension, readTextAsync, ensureFileAsync } from '@gmjs/fs-util';
import { Config } from './types/types';
import { generatePackageJson } from './generators/package-json';

export async function generate(config: Config): Promise<void> {
  const templatesPath = './templates/project';

  const filesFromTemplates: readonly FilePathWithTextContent[] =
    await lastValueFrom(
      fromFindFsEntries(templatesPath).pipe(
        filter((item) => item.stats.isFile()),
        mergeMap<FileItem, ObservableInput<FilePathWithTextContent>>((item) => {
          return from(processTemplateFile(item.path, templatesPath, config));
        }),
        toArray()
      )
    );

  const filesFromNonTemplates = await generateNonTemplateFiles(config);

  const files: readonly FilePathWithTextContent[] = [
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
  file: FilePathWithTextContent
): Promise<void> {
  const targetFilePath = join(destinationDirectory, file.path);
  await ensureFileAsync(targetFilePath);
  await writeTextFileAsync(targetFilePath, file.content);
}

async function processTemplateFile(
  fullFilePath: string,
  templatesPath: string,
  config: Config
): Promise<FilePathWithTextContent> {
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
): Promise<readonly FilePathWithTextContent[]> {
  const packageJson = await generatePackageJson(config);

  return [
    {
      path: 'package.json',
      content: packageJson,
    },
  ];
}
