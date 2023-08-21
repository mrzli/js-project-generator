import ejs from 'ejs';
import { FilePathBinaryContent, FilePathTextContent } from '@gmjs/fs-shared';
import { readBinaryAsync, readTextAsync } from '@gmjs/fs-async';
import { join, pathExtension } from '@gmjs/path';
import { invariant } from '@gmjs/assert';
import {
  GenerateInput,
  GenerateInfrastructure,
  GeneratedFiles,
  TemplateMappingEntry,
} from '../../types';
import { generatePackageJson } from './generators';
import { getAppCliTemplateOrUndefined, getEslintProjectType } from '../../util';

export async function generate(
  input: GenerateInput,
  infra: GenerateInfrastructure,
): Promise<GeneratedFiles> {
  const templateMappings = await getTemplateMappings(input);

  const filesFromTemplates = await getTemplateGeneratedFiles(
    input,
    templateMappings,
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

async function getTemplateMappings(
  input: GenerateInput,
): Promise<readonly TemplateMappingEntry[]> {
  const { kind: projectKind, template } = input.projectData;
  const { kind: templateKind } = template;

  const templateMappingsContent = await readTextAsync(
    join(
      __dirname,
      TEMPLATE_MAPPINGS_DIRECTORY,
      projectKind,
      `${templateKind}.json`,
    ),
  );
  return JSON.parse(templateMappingsContent);
}

async function getTemplateGeneratedFiles(
  input: GenerateInput,
  templateMappings: readonly TemplateMappingEntry[],
): Promise<GeneratedFiles> {
  const textFiles: FilePathTextContent[] = [];
  const binaryFiles: FilePathBinaryContent[] = [];

  for (const mapping of templateMappings) {
    const { template, target } = mapping;
    const finalPath = toFinalPath(target, input);

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
  const { authorData, projectName } = input;
  const { scopeName, author, email, authorUrl, githubAccount } = authorData;
  const commandName = getAppCliTemplateOrUndefined(input)?.commandName;

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
    textFiles: [
      {
        path: toFinalPath('package.json', input),
        content: packageJson,
      },
    ],
    binaryFiles: [],
  };
}

function toFinalPath(filePath: string, input: GenerateInput): string {
  const { projectName } = input;
  return join(projectName, filePath);
}

const TEMPLATE_MAPPINGS_DIRECTORY = '../../../data/mappings';
const TEMPLATE_FILES_DIRECTORY = '../../../data/files';
