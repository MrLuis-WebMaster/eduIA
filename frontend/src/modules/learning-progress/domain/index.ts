/** Learning-progress domain public surface. */

export type {
  WeeklyActivityDay,
  SubjectProgress,
  LevelUsage,
  RecentProgressItem,
  ProgressSummary,
} from './types';

export {
  emptyProgressSummary,
  computeProgressSummary,
  computeStreak,
  buildWeeklyActivity,
} from './services/compute-progress-summary';
