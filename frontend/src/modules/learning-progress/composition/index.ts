/** Learning progress composition root. */

import type { ListRecentSessions } from '../application';
import { createGetProgressSummary } from '../application';
import {
  InMemoryProgressRepository,
  type ProgressRepository,
} from '../adapters';
import type { ProgressSummary } from '../domain';

export type LearningProgressModuleOptions = {
  listRecentSessions: ListRecentSessions;
};

export type LearningProgressDependencies = {
  progressRepository: ProgressRepository;
  getProgressSummary: (limit?: number) => Promise<ProgressSummary>;
};

export function createLearningProgressModule(
  options: LearningProgressModuleOptions,
): LearningProgressDependencies {
  return {
    progressRepository: new InMemoryProgressRepository(),
    getProgressSummary: createGetProgressSummary({
      listRecentSessions: options.listRecentSessions,
    }),
  };
}
