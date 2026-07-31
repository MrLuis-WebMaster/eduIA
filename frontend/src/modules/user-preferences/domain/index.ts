/** User preferences domain (stubs — Day 5). */

export type ThemePreference = 'system' | 'light' | 'dark';

export type ExplanationStyle = 'simple' | 'detailed' | 'socratic';

export type UserPreferences = {
  displayName: string;
  role: 'student' | 'teacher';
  level: string;
  favoriteSubjects: string[];
  explanationStyle: ExplanationStyle;
  theme: ThemePreference;
};
