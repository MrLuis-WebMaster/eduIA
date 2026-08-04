import type { RecentTutoringSessionDto } from '../../domain';
import { toRecentTutoringSessionDto } from '../../domain';
import type { ConversationRepository } from '../ports';

const DEFAULT_LIMIT = 20;

export function createListRecentSessions(deps: {
  conversationRepository: ConversationRepository;
}) {
  return async function listRecentSessions(
    limit = DEFAULT_LIMIT,
  ): Promise<RecentTutoringSessionDto[]> {
    const [active, history] = await Promise.all([
      deps.conversationRepository.load(),
      deps.conversationRepository.listHistory(),
    ]);

    const byId = new Map(history.map((session) => [session.id, session]));
    if (active?.messages.some((m) => m.role === 'user')) {
      byId.set(active.id, active);
    }

    return [...byId.values()]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, limit)
      .map(toRecentTutoringSessionDto);
  };
}
