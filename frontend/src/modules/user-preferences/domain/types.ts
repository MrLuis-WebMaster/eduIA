/** User preferences domain value objects. */

import type {
  Difficulty,
  ExplanationStyle,
  Subject,
  TutorPersonality,
  UserRole,
} from '@/shared/domain';

export type { ExplanationStyle, TutorPersonality, UserRole } from '@/shared/domain';

/** Alias — preferences UI historically used PreferredLevel. */
export type PreferredLevel = Difficulty;

/** Alias — preferences UI historically used FavoriteSubject. */
export type FavoriteSubject = Subject;

export type ThemePreference = 'system' | 'light' | 'dark';

export type UserProfile = {
  displayName: string;
  role: UserRole;
  age: number | null;
  preferredLevel: PreferredLevel;
  favoriteSubjects: FavoriteSubject[];
  explanationStyle: ExplanationStyle;
  tutorPersonality: TutorPersonality;
};

export type AppPreferences = {
  theme: ThemePreference;
  /** Soft weekly target for questions asked to the tutor. */
  weeklyQuestionGoal: number;
};

/** Combined snapshot used by UI and Zustand. */
export type UserPreferences = UserProfile & AppPreferences;
