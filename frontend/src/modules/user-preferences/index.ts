/** Public API — user-preferences module. */

export type {
  ThemePreference,
  ExplanationStyle,
  UserPreferences,
} from './domain';

export {
  defaultUserPreferences,
  loadUserPreferences,
  saveUserPreferences,
} from './application';

export {
  InMemoryPreferencesRepository,
  type PreferencesRepository,
} from './adapters';

export {
  createUserPreferencesModule,
  type UserPreferencesDependencies,
} from './composition';
