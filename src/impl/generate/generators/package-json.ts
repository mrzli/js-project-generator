import { lastValueFrom, from, mergeMap, toArray, map } from 'rxjs';
import {
  Config,
  DependencyWithVersion,
  GenerateInfrastructure,
} from '../../../types';
import { getCommandName } from '../../../util';

export async function generatePackageJson(
  config: Config,
  infra: GenerateInfrastructure
): Promise<string> {
  const data = await getPackageJsonData(config, infra);
  return JSON.stringify(data, undefined, 2) + '\n';
}

async function getPackageJsonData(
  config: Config,
  infra: GenerateInfrastructure
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
    config.dependencies,
    infra
  );
  const devDependencies = await getDependenciesWithVersions(
    config.devDependencies,
    infra
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
    bin:
      projectType === 'cli'
        ? { [getCommandName(config)]: `dist/index.js` }
        : undefined,
    scripts: {
      'start:dev': 'ts-node src/index.ts',
      lint: 'eslint --fix . && prettier --write .',
      'lint:nofix': 'eslint . && prettier .',
      'test-only': 'jest --passWithNoTests',
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
  deps: readonly string[],
  infra: GenerateInfrastructure
): Promise<readonly DependencyWithVersion[]> {
  return await lastValueFrom(
    from(deps).pipe(
      mergeMap((dep) => from(toDependencyWithVersion(dep, infra))),
      toArray(),
      map((deps) => deps.sort((a, b) => a.name.localeCompare(b.name)))
    )
  );
}

async function toDependencyWithVersion(
  dep: string,
  infra: GenerateInfrastructure
): Promise<DependencyWithVersion> {
  const version = await infra.getDepLatestVersion(dep);
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
