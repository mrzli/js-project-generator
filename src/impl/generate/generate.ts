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
  const templateMappingFilePaths = getTemplateMappingFilePaths(input);

  const templateMappings = await readTemplateMappingFiles(
    templateMappingFilePaths,
  );

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

function getTemplateMappingFilePaths(input: GenerateInput): readonly string[] {
  const { projectData } = input;
  const { kind: projectKind } = projectData;

  switch (projectKind) {
    case 'app-react': {
      const { storybook } = projectData;
      return [
        'app-react/base.json',
        ...(storybook
          ? ['app-react/storybook-true.json']
          : ['app-react/storybook-false.json']),
      ];
    }
    case 'app-nest': {
      return ['app-nest.json'];
    }
    case 'app-cli': {
      return ['app-cli.json'];
    }
    case 'lib-browser': {
      return ['lib-browser.json'];
    }
    case 'lib-node': {
      return ['lib-node.json'];
    }
    case 'lib-shared': {
      return ['lib-shared.json'];
    }
  }
}

async function readTemplateMappingFiles(
  templateMappingFilePaths: readonly string[],
): Promise<readonly TemplateMappingFile[]> {
  const contents = await Promise.all(
    templateMappingFilePaths.map((file) =>
      readTextAsync(join(__dirname, TEMPLATE_MAPPINGS_DIRECTORY, file)),
    ),
  );

  return contents.map((content) => parseTemplateMappingFile(content));
}

async function getTemplateGeneratedFiles(
  input: GenerateInput,
  templateMappingFiles: readonly TemplateMappingFile[],
): Promise<GeneratedFiles> {
  const textFiles: FilePathTextContent[] = [];
  const binaryFiles: FilePathBinaryContent[] = [];

  const templateMappings = templateMappingFiles
    .flat() // each file is a list of groups, so flatten into a single list of groups
    .flatMap((group) => group.files); // flatten groups into a single list of files

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
  const storybook =
    projectData.kind === 'app-react' ? projectData.storybook : undefined;

  return {
    projectName,
    scopeName,
    author,
    email,
    authorUrl,
    githubAccount,
    commandName,
    storybook,
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
    case 'lib-browser': {
      return 'browser';
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
