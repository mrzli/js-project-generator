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
import { Config, GenerateInfrastructure, GeneratedFiles } from '../../types';
import { generatePackageJson } from './generators';
import { FilePathStats, FilePathTextContent } from '@gmjs/fs-shared';
import { readTextAsync } from '@gmjs/fs-async';
import { pathExtension } from '@gmjs/path';
import { fromFindFsEntries } from '@gmjs/fs-observable';

export async function generate(
  config: Config,
  infra: GenerateInfrastructure
): Promise<GeneratedFiles> {
  const templatesPath = './data/files/project';

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

  const filesFromNonTemplates = await generateNonTemplateFiles(config, infra);

  const files: readonly FilePathTextContent[] = [
    ...filesFromTemplates,
    ...filesFromNonTemplates,
  ];

  return {
    textFiles: files,
    binaryFiles: [],
  };
  // await lastValueFrom(
  //   from(files).pipe(
  //     mergeMap((file) => from(writeTextFile(config.output, file)))
  //   )
  // );
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
      path: toFinalPath(processedPath, config),
      content: processedContent,
    };
  } else if (extension === 'plain') {
    const processedPath = relativePath.replace(/\.plain$/, '');
    return {
      path: toFinalPath(processedPath, config),
      content,
    };
  }

  return {
    path: toFinalPath(relativePath, config),
    content,
  };
}

async function generateNonTemplateFiles(
  config: Config,
  infra: GenerateInfrastructure
): Promise<readonly FilePathTextContent[]> {
  const packageJson = await generatePackageJson(config, infra);

  return [
    {
      path: toFinalPath('package.json', config),
      content: packageJson,
    },
  ];
}

function toFinalPath(filePath: string, config: Config): string {
  const { projectName, output } = config;
  return join(output, projectName, filePath);
}
