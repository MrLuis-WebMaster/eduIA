import { AppError } from '@/shared/errors/app-error.js';
import type {
  AIProvider,
  GenerateCompletionInput,
  GenerateCompletionResult,
} from '../../../application/ports/ai-provider.js';

/**
 * Deterministic provider for local demos and automated tests.
 * Uses structured `input.context` — never parses the system prompt.
 */
export class FakeAIProvider implements AIProvider {
  readonly name = 'fake';

  async generateCompletion(
    input: GenerateCompletionInput,
  ): Promise<GenerateCompletionResult> {
    if (input.signal?.aborted) {
      throw AppError.aiTimeout();
    }

    const userMessages = input.messages.filter((m) => m.role === 'user');
    const lastUser = userMessages.at(-1)?.content?.trim() ?? '';
    const subject = input.context?.subject?.trim() || 'tu materia';

    const reply = [
      `**(Fake EduIA)** Entiendo tu duda sobre **${subject}**.`,
      '',
      lastUser ? `Sobre: _"${truncate(lastUser, 160)}"_\n` : '',
      '1. Identifica lo que ya sabes.',
      '2. Divide el problema en pasos pequeños.',
      '3. Prueba un ejemplo sencillo y compara el resultado.',
      '',
      '_Respuesta generada por `FakeAIProvider` (sin llamar a un modelo externo)._',
    ]
      .filter(Boolean)
      .join('\n');

    return {
      content: reply,
      provider: this.name,
      model: 'fake-v1',
    };
  }
}

function truncate(value: string, max: number): string {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, max - 1)}…`;
}
