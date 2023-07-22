import { lastValueFrom, from, mergeMap, toArray, map } from 'rxjs';
import {
  Config,
  DependencyWithVersion,
  GenerateInfrastructure,
} from '../../../../types';
import { getDependencies, getDevDependencies } from './dependencies';

export async function generatePackageJson(
  config: Config,
  infra: GenerateInfrastructure,
): Promise<string> {
  const data = await getPackageJsonData(config, infra);
  return JSON.stringify(data, undefined, 2) + '\n';
}

async function getPackageJsonData(
  config: Config,
  infra: GenerateInfrastructure,
): Promise<Record<string, unknown>> {
  const {
    projectType,
    scopeName,
    projectName,
    author,
    email,
    authorUrl,
    githubUserOrOrg,
  } = config;

  const dependencies = await getDependenciesWithVersions(
    sortDependencies(getDependencies(projectType)),
    infra,
  );
  const devDependencies = await getDependenciesWithVersions(
    sortDependencies(getDevDependencies(projectType)),
    infra,
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
    main: 'src/index.js',
    bin:
      projectType === 'cli'
        ? // eslint-disable-next-line unicorn/consistent-destructuring
          { [config.commandName]: `src/index.js` }
        : undefined,
    scripts: {
      'start:dev': 'ts-node src/index.ts',
      lint: 'eslint --fix . && prettier --write .',
      'lint:nofix': 'eslint . && prettier --check .',
      'test-only': 'jest --passWithNoTests',
      test: 'npm run lint && npm run test-only',
      'build-only': 'shx rm -rf ./dist && tsc --project tsconfig.lib.json',
      build: 'npm run test && npm run build-only',
      'pub-only': 'npmpub',
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

function sortDependencies(deps: readonly string[]): readonly string[] {
  return [...deps].sort((d1, d2) => d1.localeCompare(d2));
}

async function getDependenciesWithVersions(
  deps: readonly string[],
  infra: GenerateInfrastructure,
): Promise<readonly DependencyWithVersion[]> {
  return await lastValueFrom(
    from(deps).pipe(
      mergeMap((dep) => from(toDependencyWithVersion(dep, infra))),
      toArray(),
      map((deps) => deps.sort((a, b) => a.name.localeCompare(b.name))),
    ),
  );
}

async function toDependencyWithVersion(
  dep: string,
  infra: GenerateInfrastructure,
): Promise<DependencyWithVersion> {
  const version = await infra.getDepLatestVersion(dep);
  return {
    name: dep,
    version: `^${version}`,
  };
}

function toDependenciesObject(
  deps: readonly DependencyWithVersion[],
): Record<string, string> {
  return Object.fromEntries(deps.map(({ name, version }) => [name, version]));
}
