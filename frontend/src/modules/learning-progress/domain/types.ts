/** Learning progress domain value objects. */

import type { Difficulty, Subject } from '@/modules/tutoring/domain';

export type WeeklyActivityDay = {
  /** ISO date YYYY-MM-DD */
  date: string;
  /** Short weekday label in Spanish */
  label: string;
  questionCount: number;
};

export type SubjectProgress = {
  subject: Subject;
  label: string;
  sessionCount: number;
  questionCount: number;
};

export type LevelUsage = {
  difficulty: Difficulty;
  label: string;
  sessionCount: number;
};

export type RecentProgressItem = {
  id: string;
  title: string;
  subtitle: string;
  updatedAt: string;
};

export type ProgressSummary = {
  sessionCount: number;
  questionCount: number;
  topSubject: Subject | null;
  topSubjectLabel: string | null;
  mostUsedLevel: Difficulty | null;
  mostUsedLevelLabel: string | null;
  streakDays: number;
  weeklyActivity: WeeklyActivityDay[];
  progressBySubject: SubjectProgress[];
  levelUsage: LevelUsage[];
  topicsStudied: string[];
  topicsToReinforce: string[];
  recommendations: string[];
  recentItems: RecentProgressItem[];
  teacherResources: string[];
  teacherActivities: string[];
};
