import { AppError } from '@/shared';

import type {
  SendTutorMessageInput,
  SendTutorMessageResult,
  TutorEngine,
} from '../ports';
import { SUBJECT_LABELS, createMessageId } from '../../domain';
import { assessLocalTutorScope } from '../../domain/policies/scope-policy';

const DELAY_MS = 600;

/**
 * Local tutor engine for demos without a backend.
 * Returns Markdown-ish replies so the chat UI can be exercised offline.
 */
export class FakeTutorEngine implements TutorEngine {
  async sendMessage(input: SendTutorMessageInput): Promise<SendTutorMessageResult> {
    if (input.signal?.aborted) {
      throw new AppError('CANCELLED', 'Solicitud cancelada', { retryable: true });
    }

    try {
      await delay(DELAY_MS, input.signal);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new AppError('CANCELLED', 'Solicitud cancelada', {
          retryable: true,
          cause: error,
        });
      }
      throw error;
    }

    const scope = assessLocalTutorScope({
      subject: input.subject,
      userRole: input.userRole,
      message: input.message,
    });

    if (!scope.ok) {
      return {
        reply: {
          id: createMessageId('fake'),
          role: 'assistant',
          content: scope.reply,
          createdAt: new Date().toISOString(),
        },
        provider: 'fake',
        model: 'fake-tutor-v1',
        requestId: `fake-${Date.now()}`,
      };
    }

    const subjectLabel = SUBJECT_LABELS[input.subject];
    const opening =
      input.tutorPersonality === 'direct'
        ? 'Idea clave:'
        : input.tutorPersonality === 'formal'
          ? 'Explicación estructurada:'
          : input.tutorPersonality === 'motivating'
            ? '¡Vamos! Construyamos desde aquí:'
            : 'Te acompaño con esto:';
    const depth =
      input.difficulty === 'advanced'
        ? 'Incluyo un matiz / caso límite (nivel avanzado).'
        : input.difficulty === 'intermediate'
          ? 'Incluyo un ejemplo trabajado (nivel intermedio).'
          : 'Lo dejo en lenguaje sencillo (nivel básico).';
    const styleSteps =
      input.explanationStyle === 'socratic'
        ? [
            '1. ¿Qué parte del problema ya tienes clara?',
            '2. ¿Qué pasaría si cambias un dato?',
            '3. Luego esbozamos la solución juntos.',
          ]
        : input.explanationStyle === 'detailed'
          ? [
              '1. Contexto breve.',
              '2. Ejemplo con pasos.',
              '3. Variación o matiz.',
              '4. Pregunta de comprobación.',
            ]
          : [
              '1. Idea principal.',
              '2. Un ejemplo corto.',
              '3. Cierre.',
            ];

    const content = [
      `### Respuesta de práctica (${subjectLabel})`,
      '',
      opening,
      depth,
      `Controles: **${input.difficulty}** · **${input.userRole}** · **${input.explanationStyle}** · **${input.tutorPersonality}**`,
      '',
      `> ${input.message}`,
      '',
      ...styleSteps,
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
