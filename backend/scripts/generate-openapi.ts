/**
 * Generates OpenAPI 3.0 from Zod schemas (single source of truth for request/response shapes).
 *
 * Usage: pnpm --filter backend openapi:generate
 * CI: pnpm --filter backend openapi:check
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { z } from 'zod';

import {
  apiErrorBodySchema,
  tutorMessageBodySchema,
  tutorMessageResponseSchema,
} from '../src/modules/tutoring/adapters/inbound/http/tutor.schema.js';
import { healthResponseSchema } from '../src/modules/health/health.schema.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '../../docs/reference/openapi.json');

function toOpenApiSchema(schema: z.ZodType, name: string) {
  const json = z.toJSONSchema(schema, {
    target: 'openapi-3.0',
    unrepresentable: 'any',
  }) as Record<string, unknown>;
  delete json.$schema;
  delete json.id;
  return { ...json, title: name };
}

function buildDocument() {
  const schemas = {
    TutorMessageBody: toOpenApiSchema(tutorMessageBodySchema, 'TutorMessageBody'),
    TutorMessageResponse: toOpenApiSchema(
      tutorMessageResponseSchema,
      'TutorMessageResponse',
    ),
    ApiErrorBody: toOpenApiSchema(apiErrorBodySchema, 'ApiErrorBody'),
    HealthResponse: toOpenApiSchema(healthResponseSchema, 'HealthResponse'),
  };

  return {
    openapi: '3.0.3',
    info: {
      title: 'EduIA API',
      version: '0.1.0',
      description:
        'HTTP API for EduIA tutoring. Request/response schemas are generated from Zod.',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Local development',
      },
    ],
    paths: {
      '/api/v1/health': {
        get: {
          operationId: 'getHealth',
          summary: 'Liveness',
          tags: ['Health'],
          responses: {
            '200': {
              description: 'Service is up',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/HealthResponse' },
                },
              },
            },
          },
        },
      },
      '/api/v1/tutor/messages': {
        post: {
          operationId: 'postTutorMessage',
          summary: 'Generate tutor reply',
          tags: ['Tutoring'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TutorMessageBody' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Tutor reply',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/TutorMessageResponse' },
                },
              },
            },
            '400': {
              description: 'Validation error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiErrorBody' },
                },
              },
            },
            '429': {
              description: 'Rate limit exceeded',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiErrorBody' },
                },
              },
            },
            '502': {
              description: 'AI provider error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiErrorBody' },
                },
              },
            },
            '504': {
              description: 'AI provider timeout',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiErrorBody' },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas,
    },
  };
}

function main() {
  const checkOnly = process.argv.includes('--check');
  const document = buildDocument();
  const next = `${JSON.stringify(document, null, 2)}\n`;

  mkdirSync(dirname(outPath), { recursive: true });

  if (checkOnly) {
    let current = '';
    try {
      current = readFileSync(outPath, 'utf8');
    } catch {
      console.error(
        `Missing ${outPath}. Run: pnpm --filter backend openapi:generate`,
      );
      process.exit(1);
    }
    if (current !== next) {
      console.error(
        'docs/reference/openapi.json is out of date. Run: pnpm --filter backend openapi:generate',
      );
      process.exit(1);
    }
    console.log('openapi.json is up to date');
    return;
  }

  writeFileSync(outPath, next, 'utf8');
  console.log(`Wrote ${outPath}`);
}

main();
