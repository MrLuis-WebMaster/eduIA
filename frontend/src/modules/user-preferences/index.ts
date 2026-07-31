/** Public API — user-preferences module. */

export type {
  ThemePreference,
  UserRole,
  PreferredLevel,
  ExplanationStyle,
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
  SUBJECT_OPTIONS,
  STORAGE_KEYS,
} from './domain';

export {
  defaultUserPreferences,
  defaultUserProfile,
  defaultAppPreferences,
} from './application';

export type { PreferencesRepository } from './adapters';
export {
  AsyncStoragePreferencesRepository,
  InMemoryPreferencesRepository,
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
} from './ui';
