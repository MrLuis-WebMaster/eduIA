/** User preferences domain value objects. */

export type ThemePreference = 'system' | 'light' | 'dark';

export type UserRole = 'student' | 'teacher';

export type PreferredLevel = 'basic' | 'intermediate' | 'advanced';

export type ExplanationStyle = 'simple' | 'detailed' | 'socratic';

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
};

export type AppPreferences = {
  theme: ThemePreference;
};

/** Combined snapshot used by UI and Zustand. */
export type UserPreferences = UserProfile & AppPreferences;

export const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Sistema' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
];

export const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'student', label: 'Estudiante' },
  { value: 'teacher', label: 'Docente' },
];

export const LEVEL_OPTIONS: { value: PreferredLevel; label: string }[] = [
  { value: 'basic', label: 'Básico' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
];

export const STYLE_OPTIONS: { value: ExplanationStyle; label: string }[] = [
  { value: 'simple', label: 'Simple' },
  { value: 'detailed', label: 'Detallado' },
  { value: 'socratic', label: 'Socrático' },
];

export const SUBJECT_OPTIONS: { value: FavoriteSubject; label: string }[] = [
  { value: 'math', label: 'Matemáticas' },
  { value: 'science', label: 'Ciencias' },
  { value: 'language', label: 'Lengua' },
  { value: 'history', label: 'Historia' },
  { value: 'other', label: 'Otro' },
];

export const STORAGE_KEYS = {
  profile: '@eduia/profile:v1',
  preferences: '@eduia/preferences:v1',
} as const;
