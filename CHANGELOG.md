# Change Log

All notable changes to the "cli-wrapper" will be documented in this file.

## [Unreleased]

### Changed

- Use pnpm scripts instead of npm scripts in generated `package.json`.
- Use flat EsLint configuration in this project.
- Update packages to latest versions.
- Update 'nest' generator to use `example` module.
- Update 'nest' generator to generate `frontendUrl` env variable.
- Implement 'app-react' generator.
- Implement 'lib-browser' generator.
- Change inputs to only have one level of project type, instead of project/template type combination that was previsouly used.
- Update `package.json` in publishable projects to include packaging scripts and other smaller changes.
- Update tsconfig lib to use `es2023` instead of `es2022`.
- Remove references to `@gmjs/tsconfig` and `@gmjs/prettier-config` from generated code and the project, and use direct configurations instead.
- Other generated files improvements and fixes.

### Added

- Implement 'nest' generator.

## [0.0.22] - 2023-09-03

### Changed

- Revert to old moduleResolution strategy in generated tsconfig.json.

## [0.0.21] - 2023-09-03

### Changed

- Use 'main' instead of 'exports' in generated package.json.

## [0.0.20] - 2023-09-03

### Changed

- Small update to generated tsconfig.json.

## [0.0.19] - 2023-09-03

### Changed

- Update generated tsconfig for app cli project.

## [0.0.18] - 2023-09-02

### Changed

- Update packages to latest versions.
- Update package.json generation.
- Update tsconfig generation.

## [0.0.17] - 2023-08-18

### Changed

- Update packages to latest versions.
- Use new publishing process.

## [0.0.16] - 2023-07-22

### Changed

- Update packages to latest versions.

## [0.0.15] - 2023-07-22

### Changed

- Add `spec.ts` files to the exclusion list for production builds.

## [0.0.14] - 2023-06-09

### Fixed

- Fix `lint:nofix` script.

## [0.0.13] - 2023-06-04

### Changed

- Use `@gmjs/npm-publish-cli` for publishing in generated project.

## [0.0.12] - 2023-06-04

### Changed

- Use `@gmjs/npm-publish-cli` for publishing this project.

## [0.0.11] - 2023-06-04

### Fixed

- Fix double application of `output` directory option when generating a project.

## [0.0.10] - 2023-06-03

### Added

- Add tests for config validation.

### Fixed

- Fix issues with config validations.

## [0.0.9] - 2023-06-03

### Changed

- Small change related to project type typing.

## [0.0.8] - 2023-06-03

### Changed

- Hardcode dependencies for generated `package.json` files instead of having them in a config.
- Add validation for input config.
- Improve configuration types.

## [0.0.7] - 2023-06-03

### Fixed

- Fix data file paths so they work when this package is used as a dependency.

## [0.0.6] - 2023-06-03

### Fixed

- Fix `main` and `bin` fields in `package.json` for this project, and for project generation.

## [0.0.5] - 2023-06-03

### Fixed

- Fix published data.

## [0.0.4] - 2023-06-02

### Fixed

- By default only build files in `src` directory.

## [0.0.3] - 2023-06-02

### Changed

- Add shebang to `index.ts` for generated cli project.

## [0.0.2] - 2023-05-14

### Changed

- **Breaking:** Update `generateProject()` to generate a jest config file which uses a published shared configuration.

## [0.0.1] - 2023-05-14

### Added

- Add `generateProject()` function.
- Add everything else necessary for initial release.

<!--
See: https://common-changelog.org/

## [0.0.1] - 2023-01-01

### Changed

### Added

### Removed

### Fixed
-->
