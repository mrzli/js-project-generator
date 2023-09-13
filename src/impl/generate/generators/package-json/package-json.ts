import { lastValueFrom, from, mergeMap, toArray, map } from 'rxjs';
import {
  DependencyWithVersion,
  GenerateInfrastructure,
  GenerateInput,
} from '../../../../types';
import { getDependencies, getDevDependencies } from './dependencies';
import { getScripts } from './scripts';

export async function generatePackageJson(
  input: GenerateInput,
  infra: GenerateInfrastructure,
): Promise<string> {
  const data = await getPackageJsonData(input, infra);
  return JSON.stringify(data, undefined, 2) + '\n';
}

async function getPackageJsonData(
  input: GenerateInput,
  infra: GenerateInfrastructure,
): Promise<Record<string, unknown>> {
  const { projectName, authorData, projectData } = input;
  const { scopeName, author, email, authorUrl, githubAccount } = authorData;
  const { kind: projectKind, template } = projectData;

  const isDeployedApp = projectKind === 'app' && template.kind !== 'cli';

  const commandName =
    projectKind === 'app' && template.kind === 'cli'
      ? template.commandName
      : undefined;

  const dependencies = await getDependenciesWithVersions(
    sortDependencies(getDependencies(input)),
    infra,
  );
  const devDependencies = await getDependenciesWithVersions(
    sortDependencies(getDevDependencies(input)),
    infra,
  );

  const fullProjectName = scopeName
    ? `@${scopeName}/${projectName}`
    : projectName;

  const githubUrl = `https://github.com/${githubAccount}/${projectName}`;

  return {
    name: fullProjectName,
    version: '0.0.1',
    description: projectName,
    private: isDeployedApp ? true : undefined,
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
    type: 'commonjs',
    main: isDeployedApp ? undefined : './src/index.js',
    bin: commandName ? { [commandName]: `src/index.js` } : undefined,
    scripts: getScripts(input),
    dependencies: toDependenciesObject(dependencies),
    devDependencies: toDependenciesObject(devDependencies),
    engines: {
      node: '>=18.17.0',
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
