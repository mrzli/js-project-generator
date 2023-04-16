import { lastValueFrom, from, mergeMap, toArray } from 'rxjs';
import { Config, DependencyWithVersion } from '../types/types';
import { getLatestVersion } from '../util/npm';

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
    ? `${scopeName}/${projectName}`
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
    scripts: {
      'start:dev': 'ts-node src/index.ts',
      build: 'rm -rf ./dist && tsc',
    },
    dependencies: toDependenciesObject(dependencies),
    devDependencies: toDependenciesObject(devDependencies),
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

function toDependenciesObject(
  deps: readonly DependencyWithVersion[]
): Record<string, string> {
  return deps.reduce(
    (deps, { name, version }) => ({ ...deps, [name]: version }),
    {}
  );
}
