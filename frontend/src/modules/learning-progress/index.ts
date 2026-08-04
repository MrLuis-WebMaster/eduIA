/** Public API — learning-progress module. */

export type {
  ProgressSummary,
  WeeklyActivityDay,
  SubjectProgress,
  LevelUsage,
  RecentProgressItem,
} from './domain';

export {
  computeProgressSummary,
  emptyProgressSummary,
  computeStreak,
  buildWeeklyActivity,
  toDateKey,
} from './domain';

export {
  createGetProgressSummary,
  type ListRecentSessions,
} from './application';

export {
  createLearningProgressModule,
  type LearningProgressDependencies,
  type LearningProgressModuleOptions,
} from './composition';

export { ProgressScreen, useLearningProgress } from './ui';
