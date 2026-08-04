/** Public API — user-preferences module. */

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
} from './adapters';

export {
  createUserPreferencesModule,
  type UserPreferencesDependencies,
  type UserPreferencesModuleOptions,
} from './composition';

export {
  PreferencesScreen,
  PreferencesHydrator,
  usePreferences,
  usePreferencesStore,
  ROLE_SELECT_OPTIONS,
} from './ui';
