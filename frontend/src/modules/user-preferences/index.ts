/** Public API — user-preferences module (non-screen boundary). Screens live under `./ui`. */

export type {
  ThemePreference,
  UserRole,
  PreferredLevel,
  ExplanationStyle,
  TutorPersonality,
  FavoriteSubject,
  UserProfile,
  AppPreferences,
  UserPreferences,
} from './domain';

export {
  THEME_OPTIONS,
  THEME_LABELS,
  ROLE_OPTIONS,
  LEVEL_OPTIONS,
  STYLE_OPTIONS,
  PERSONALITY_OPTIONS,
  SUBJECT_OPTIONS,
  WEEKLY_QUESTION_GOAL_OPTIONS,
  WEEKLY_QUESTION_GOAL_MIN,
  WEEKLY_QUESTION_GOAL_MAX,
} from './domain';

export {
  defaultUserPreferences,
  defaultUserProfile,
  defaultAppPreferences,
} from './application';

export type { PreferencesRepository } from './application/ports';
export {
  AsyncStoragePreferencesRepository,
  InMemoryPreferencesRepository,
  STORAGE_KEYS,
} from './infrastructure';

export {
  createUserPreferencesModule,
  type UserPreferencesDependencies,
  type UserPreferencesModuleOptions,
} from './composition';

/** Hydration + store — needed at app root without loading PreferencesScreen. */
export { usePreferences } from './ui/hooks/usePreferences';
export { usePreferencesHydration } from './ui/hooks/usePreferencesHydration';
export { usePreferencesStore } from './ui/store/preferences-store';
export { ROLE_SELECT_OPTIONS } from './ui/options';
