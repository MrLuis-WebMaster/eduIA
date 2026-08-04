import type { Env } from '@/shared/config/env.js';
import { AppError } from '@/shared/errors/app-error.js';
import type { AIProvider } from '../application/ports/ai-provider.js';
import { GenerateTutorResponse } from '../application/use-cases/generate-tutor-response.js';
import { createTutorRouter } from '../adapters/inbound/http/tutor.router.js';
import { FakeAIProvider } from '../adapters/outbound/ai/fake-ai-provider.js';
import { OpenAIProvider } from '../adapters/outbound/ai/openai-provider.js';

export interface TutoringModule {
  router: ReturnType<typeof createTutorRouter>;
  aiProvider: AIProvider;
  generateTutorResponse: GenerateTutorResponse;
}

export function createAIProvider(env: Env): AIProvider {
  switch (env.AI_PROVIDER) {
    case 'fake':
      return new FakeAIProvider();
    case 'openai':
      return new OpenAIProvider({
        apiKey: env.OPENAI_API_KEY,
        model: env.OPENAI_MODEL,
      });
    default:
      throw AppError.configuration(
        `Unsupported AI_PROVIDER: ${String(env.AI_PROVIDER)}`,
      );
  }
}

export function composeTutoring(env: Env): TutoringModule {
  const aiProvider = createAIProvider(env);
  const generateTutorResponse = new GenerateTutorResponse({
    aiProvider,
    timeoutMs: env.AI_REQUEST_TIMEOUT_MS,
  });
  const router = createTutorRouter({
    useCase: generateTutorResponse,
    rateLimitWindowMs: env.TUTOR_RATE_LIMIT_WINDOW_MS,
    rateLimitMax: env.TUTOR_RATE_LIMIT_MAX,
  });

  return {
    router,
    aiProvider,
    generateTutorResponse,
  };
}
