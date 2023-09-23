import ejs from 'ejs';
import { FilePathBinaryContent, FilePathTextContent } from '@gmjs/fs-shared';
import { readBinaryAsync, readTextAsync } from '@gmjs/fs-async';
import { join, pathExtension } from '@gmjs/path';
import { invariant } from '@gmjs/assert';
import {
  GenerateInput,
  GenerateInfrastructure,
  GeneratedFiles,
  TemplateMappingFile,
} from '../../types';
import { generatePackageJson } from './generators';
import { filterOutNullish } from '@gmjs/array-transformers';
import { parseTemplateMappingFile } from './util';

export async function generate(
  input: GenerateInput,
  infra: GenerateInfrastructure,
): Promise<GeneratedFiles> {
  const templateMappingFile = await getTemplateMappingFile(input);

  const filesFromTemplates = await getTemplateGeneratedFiles(
    input,
    templateMappingFile,
  );

  const filesFromNonTemplates = await generateNonTemplateFiles(input, infra);

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

async function getTemplateMappingFile(
  input: GenerateInput,
): Promise<TemplateMappingFile> {
  const { kind: projectKind } = input.projectData;

  const content = await readTextAsync(
    join(__dirname, TEMPLATE_MAPPINGS_DIRECTORY, `${projectKind}.json`),
  );

  return parseTemplateMappingFile(content);
}

async function getTemplateGeneratedFiles(
  input: GenerateInput,
  templateMappingFile: TemplateMappingFile,
): Promise<GeneratedFiles> {
  const textFiles: FilePathTextContent[] = [];
  const binaryFiles: FilePathBinaryContent[] = [];

  const templateMappings = templateMappingFile.flatMap((group) => group.files);

  for (const mapping of templateMappings) {
    const { fr, to } = mapping;
    const finalPath = toFinalPath(to, input);

    const templateFilePath = join(__dirname, TEMPLATE_FILES_DIRECTORY, fr);
    const extension = pathExtension(templateFilePath);

    switch (extension) {
      case 'plain': {
        const content = await readTextAsync(templateFilePath);
        textFiles.push({
          path: finalPath,
          content,
        });
        break;
      }
      case 'ejs': {
        const content = await readTextAsync(templateFilePath);
        const processedContent = ejs.render(content, getEjsPlaceholders(input));
        textFiles.push({
          path: finalPath,
          content: processedContent,
        });
        break;
      }
      case 'bin': {
        const content = await readBinaryAsync(templateFilePath);
        binaryFiles.push({
          path: finalPath,
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

function getEjsPlaceholders(input: GenerateInput): Record<string, unknown> {
  const { authorData, projectName, projectData } = input;
  const { scopeName, author, email, authorUrl, githubAccount } = authorData;
  const commandName =
    projectData.kind === 'app-cli' ? projectData.commandName : undefined;

  return {
    projectName,
    scopeName,
    author,
    email,
    authorUrl,
    githubAccount,
    commandName,
    eslintProjectType: getEslintProjectType(input),
  };
}

async function generateNonTemplateFiles(
  input: GenerateInput,
  infra: GenerateInfrastructure,
): Promise<GeneratedFiles> {
  const packageJson = await generatePackageJson(input, infra);

  return {
    textFiles: filterOutNullish([
      {
        path: toFinalPath('package.json', input),
        content: packageJson,
      },
    ]),
    binaryFiles: [],
  };
}

function toFinalPath(filePath: string, input: GenerateInput): string {
  const { projectName } = input;
  return join(projectName, filePath);
}

function getEslintProjectType(input: GenerateInput): string {
  const { projectData } = input;

  switch (projectData.kind) {
    case 'app-react': {
      return 'react';
    }
    case 'app-nest': {
      return 'node';
    }
    case 'app-cli': {
      return 'node';
    }
    case 'lib-node': {
      return 'node';
    }
    case 'lib-shared': {
      return 'shared';
    }
  }
}

const TEMPLATE_MAPPINGS_DIRECTORY = '../../../data/mappings';
const TEMPLATE_FILES_DIRECTORY = '../../../data/files';
