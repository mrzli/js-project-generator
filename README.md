# JS Project Generator

Contains the code to generate various types of TypeScript projects. See [GenerateInput](#generateinput) for more info.

Can be used directly, or as a dependency in a CLI tool.

## Installation

```bash
npm install --save @gmjs/js-project-generator
```

## API

#### `generateProject`

Generate the project on the file system.

Accepts a single parameter of type [GenerateInput](#generateinput).

Returns a `Promise<void>`, which resolves when the project has been generated.

## Examples

See examples [here](src/impl/generate/test-assets).

## Types

### `GenerateInput`

The is the input to the `generateProject` function - in other words the is the configuration object.

```ts
export interface GenerateInput {
  readonly output: string;
  readonly projectName: string;
  readonly authorData: AuthorData;
  readonly projectData: ProjectDataAny;
}
```

- `output` - Output directory. Project directory is `<output>/<project-name>`.
- `projectName` - Project name. Also the name of the project directory.

```ts
export interface AuthorData {
  readonly scopeName: string;
  readonly author: string;
  readonly email: string;
  readonly authorUrl: string;
  readonly githubAccount: string;
}
```

- `scopeName` - NPM scope name.
- `author` - Author name.
- `email` - Author email.
- `authorUrl` - URL to the homepage of the author.
- `githubAccount` - GitHub account name.

```ts
export const LIST_OF_PROJECT_KINDS = [
  'app-vanilla',
  'app-react',
  'app-node',
  'app-nest',
  'app-cli',
  'lib-browser',
  'lib-node',
  'lib-shared',
] as const;

export type ProjectKind = (typeof LIST_OF_PROJECT_KINDS)[number];

export interface ProjectDataBase {
  readonly kind: ProjectKind;
}

export interface ProjectDataAppVanilla extends ProjectDataBase {
  readonly kind: 'app-vanilla';
  readonly storybook: boolean;
}

export interface ProjectDataAppReact extends ProjectDataBase {
  readonly kind: 'app-react';
  readonly storybook: boolean;
}

export interface ProjectDataAppNode extends ProjectDataBase {
  readonly kind: 'app-node';
}

export interface ProjectDataAppNest extends ProjectDataBase {
  readonly kind: 'app-nest';
}

export interface ProjectDataAppCli extends ProjectDataBase {
  readonly kind: 'app-cli';
  readonly commandName: string;
}

export interface ProjectDataLibBrowser extends ProjectDataBase {
  readonly kind: 'lib-browser';
}

export interface ProjectDataLibNode extends ProjectDataBase {
  readonly kind: 'lib-node';
}

export interface ProjectDataLibShared extends ProjectDataBase {
  readonly kind: 'lib-shared';
}

export type ProjectDataAny =
  | ProjectDataAppVanilla
  | ProjectDataAppReact
  | ProjectDataAppNode
  | ProjectDataAppNest
  | ProjectDataAppCli
  | ProjectDataLibBrowser
  | ProjectDataLibNode
  | ProjectDataLibShared;
```
