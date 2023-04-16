import { relative } from 'node:path';
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
} from './util/fs';
import { pathExtension, readTextAsync } from '@gmjs/fs-util';
import { CONFIG } from './data';
import { Config } from './types/types';
import { generatePackageJson } from './generators/package-json';

async function generate(config: Config): Promise<void> {
  const templatesPath = './templates';

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

  console.log(files);
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
      ...config.placeholders,
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

generate(CONFIG).then(() => {
  console.log('Finished');
});

// const people = ["geddy", "neil", "alex"];
// const html = ejs.render('<%= people.join(", "); %>', { people: people });

// async function renderFile() {
//   const html = await ejs.renderFile("./src/index.ejs", { people: people });
//   console.log(html);
// }

// renderFile().then(() => console.log("done"));
