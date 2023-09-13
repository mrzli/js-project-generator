import Ajv, { JSONSchemaType } from 'ajv';
import { TemplateMappingFile } from '../../../types';
import { invariant } from '@gmjs/assert';

const AJV = new Ajv();

const SCHEMA: JSONSchemaType<TemplateMappingFile> = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      group: { type: 'string' },
      files: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            fr: {
              type: 'string',
              pattern: `\\.(?:plain|ejs|bin)$`,
            },
            to: { type: 'string' },
          },
          required: ['fr', 'to'],
          additionalProperties: false,
        },
      },
    },
    required: ['group', 'files'],
    additionalProperties: false,
  },
};

const validateTemplateMapping = AJV.compile(SCHEMA);

export function parseTemplateMappingFile(content: string): TemplateMappingFile {
  const data = JSON.parse(content);
  const isValid = validateTemplateMapping(data);
  if (!isValid) {
    console.error(validateTemplateMapping.errors);
    invariant(false, 'Invalid template mapping data.');
  }

  return data;
}
