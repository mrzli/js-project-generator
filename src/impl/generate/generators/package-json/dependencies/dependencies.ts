import { GenerateInput } from '../../../../../types';
import {
  DEV_DEPENDENCIES_APP_CLI,
  DEV_DEPENDENCIES_APP_NEST,
  DEV_DEPENDENCIES_APP_REACT_BASE,
  DEV_DEPENDENCIES_APP_REACT_STORYBOOK,
  DEV_DEPENDENCIES_LIB_BROWSER,
  DEV_DEPENDENCIES_LIB_NODE,
  DEV_DEPENDENCIES_LIB_SHARED,
} from './dev';
import {
  DEPENDENCIES_APP_REACT,
  DEPENDENCIES_APP_NEST,
  DEPENDENCIES_APP_CLI,
  DEPENDENCIES_LIB_NODE,
  DEPENDENCIES_LIB_SHARED,
  DEPENDENCIES_LIB_BROWSER,
} from './runtime';

export function getDependencies(input: GenerateInput): readonly string[] {
  switch (input.projectData.kind) {
    case 'app-react': {
      return DEPENDENCIES_APP_REACT;
    }
    case 'app-nest': {
      return DEPENDENCIES_APP_NEST;
    }
    case 'app-cli': {
      return DEPENDENCIES_APP_CLI;
    }
    case 'lib-browser': {
      return DEPENDENCIES_LIB_BROWSER;
    }
    case 'lib-node': {
      return DEPENDENCIES_LIB_NODE;
    }
    case 'lib-shared': {
      return DEPENDENCIES_LIB_SHARED;
    }
  }
}

export function getDevDependencies(input: GenerateInput): readonly string[] {
  switch (input.projectData.kind) {
    case 'app-react': {
      return [
        ...DEV_DEPENDENCIES_APP_REACT_BASE,
        ...(input.projectData.storybook
          ? DEV_DEPENDENCIES_APP_REACT_STORYBOOK
          : []),
      ];
    }
    case 'app-nest': {
      return DEV_DEPENDENCIES_APP_NEST;
    }
    case 'app-cli': {
      return DEV_DEPENDENCIES_APP_CLI;
    }
    case 'lib-browser': {
      return DEV_DEPENDENCIES_LIB_BROWSER;
    }
    case 'lib-node': {
      return DEV_DEPENDENCIES_LIB_NODE;
    }
    case 'lib-shared': {
      return DEV_DEPENDENCIES_LIB_SHARED;
    }
  }
}
