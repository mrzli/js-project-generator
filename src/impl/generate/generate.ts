import { join } from 'node:path';
import ejs from 'ejs';
import { FilePathBinaryContent, FilePathTextContent } from '@gmjs/fs-shared';
import { readBinaryAsync, readTextAsync } from '@gmjs/fs-async';
import { pathExtension } from '@gmjs/path';
import { invariant } from '@gmjs/assert';
import {
  Config,
  GenerateInfrastructure,
  GeneratedFiles,
  TemplateMappingEntry,
} from '../../types';
import { generatePackageJson } from './generators';
import { getEslintProjectType } from '../../util';

export async function generate(
  config: Config,
  infra: GenerateInfrastructure,
): Promise<GeneratedFiles> {
  const templateMappings = await getTemplateMappings(config.projectType);

  const filesFromTemplates = await getTemplateGeneratedFiles(
    config,
    templateMappings,
  );

  const filesFromNonTemplates = await generateNonTemplateFiles(config, infra);

  return {
    textFiles: [
      ...filesFromTemplates.textFiles,
      ...filesFromNonTemplates.textFiles,
    ],
    binaryFiles: [
      ...filesFromTemplates.binaryFiles,
      ...filesFromNonTemplates.binaryFiles,
    ],
  };
}

async function getTemplateMappings(
  projectType: string,
): Promise<readonly TemplateMappingEntry[]> {
  const templateMappingsContent = await readTextAsync(
    join(__dirname, TEMPLATE_MAPPINGS_DIRECTORY, `${projectType}.json`),
  );
  return JSON.parse(templateMappingsContent);
}

async function getTemplateGeneratedFiles(
  config: Config,
  templateMappings: readonly TemplateMappingEntry[],
): Promise<GeneratedFiles> {
  const textFiles: FilePathTextContent[] = [];
  const binaryFiles: FilePathBinaryContent[] = [];

  for (const mapping of templateMappings) {
    const { template, target } = mapping;

    const templateFilePath = join(
      __dirname,
      TEMPLATE_FILES_DIRECTORY,
      template,
    );
    const extension = pathExtension(templateFilePath);

    switch (extension) {
      case 'plain': {
        const content = await readTextAsync(templateFilePath);
        textFiles.push({
          path: toFinalPath(target, config),
          content,
        });
        break;
      }
      case 'ejs': {
        const content = await readTextAsync(templateFilePath);
        const processedContent = ejs.render(
          content,
          getEjsPlaceholders(config),
        );
        textFiles.push({
          path: toFinalPath(target, config),
          content: processedContent,
        });
        break;
      }
      case 'bin': {
        const content = await readBinaryAsync(templateFilePath);
        binaryFiles.push({
          path: toFinalPath(target, config),
          content,
        });
        break;
      }
      default: {
        invariant(false, `Unknown template file type: '${extension}'`);
      }
    }
  }

  return {
    textFiles,
    binaryFiles,
  };
}

function getEjsPlaceholders(config: Config): Record<string, unknown> {
  return {
    ...config,
    commandName: config.projectType === 'cli' ? config.commandName : undefined,
    eslintProjectType: getEslintProjectType(config),
  };
}

async function generateNonTemplateFiles(
  config: Config,
  infra: GenerateInfrastructure,
): Promise<GeneratedFiles> {
  const packageJson = await generatePackageJson(config, infra);

  return {
    textFiles: [
      {
        path: toFinalPath('package.json', config),
        content: packageJson,
      },
    ],
    binaryFiles: [],
  };
}

function toFinalPath(filePath: string, config: Config): string {
  const { projectName } = config;
  return join(projectName, filePath);
}

const TEMPLATE_MAPPINGS_DIRECTORY = '../../../data/mappings';
const TEMPLATE_FILES_DIRECTORY = '../../../data/files';
