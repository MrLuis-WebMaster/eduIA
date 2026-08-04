import type { TutorSession } from '../../domain';
import type { ConversationRepository } from '../ports';

export function createLoadConversation(deps: {
  conversationRepository: ConversationRepository;
}) {
  return async function loadConversation(): Promise<TutorSession | null> {
    return deps.conversationRepository.load();
  };
}
