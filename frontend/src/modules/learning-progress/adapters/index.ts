/** Learning progress adapters — thin; metrics come from tutoring sessions. */

import type { ProgressSummary } from '../domain';
import { emptyProgressSummary } from '../domain';

/** Optional cache port — progress is primarily derived, not stored. */
export interface ProgressRepository {
  getCachedSummary(): Promise<ProgressSummary | null>;
  saveCachedSummary(summary: ProgressSummary): Promise<void>;
  clear(): Promise<void>;
}

export class InMemoryProgressRepository implements ProgressRepository {
  private summary: ProgressSummary | null = null;

  async getCachedSummary(): Promise<ProgressSummary | null> {
    return this.summary ? structuredClone(this.summary) : null;
  }

  async saveCachedSummary(summary: ProgressSummary): Promise<void> {
    this.summary = structuredClone(summary);
  }

  async clear(): Promise<void> {
    this.summary = null;
  }
}

export { emptyProgressSummary };
