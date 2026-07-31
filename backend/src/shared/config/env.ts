import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  CORS_ORIGIN: z.string().default('*'),
  AI_PROVIDER: z.enum(['openai', 'fake', 'gemini']).default('fake'),
  OPENAI_API_KEY: z.string().optional().default(''),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
  AI_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(20_000),
  TUTOR_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  TUTOR_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(30),
  LOG_LEVEL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(raw: NodeJS.ProcessEnv = process.env): Env {
  const parsed = envSchema.safeParse(raw);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid environment configuration: ${details}`);
  }

  const env = parsed.data;

  if (env.AI_PROVIDER === 'openai' && !env.OPENAI_API_KEY) {
    throw new Error(
      'OPENAI_API_KEY is required when AI_PROVIDER=openai',
    );
  }

  return env;
}
