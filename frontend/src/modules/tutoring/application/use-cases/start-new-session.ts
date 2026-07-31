import {
  createEmptySession,
  type Difficulty,
  type Subject,
  type TutorSession,
} from '../../domain';
import type { ConversationRepository } from '../../adapters/ports';

export type StartNewSessionInput = {
  subject?: Subject;
  difficulty?: Difficulty;
};

export function createStartNewSession(deps: {
  conversationRepository: ConversationRepository;
}) {
  return async function startNewSession(
    input: StartNewSessionInput = {},
  ): Promise<TutorSession> {
    const current = await deps.conversationRepository.load();
    await deps.conversationRepository.archiveIfMeaningful(current);

    const session = createEmptySession(
      input.subject ?? 'math',
      input.difficulty ?? 'basic',
    );
    await deps.conversationRepository.save(session);
    return session;
  };
}
