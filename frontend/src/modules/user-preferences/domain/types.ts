/** User preferences domain value objects. */

export type ThemePreference = 'system' | 'light' | 'dark';

export type UserRole = 'student' | 'teacher';

export type PreferredLevel = 'basic' | 'intermediate' | 'advanced';

export type ExplanationStyle = 'simple' | 'detailed' | 'socratic';

export type TutorPersonality =
  | 'friendly'
  | 'formal'
  | 'motivating'
  | 'patient'
  | 'direct';

export type FavoriteSubject =
  | 'math'
  | 'science'
  | 'language'
  | 'history'
  | 'other';

export type UserProfile = {
  displayName: string;
  role: UserRole;
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
