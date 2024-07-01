import {
  GenerateInput,
  ProjectDataAppReact,
  ProjectDataAppVanilla,
} from '../../../../types';

export function getScripts(input: GenerateInput): Record<string, string> {
  const { projectData } = input;
  const { kind: projectKind } = projectData;

  switch (projectKind) {
    case 'app-vanilla': {
      return getScriptsVanilla(projectData);
    }
    case 'app-react': {
      return getScriptsReact(projectData);
    }
    case 'app-node': {
      return getScriptsAppNode();
    }
    case 'app-nest': {
      return getScriptsNest();
    }
    default: {
      return getScriptsPublished();
    }
  }
}

function getScriptsVanilla(
  projectData: ProjectDataAppVanilla,
): Record<string, string> {
  return getScriptsVite(projectData.storybook);
}

function getScriptsReact(
  projectData: ProjectDataAppReact,
): Record<string, string> {
  return getScriptsVite(projectData.storybook);
}

function getScriptsVite(storybook: boolean): Record<string, string> {
  const scriptsStorybook: Record<string, string> = storybook
    ? {
        storybook: 'storybook dev -p 6006',
        'build-storybook': 'storybook build',
      }
    : {};

  return {
    dev: 'vite',
    build: 'tsc && vite build',
    lint: 'eslint --fix . && prettier --write .',
    test: 'vitest run --passWithNoTests',
    testw: 'vitest watch --passWithNoTests',
    preview: 'vite preview',
    ...scriptsStorybook,
  };
}

function getScriptsNest(): Record<string, string> {
  return {
    build: 'shx rm -rf ./dist && nest build',
    format: 'prettier --write .',
    start: 'nest start',
    'start:dev': 'nest start --watch',
    'start:debug': 'nest start --debug --watch',
    'start:prod': 'node dist/src/main',
    lint: 'eslint --fix .',
    test: 'jest',
    'test:debug':
      'node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand',
    'test:e2e': 'jest --config ./test/jest-e2e.json',
  };
}

function getScriptsAppNode(): Record<string, string> {
  return {
    dev: 'ts-node src/main.ts',
    'dev:watch': 'nodemon src/main.ts',
    lint: 'eslint --fix . && prettier --write .',
    'lint:nofix': 'eslint . && prettier --check .',
    test: 'jest --passWithNoTests',
    'test+': 'pnpm run lint && pnpm run test',
  };
}

function getScriptsPublished(): Record<string, string> {
  return {
    dev: 'ts-node src/index.ts',
    lint: 'eslint --fix . && prettier --write .',
    'lint:nofix': 'eslint . && prettier --check .',
    test: 'jest --passWithNoTests',
    'test+': 'pnpm run lint && pnpm run test',
    clean: 'shx rm -rf ./dist',
    build: 'pnpm run clean && tsc --project tsconfig.lib.json',
    'build+': 'pnpm run test+ && pnpm run build',
    pac: 'pnpmpub pack -c project.json',
    'pac+': 'pnpm run build+ && pnpm run pac',
    pub: 'pnpmpub pub -c project.json',
    'pub+': 'pnpm run pac+ && pnpm run pub',
  };
}
