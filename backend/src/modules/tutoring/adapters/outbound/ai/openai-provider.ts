import OpenAI from 'openai';

import { AppError } from '@/shared/errors/app-error.js';
import type {
  AIProvider,
  GenerateCompletionInput,
  GenerateCompletionResult,
} from '../../../application/ports/ai-provider.js';

export interface OpenAIProviderOptions {
  apiKey: string;
  model?: string;
}

export class OpenAIProvider implements AIProvider {
  readonly name = 'openai';
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(options: OpenAIProviderOptions) {
    this.client = new OpenAI({ apiKey: options.apiKey });
    this.model = options.model ?? 'gpt-4o-mini';
  }

  async generateCompletion(
    input: GenerateCompletionInput,
  ): Promise<GenerateCompletionResult> {
    if (input.signal?.aborted) {
      throw AppError.aiTimeout();
    }

    try {
      // Responses API is the current OpenAI Node SDK surface (not Chat Completions).
      const response = await this.client.responses.create(
        {
          model: this.model,
          temperature: 0.6,
          input: input.messages.map((message) => ({
            role: message.role === 'system' ? 'developer' : message.role,
            content: message.content,
          })),
        },
        { signal: input.signal },
      );

      const content = response.output_text?.trim();
      if (!content) {
        throw AppError.aiProvider('OpenAI returned an empty response', true);
      }

      return {
        content,
        provider: this.name,
        model: response.model ?? this.model,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (input.signal?.aborted || isAbortLike(error)) {
        throw AppError.aiTimeout();
      }

      if (error instanceof OpenAI.APIError) {
        const retryable = error.status === 429 || (error.status ?? 0) >= 500;
        throw AppError.aiProvider(
          `OpenAI error${error.status ? ` (${error.status})` : ''}: ${error.message}`,
          retryable,
        );
      }

      throw AppError.aiProvider(
        error instanceof Error ? error.message : 'OpenAI request failed',
        true,
      );
    }
  }
}

function isAbortLike(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const name = 'name' in error ? String(error.name) : '';
  return name === 'AbortError' || name === 'APIUserAbortError';
}
