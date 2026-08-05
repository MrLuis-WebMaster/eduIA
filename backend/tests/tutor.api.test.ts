import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../src/app.js';
import type { Env } from '../src/shared/config/env.js';

function testEnv(overrides: Partial<Env> = {}): Env {
  return {
    PORT: 3001,
    NODE_ENV: 'test',
    CORS_ORIGIN: '*',
    AI_PROVIDER: 'fake',
    OPENAI_API_KEY: '',
    OPENAI_MODEL: 'gpt-4o-mini',
    AI_REQUEST_TIMEOUT_MS: 5_000,
    TUTOR_RATE_LIMIT_WINDOW_MS: 60_000,
    TUTOR_RATE_LIMIT_MAX: 100,
    ...overrides,
  };
}

describe('GET /api/v1/health', () => {
  it('returns ok status', async () => {
    const app = createApp({ env: testEnv() });

    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'ok',
      service: 'eduia-api',
    });
    expect(typeof res.body.timestamp).toBe('string');
  });
});

describe('POST /api/v1/tutor/messages', () => {
  const validBody = {
    message: '¿Qué es una fracción?',
    subject: 'Matemáticas',
    difficulty: 'basic' as const,
    userRole: 'student' as const,
    conversation: [] as Array<{ role: 'user' | 'assistant'; content: string }>,
  };

  it('returns a fake provider reply for a valid request', async () => {
    const app = createApp({ env: testEnv() });

    const res = await request(app)
      .post('/api/v1/tutor/messages')
      .send(validBody);

    expect(res.status).toBe(200);
    expect(res.body.provider).toBe('fake');
    expect(res.body.model).toBe('fake-v1');
    expect(typeof res.body.reply).toBe('string');
    expect(res.body.reply.length).toBeGreaterThan(10);
    expect(res.body.reply).toContain('Matemáticas');
    expect(typeof res.body.requestId).toBe('string');
    expect(res.headers['x-request-id']).toBeTruthy();
  });

  it('rejects invalid payloads with VALIDATION_ERROR', async () => {
    const app = createApp({ env: testEnv() });

    const res = await request(app).post('/api/v1/tutor/messages').send({
      message: 'a',
      subject: '',
      difficulty: 'expert',
      userRole: 'admin',
      conversation: Array.from({ length: 11 }, () => ({
        role: 'user',
        content: 'hola',
      })),
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.retryable).toBe(false);
    expect(typeof res.body.error.message).toBe('string');
    expect(typeof res.body.error.requestId).toBe('string');
  });

  it('rejects missing body fields with VALIDATION_ERROR', async () => {
    const app = createApp({ env: testEnv() });

    const res = await request(app).post('/api/v1/tutor/messages').send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toMatchObject({
      code: 'VALIDATION_ERROR',
      retryable: false,
    });
  });

  it('refuses off-subject questions with the fake provider', async () => {
    const app = createApp({ env: testEnv() });

    const res = await request(app)
      .post('/api/v1/tutor/messages')
      .send({
        ...validBody,
        subject: 'Historia',
        message: '¿Qué es una fracción equivalente? Dame ejemplos.',
      });

    expect(res.status).toBe(200);
    expect(res.body.provider).toBe('fake');
    expect(res.body.reply).toContain('filtro de materia');
    expect(res.body.reply).toContain('Matemáticas');
  });

  it('refuses student homework completion with the fake provider', async () => {
    const app = createApp({ env: testEnv() });

    const res = await request(app)
      .post('/api/v1/tutor/messages')
      .send({
        ...validBody,
        subject: 'Lengua',
        message: 'Escríbeme el ensayo completo de literatura',
      });

    expect(res.status).toBe(200);
    expect(res.body.provider).toBe('fake');
    expect(res.body.reply).toContain('rol como tutor');
  });

  it('accepts teacher role requests with the fake provider', async () => {
    const app = createApp({ env: testEnv() });

    const res = await request(app)
      .post('/api/v1/tutor/messages')
      .send({
        ...validBody,
        userRole: 'teacher',
        message: 'Dame ideas para explicar fracciones',
      });

    expect(res.status).toBe(200);
    expect(res.body.provider).toBe('fake');
    expect(typeof res.body.reply).toBe('string');
    expect(res.body.reply.length).toBeGreaterThan(10);
  });

  it('accepts explanationStyle and tutorPersonality', async () => {
    const app = createApp({ env: testEnv() });

    const res = await request(app)
      .post('/api/v1/tutor/messages')
      .send({
        ...validBody,
        explanationStyle: 'socratic',
        tutorPersonality: 'patient',
      });

    expect(res.status).toBe(200);
    expect(res.body.provider).toBe('fake');
    expect(typeof res.body.reply).toBe('string');
  });

  it('rejects invalid explanationStyle or tutorPersonality', async () => {
    const app = createApp({ env: testEnv() });

    const res = await request(app)
      .post('/api/v1/tutor/messages')
      .send({
        ...validBody,
        explanationStyle: 'poetic',
        tutorPersonality: 'chaotic',
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns normalized NOT_FOUND for unknown routes', async () => {
    const app = createApp({ env: testEnv() });

    const res = await request(app).get('/api/v1/missing');

    expect(res.status).toBe(404);
    expect(res.body.error).toMatchObject({
      code: 'NOT_FOUND',
      retryable: false,
    });
    expect(typeof res.body.error.requestId).toBe('string');
  });
});
