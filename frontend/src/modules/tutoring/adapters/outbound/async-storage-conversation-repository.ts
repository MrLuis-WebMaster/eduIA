import type { KeyValueStorage } from '@/shared';

import { type TutorSession } from '../../domain';
import type { ConversationRepository } from '../ports';

const STORAGE_KEY = 'eduia:tutoring:session:v1';

/**
 * Persists the active tutor session in KeyValueStorage (AsyncStorage in prod).
 */
export class AsyncStorageConversationRepository implements ConversationRepository {
  constructor(private readonly storage: KeyValueStorage) {}

  async load(): Promise<TutorSession | null> {
    const raw = await this.storage.getItem(STORAGE_KEY);
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
    await this.storage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  async clear(): Promise<void> {
    await this.storage.removeItem(STORAGE_KEY);
  }
}
