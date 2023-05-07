import { lastValueFrom, from, mergeMap, toArray, map } from 'rxjs';
import { Config, DependencyWithVersion } from '../types/types';
import { getLatestVersion } from '../util/npm';
import { compareFnStringAsc, sortArray } from '@gmjs/util';

export async function generatePackageJson(config: Config): Promise<string> {
  const data = await getPackageJsonData(config);
  return JSON.stringify(data, undefined, 2);
}

async function getPackageJsonData(
  config: Config
): Promise<Record<string, unknown>> {
  const { scopeName, projectName, author, email, authorUrl, githubUserOrOrg } =
    config;

  const dependencies = await getDependenciesWithVersions(config.dependencies);
  const devDependencies = await getDependenciesWithVersions(
    config.devDependencies
  );

  const fullProjectName = scopeName
    ? `@${scopeName}/${projectName}`
    : projectName;

  const githubUrl = `https://github.com/${githubUserOrOrg}/${projectName}`;

  return {
    name: fullProjectName,
    version: '0.0.1',
    description: projectName,
    author: {
      name: author,
      email,
      url: authorUrl,
    },
    license: 'MIT',
    keywords: [],
    repository: {
      type: 'git',
      url: githubUrl,
    },
    homepage: githubUrl,
    main: 'dist/index.js',
    files: ['dist'],
    scripts: {
      'start:dev': 'ts-node src/index.ts',
      lint: 'eslint --fix . && prettier --write .',
      'lint:nofix': 'eslint . && prettier .',
      'test-only': 'echo "test"',
      test: 'npm run lint && npm run test-only',
      'build-only': 'shx rm -rf ./dist && tsc --project tsconfig.lib.json',
      build: 'npm run test && npm run build-only',
      'pub-only': 'npm publish --access public',
      pub: 'npm run build && npm run pub-only',
    },
    dependencies: toDependenciesObject(dependencies),
    devDependencies: toDependenciesObject(devDependencies),
    engines: {
      node: '>=16.0.0',
    },
    prettier: '@gmjs/prettier-config',
  };
}

async function getDependenciesWithVersions(
  deps: readonly string[]
): Promise<readonly DependencyWithVersion[]> {
  return await lastValueFrom(
    from(deps).pipe(
      mergeMap((dep) => from(toDependencyWithVersion(dep))),
      toArray(),
      map((deps) =>
        sortArray(deps, (a, b) => compareFnStringAsc(a.name, b.name))
      )
    )
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

function toDependenciesObject(
  deps: readonly DependencyWithVersion[]
): Record<string, string> {
  return Object.fromEntries(deps.map(({ name, version }) => [name, version]));
}
