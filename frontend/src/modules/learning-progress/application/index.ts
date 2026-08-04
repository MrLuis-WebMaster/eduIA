/** Learning progress application use-cases. */

import type { RecentTutoringSessionDto } from '@/modules/tutoring';

import {
  computeProgressSummary,
  emptyProgressSummary,
  type ProgressSummary,
} from '../domain';

export type ListRecentSessions = (
  limit?: number,
) => Promise<RecentTutoringSessionDto[]>;

export function createGetProgressSummary(deps: {
  listRecentSessions: ListRecentSessions;
}) {
  return async function getProgressSummary(
    limit = 50,
  ): Promise<ProgressSummary> {
    const sessions = await deps.listRecentSessions(limit);
    return computeProgressSummary(sessions);
  };
}

export { computeProgressSummary, emptyProgressSummary };
export type { ProgressSummary };
