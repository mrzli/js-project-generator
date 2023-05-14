# JS Project Generator

Exports code to be used for new JavaScript/Typescript project generation.

## Usage

```bash
npm install --save @gmjs/js-project-generator
```

## Functions

- `generateProject(config: Config): Promise<void>`
  - Description
    - Generates initial files and directories for JS/TS project.
  - Parameters
    - `config: Config` - See details [here](#generateproject-configuration).

### `generateProject` Configuration

A single configuration object is passed to `generateProject` to configure the generation of the project.

All fields are required unless otherwise noted.

#### Fields

- `output`
  - Description
    - Directory to output generated project to.
    - If relative path, it is relative to the current working directory.
    - Project files are output to the `<output>/<project-name>` directory.
- `projectType`
  - Description
    - Type of project to generate.
  - Allowed values
    - `shared`
      - Description
        - Generates a shared library project (to be in both browser and node environments).
    - `node`
      - Description
        - Generates a Node.js library project.
    - `browser`
      - Description
        - Generates a browser library project.
        - Not yet implemented.
    - `react` (not yet properly implemented)
      - Description
        - Generates a React application project.
        - Not yet properly implemented.
    - `cli`
      - Description
        - Generates a CLI application project.
- `scopeName` - NPM scope.
- `projectName`
  - Description
    - Base project name.
    - Used (along with scope) to generate the NPM package name, used as a directory name for the generated project files, and used as GitHub repository name.
    - In case of a `cli` project, where `commandName` is not specified, it also used as a command name.
- `commandName`
  - Description
    - Optional.
    - Only used fo `cli` projects.
    - Command name for the CLI application.
    - If not specified, `projectName` is used instead.
- `author` - Author name.
- `email` - Author email.
- `authorUrl`
  - Description
    - Optional.
    - URL to the author's website.
- `githubUserOrOrg` - GitHub user or organization name.
- `dependencies`
  - Description
    - List of NPM dependencies to install.
    - Specific types of projects may require specific dependencies. See [examples](#examples).
- `devDependencies`
  - Description
    - List of NPM dev dependencies to install.
    - Specific types of projects may require specific dev dependencies. See [examples](#examples).

## Examples

See examples [here](src/impl/generate/test-assets).
