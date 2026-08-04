/** Learning progress composition root. */

import type { ListRecentSessions } from '../application';
import { createGetProgressSummary } from '../application';
import type { ProgressSummary } from '../domain';

export type LearningProgressModuleOptions = {
  listRecentSessions: ListRecentSessions;
};

export type LearningProgressDependencies = {
  getProgressSummary: (limit?: number) => Promise<ProgressSummary>;
};

export function createLearningProgressModule(
  options: LearningProgressModuleOptions,
): LearningProgressDependencies {
  return {
    getProgressSummary: createGetProgressSummary({
      listRecentSessions: options.listRecentSessions,
    }),
  };
}
