import type { ConversationRepository } from '../ports';

export function createClearConversation(deps: {
  conversationRepository: ConversationRepository;
}) {
  return async function clearConversation(): Promise<void> {
    await deps.conversationRepository.clear();
  };
}
