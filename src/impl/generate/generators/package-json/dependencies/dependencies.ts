import { GenerateInput } from '../../../../../types';
import {
  DEV_DEPENDENCIES_APP_CLI,
  DEV_DEPENDENCIES_APP_NEST,
  DEV_DEPENDENCIES_APP_REACT,
  DEV_DEPENDENCIES_LIB_NODE,
  DEV_DEPENDENCIES_LIB_SHARED,
} from './dev';
import {
  DEPENDENCIES_APP_REACT,
  DEPENDENCIES_APP_NEST,
  DEPENDENCIES_APP_CLI,
  DEPENDENCIES_LIB_NODE,
  DEPENDENCIES_LIB_SHARED,
} from './runtime';

export function getDependencies(input: GenerateInput): readonly string[] {
  switch (input.projectData.kind) {
    case 'app': {
      switch (input.projectData.template.kind) {
        case 'react': {
          return DEPENDENCIES_APP_REACT;
        }
        case 'nest': {
          return DEPENDENCIES_APP_NEST;
        }
        case 'cli': {
          return DEPENDENCIES_APP_CLI;
        }
      }
    }
    case 'lib': {
      switch (input.projectData.template.kind) {
        case 'react': {
          return [];
        }
        case 'browser': {
          return [];
        }
        case 'node': {
          return DEPENDENCIES_LIB_NODE;
        }
        case 'shared': {
          return DEPENDENCIES_LIB_SHARED;
        }
      }
    }
  }
}

export function getDevDependencies(input: GenerateInput): readonly string[] {
  switch (input.projectData.kind) {
    case 'app': {
      switch (input.projectData.template.kind) {
        case 'react': {
          return DEV_DEPENDENCIES_APP_REACT;
        }
        case 'nest': {
          return DEV_DEPENDENCIES_APP_NEST;
        }
        case 'cli': {
          return DEV_DEPENDENCIES_APP_CLI;
        }
      }
    }
    case 'lib': {
      switch (input.projectData.template.kind) {
        case 'react': {
          return [];
        }
        case 'browser': {
          return [];
        }
        case 'node': {
          return DEV_DEPENDENCIES_LIB_NODE;
        }
        case 'shared': {
          return DEV_DEPENDENCIES_LIB_SHARED;
        }
      }
    }
  }
}
