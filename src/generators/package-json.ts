import { lastValueFrom, from, mergeMap, toArray, map } from 'rxjs';
import { Config, DependencyWithVersion } from '../types/types';
import { getLatestVersion } from '../util/npm';
import { compareFnStringAsc, sortArray } from '@gmjs/util';

export async function generatePackageJson(config: Config): Promise<string> {
  const data = await getPackageJsonData(config);
  return JSON.stringify(data, null, 2);
}

async function getPackageJsonData(
  config: Config
): Promise<Record<string, unknown>> {
  const { placeholders } = config;
  const { scopeName, projectName, author, email, githubUserOrOrg } =
    placeholders;

  const dependencies = await getDependenciesWithVersions(config.dependencies);
  const devDependencies = await getDependenciesWithVersions(
    config.devDependencies
  );

  const fullProjectName = scopeName
    ? `@${scopeName}/${projectName}`
    : projectName;

  const fullAuthor = email ? `${author} (${email})` : author;

  return {
    name: fullProjectName,
    version: '0.0.1',
    description: projectName,
    author: fullAuthor,
    license: 'MIT',
    keywords: [],
    repository: {
      type: 'git',
      url: `https://github.com/${githubUserOrOrg}/${projectName}`,
    },
    main: 'dist/index.js',
    prettier: '@gmjs/prettier-config',
    scripts: {
      'start:dev': 'ts-node src/index.ts',
      lint: 'eslint --fix . && prettier --write .',
      'lint:nofix': 'eslint . && prettier .',
      'test-only': 'echo "test"',
      test: 'npm run lint && npm run test-only',
      'build-only': 'rm -rf ./dist && tsc',
      build: 'npm run test && npm run build-only',
      'publish-only': 'npm publish --access public',
      publish: 'npm run build && npm run publish-only',
    },
    dependencies: toDependenciesObject(dependencies),
    devDependencies: toDependenciesObject(devDependencies),
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
  return deps.reduce(
    (deps, { name, version }) => ({ ...deps, [name]: version }),
    {}
  );
}
