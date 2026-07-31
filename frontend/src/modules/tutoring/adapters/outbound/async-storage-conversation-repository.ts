import type { KeyValueStorage } from '@/shared';

import { type TutorSession } from '../../domain';
import type { ConversationRepository } from '../ports';

const SESSION_KEY = 'eduia:tutoring:session:v1';
const HISTORY_KEY = 'eduia:tutoring:history:v1';
const MAX_HISTORY = 50;

/**
 * Persists the active tutor session and archived history in KeyValueStorage.
 */
export class AsyncStorageConversationRepository implements ConversationRepository {
  constructor(private readonly storage: KeyValueStorage) {}

  async load(): Promise<TutorSession | null> {
    const raw = await this.storage.getItem(SESSION_KEY);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw) as TutorSession;
      if (!parsed?.id || !Array.isArray(parsed.messages)) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  async save(session: TutorSession): Promise<void> {
    await this.storage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  async listHistory(): Promise<TutorSession[]> {
    const raw = await this.storage.getItem(HISTORY_KEY);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw) as TutorSession[];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (s) => s?.id && Array.isArray(s.messages) && typeof s.updatedAt === 'string',
      );
    } catch {
      return [];
    }
  }

  async clear(): Promise<void> {
    await Promise.all([
      this.storage.removeItem(SESSION_KEY),
      this.storage.removeItem(HISTORY_KEY),
    ]);
  }

  /** Archive current session into history when it has user questions. */
  async archiveIfMeaningful(session: TutorSession | null): Promise<void> {
    if (!session) return;
    const hasQuestions = session.messages.some((m) => m.role === 'user');
    if (!hasQuestions) return;

    const history = await this.listHistory();
    const withoutDup = history.filter((s) => s.id !== session.id);
    const next = [session, ...withoutDup].slice(0, MAX_HISTORY);
    await this.storage.setItem(HISTORY_KEY, JSON.stringify(next));
  }
}

/** In-memory repository for tests. */
export class InMemoryConversationRepository implements ConversationRepository {
  private session: TutorSession | null = null;
  private history: TutorSession[] = [];

  async load(): Promise<TutorSession | null> {
    return this.session ? structuredClone(this.session) : null;
  }

  async save(session: TutorSession): Promise<void> {
    this.session = structuredClone(session);
  }

  async listHistory(): Promise<TutorSession[]> {
    return structuredClone(this.history);
  }

  async clear(): Promise<void> {
    this.session = null;
    this.history = [];
  }

  async archiveIfMeaningful(session: TutorSession | null): Promise<void> {
    if (!session) return;
    const hasQuestions = session.messages.some((m) => m.role === 'user');
    if (!hasQuestions) return;
    this.history = [
      structuredClone(session),
      ...this.history.filter((s) => s.id !== session.id),
    ].slice(0, MAX_HISTORY);
  }
}
