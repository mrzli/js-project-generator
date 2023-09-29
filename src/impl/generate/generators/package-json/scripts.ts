import { GenerateInput, ProjectDataAppReact } from '../../../../types';

export function getScripts(input: GenerateInput): Record<string, string> {
  const { projectData } = input;
  const { kind: projectKind } = projectData;

  if (projectKind === 'app-react') {
    return getScriptsReact(projectData);
  }

  if (projectKind === 'app-nest') {
    return getScriptsNest();
  }

  return getScriptsPublished();
}

function getScriptsReact(
  projectData: ProjectDataAppReact,
): Record<string, string> {
  const scriptsStorybook: Record<string, string> = projectData.storybook
    ? {
        storybook: 'storybook dev -p 6006',
        'build-storybook': 'storybook build',
      }
    : {};

  return {
    dev: 'vite',
    build: 'tsc && vite build',
    lint: 'eslint --report-unused-disable-directives --fix . && prettier --write .',
    test: 'jest --passWithNoTests',
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
    lint: 'eslint --report-unused-disable-directives --fix .',
    test: 'jest',
    'test:debug':
      'node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand',
    'test:e2e': 'jest --config ./test/jest-e2e.json',
  };
}

function getScriptsPublished(): Record<string, string> {
  return {
    dev: 'ts-node src/index.ts',
    lint: 'eslint --report-unused-disable-directives --fix . && prettier --write .',
    'lint:nofix':
      'eslint --report-unused-disable-directives . && prettier --check .',
    'test-only': 'jest --passWithNoTests',
    test: 'pnpm run lint && pnpm run test-only',
    clean: 'shx rm -rf ./dist',
    'build-only': 'pnpm run clean && tsc --project tsconfig.lib.json',
    build: 'pnpm run test && pnpm run build-only',
    'pac-only': 'npmpub pack',
    pac: 'pnpm run build && pnpm run pac-only',
    'pub-only': 'npmpub pub',
    pub: 'pnpm run pac && pnpm run pub-only',
  };
}
