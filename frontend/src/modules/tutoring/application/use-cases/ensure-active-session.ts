import {
  createEmptySession,
  type Difficulty,
  type Subject,
  type TutorSession,
} from '../../domain';
import type { ConversationRepository } from '../ports';

export type EnsureActiveSessionInput = {
  subject?: Subject;
  difficulty?: Difficulty;
};

/** Load the active session, or persist a fresh empty one (no archive). */
export function createEnsureActiveSession(deps: {
  conversationRepository: ConversationRepository;
}) {
  return async function ensureActiveSession(
    input: EnsureActiveSessionInput = {},
  ): Promise<TutorSession> {
    const existing = await deps.conversationRepository.load();
    if (existing) return existing;

    const session = createEmptySession(
      input.subject ?? 'math',
      input.difficulty ?? 'basic',
    );
    await deps.conversationRepository.save(session);
    return session;
  };
}
