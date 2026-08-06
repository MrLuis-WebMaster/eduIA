/** Public API — learning-progress module (non-UI boundary). Screens live under `./ui`. */

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
