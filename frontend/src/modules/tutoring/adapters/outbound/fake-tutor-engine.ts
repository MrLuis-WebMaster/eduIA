import type {
  SendTutorMessageInput,
  SendTutorMessageResult,
  TutorEngine,
} from '../ports';
import { SUBJECT_LABELS, createMessageId } from '../../domain';

const DELAY_MS = 600;

/**
 * Local tutor engine for demos without a backend.
 * Returns Markdown-ish replies so the chat UI can be exercised offline.
 */
export class FakeTutorEngine implements TutorEngine {
  async sendMessage(input: SendTutorMessageInput): Promise<SendTutorMessageResult> {
    if (input.signal?.aborted) {
      const err = new Error('Aborted');
      err.name = 'AbortError';
      throw err;
    }

    await delay(DELAY_MS, input.signal);

    const subjectLabel = SUBJECT_LABELS[input.subject];
    const content = [
      `### Respuesta de práctica (${subjectLabel})`,
      '',
      `Nivel: **${input.difficulty}** · Rol: **${input.userRole}**`,
      '',
      `Recibí tu mensaje:`,
      '',
      `> ${input.message}`,
      '',
      '1. Identifica lo que ya sabes.',
      '2. Divide el problema en pasos pequeños.',
      '3. Comprueba el resultado con un ejemplo concreto.',
      '',
      '_Modo fake — sin llamada a la API._',
    ].join('\n');

    return {
      reply: {
        id: createMessageId('fake'),
        role: 'assistant',
        content,
        createdAt: new Date().toISOString(),
      },
      provider: 'fake',
      model: 'fake-tutor-v1',
      requestId: `fake-${Date.now()}`,
    };
  }
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      const err = new Error('Aborted');
      err.name = 'AbortError';
      reject(err);
      return;
    }

    const timer = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(timer);
      const err = new Error('Aborted');
      err.name = 'AbortError';
      reject(err);
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}
