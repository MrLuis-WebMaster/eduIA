import { AppError } from '@/shared/errors/app-error.js';
import type {
  AIProvider,
  GenerateCompletionInput,
  GenerateCompletionResult,
} from '../../../application/ports/ai-provider.js';

/**
 * P1 stub — Gemini is out of P0. Kept so `AI_PROVIDER=gemini` fails clearly.
 */
export class GeminiAIProvider implements AIProvider {
  readonly name = 'gemini';

  async generateCompletion(
    _input: GenerateCompletionInput,
  ): Promise<GenerateCompletionResult> {
    throw AppError.configuration(
      'GeminiAIProvider is not implemented in P0. Use AI_PROVIDER=openai or fake.',
    );
  }
}
