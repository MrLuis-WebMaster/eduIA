/** Learning progress application use-cases. */

import {
  computeProgressSummary,
  emptyProgressSummary,
  type ProgressSummary,
} from '../domain';
import type { ListRecentSessions } from './ports';

export type { ListRecentSessions } from './ports';

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
