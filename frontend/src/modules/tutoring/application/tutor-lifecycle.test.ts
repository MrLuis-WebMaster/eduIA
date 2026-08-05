import { describe, expect, it } from 'vitest';

import { AppError } from '@/shared/errors';
import { MemoryStorage } from '@/shared/storage';
import {
  AsyncStorageConversationRepository,
  FakeTutorEngine,
  type SendTutorMessageInput,
  type SendTutorMessageResult,
  type TutorEngine,
} from '@/modules/tutoring/infrastructure';
import { createEmptySession } from '@/modules/tutoring/domain';
import {
  createListRecentSessions,
  createSendTutorMessage,
  createStartNewSession,
} from '@/modules/tutoring/application';

/** Instant fake — no delay, supports abort. */
class InstantTutorEngine implements TutorEngine {
  async sendMessage(input: SendTutorMessageInput): Promise<SendTutorMessageResult> {
    if (input.signal?.aborted) {
      throw new AppError('CANCELLED', 'Solicitud cancelada', { retryable: true });
    }
    return {
      reply: {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `Eco: ${input.message}`,
        createdAt: new Date().toISOString(),
      },
      provider: 'instant-fake',
      model: 'instant-v1',
      requestId: 'req-1',
    };
  }
}

describe('tutor critical flows (fake adapters)', () => {
  it('persists a sent message and archives on new session', async () => {
    const storage = new MemoryStorage();
    const repo = new AsyncStorageConversationRepository(storage);
    const send = createSendTutorMessage({
      tutorEngine: new InstantTutorEngine(),
      conversationRepository: repo,
    });
    const startNew = createStartNewSession({ conversationRepository: repo });
    const listRecent = createListRecentSessions({ conversationRepository: repo });

    const session = createEmptySession('math', 'basic');
    await repo.save(session);

    const outcome = await send({
      message: '¿Qué es una fracción?',
      subject: 'math',
      difficulty: 'basic',
      userRole: 'student',
      explanationStyle: 'simple',
      tutorPersonality: 'friendly',
      session,
    });

    expect(outcome.assistantMessage.content).toContain('fracción');
    expect(outcome.session.messages).toHaveLength(2);

    await startNew({ subject: 'science', difficulty: 'intermediate' });
    const recent = await listRecent();

    expect(recent.length).toBeGreaterThanOrEqual(1);
    expect(recent[0]?.questionCount).toBeGreaterThanOrEqual(1);
    expect(recent.some((s) => s.subject === 'math')).toBe(true);
  });

  it('cancels an in-flight fake tutor send via AbortSignal', async () => {
    const engine = new FakeTutorEngine();
    const controller = new AbortController();
    const pending = engine.sendMessage({
      message: 'Hola tutor',
      subject: 'math',
      difficulty: 'basic',
      userRole: 'student',
      explanationStyle: 'simple',
      tutorPersonality: 'friendly',
      conversation: [],
      signal: controller.signal,
    });
    controller.abort();

    await expect(pending).rejects.toMatchObject({
      code: 'CANCELLED',
    });
  });

  it('maps aborted network failures to CANCELLED (RN fetch shape)', async () => {
    const storage = new MemoryStorage();
    const repo = new AsyncStorageConversationRepository(storage);
    const controller = new AbortController();
    const send = createSendTutorMessage({
      tutorEngine: {
        async sendMessage() {
          controller.abort();
          throw new AppError('NETWORK', 'Network request failed', {
            retryable: true,
          });
        },
      },
      conversationRepository: repo,
    });

    await expect(
      send({
        message: 'Propón una actividad',
        subject: 'math',
        difficulty: 'basic',
        userRole: 'student',
        explanationStyle: 'simple',
        tutorPersonality: 'friendly',
        session: createEmptySession(),
        signal: controller.signal,
      }),
    ).rejects.toMatchObject({ code: 'CANCELLED' });
  });

  it('rejects short messages before calling the engine', async () => {
    const storage = new MemoryStorage();
    const repo = new AsyncStorageConversationRepository(storage);
    const send = createSendTutorMessage({
      tutorEngine: new InstantTutorEngine(),
      conversationRepository: repo,
    });

    await expect(
      send({
        message: 'a',
        subject: 'math',
        difficulty: 'basic',
        userRole: 'student',
        explanationStyle: 'simple',
        tutorPersonality: 'friendly',
        session: createEmptySession(),
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION' });
  });
});
