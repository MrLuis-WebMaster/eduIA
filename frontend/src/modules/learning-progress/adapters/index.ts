/** Learning progress adapters (stubs — Day 6). */

import type { ProgressSummary } from '../domain';

export interface ProgressRepository {
  getSummary(): Promise<ProgressSummary>;
}

export class InMemoryProgressRepository implements ProgressRepository {
  async getSummary(): Promise<ProgressSummary> {
    return {
      sessionCount: 0,
      questionCount: 0,
      topSubject: null,
      streakDays: 0,
    };
  }
}
