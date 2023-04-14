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
import { getLatestVersion } from './util/npm';

type ExecutionEnvironment = 'node' | 'browser';

interface Config {
  readonly executionEnvironment: ExecutionEnvironment;
  readonly placeholders: Placeholders;
  readonly dependencies: string[];
  readonly devDependencies: string[];
}

interface Placeholders {
  readonly scopeName: string;
  readonly projectName: string;
  readonly author: string;
  readonly email: string;
  readonly githubUserOrOrg: string;
}

interface DependencyWithVersion {
  readonly name: string;
  readonly version: string;
}

async function generate(config: Config): Promise<void> {
  const templatesPath = './templates';
  const dependencies = await getDependenciesWithVersions(config.dependencies);
  const devDependencies = await getDependenciesWithVersions(
    config.devDependencies
  );

  const files = await lastValueFrom(
    fromFindFsEntries(templatesPath).pipe(
      filter((item) => item.stats.isFile()),
      mergeMap<FileItem, ObservableInput<FilePathWithTextContent>>((item) => {
        return from(
          processTemplateFile(
            item.path,
            templatesPath,
            config,
            dependencies,
            devDependencies
          )
        );
      }),
      toArray()
    )
  );
  console.log(files);
}

async function processTemplateFile(
  fullFilePath: string,
  templatesPath: string,
  config: Config,
  dependencies: readonly DependencyWithVersion[],
  devDependencies: readonly DependencyWithVersion[]
): Promise<FilePathWithTextContent> {
  const relativePath = relative(templatesPath, fullFilePath);
  const content = await readTextAsync(fullFilePath);

  const extension = pathExtension(relativePath);

  if (extension === 'ejs') {
    const processedContent = ejs.render(content, {
      ...config.placeholders,
      dependencies,
      devDependencies,
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

async function getDependenciesWithVersions(
  deps: readonly string[]
): Promise<readonly DependencyWithVersion[]> {
  return await lastValueFrom(
    from(deps)
      .pipe(mergeMap((dep) => from(toDependencyWithVersion(dep))))
      .pipe(toArray())
  );
}

async function toDependencyWithVersion(
  dep: string
): Promise<DependencyWithVersion> {
  const version = await getLatestVersion(dep);
  return {
    name: dep,
    version: `^${version}`,
  };
}

const PLACEHOLDERS: Placeholders = {
  scopeName: 'gmjs',
  projectName: 'test',
  author: 'Goran Mržljak',
  email: 'goran.mrzljak@gmail.com',
  githubUserOrOrg: 'mrzli-js-libs',
};

const CONFIG: Config = {
  placeholders: PLACEHOLDERS,
  dependencies: ['tslib'],
  devDependencies: [
    'eslint-config-prettier',
    'eslint-import-resolver-typescript',
    'eslint-plugin-import',
    // 'eslint-plugin-jsx-a11y',
    // 'eslint-plugin-react',
    // 'eslint-plugin-react-hooks',
    'prettier',
    'typescript',
  ],
};

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
