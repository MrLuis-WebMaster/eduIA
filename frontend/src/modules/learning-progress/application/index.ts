/** Learning progress use-cases (stubs — Day 6). */

import type { ProgressSummary } from '../domain';

export async function getProgressSummary(): Promise<ProgressSummary> {
  return {
    sessionCount: 0,
    questionCount: 0,
    topSubject: null,
    streakDays: 0,
  };
}
