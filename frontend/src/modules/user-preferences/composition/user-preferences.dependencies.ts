import type { KeyValueStorage } from '@/shared';

import {
  AsyncStoragePreferencesRepository,
  type PreferencesRepository,
} from '../infrastructure';
import {
  createLoadPreferences,
  createResetPreferences,
  createSavePreferences,
} from '../application';
import type { UserPreferences } from '../domain';

export type UserPreferencesModuleOptions = {
  storage: KeyValueStorage;
};

export type UserPreferencesDependencies = {
  preferencesRepository: PreferencesRepository;
  loadPreferences: () => Promise<UserPreferences>;
  savePreferences: (prefs: UserPreferences) => Promise<UserPreferences>;
  resetPreferences: () => Promise<UserPreferences>;
};

/** Manual composition root for the user-preferences module. */
export function createUserPreferencesModule(
  options: UserPreferencesModuleOptions,
): UserPreferencesDependencies {
  const preferencesRepository = new AsyncStoragePreferencesRepository(
    options.storage,
  );

  return {
    preferencesRepository,
    loadPreferences: createLoadPreferences({ preferencesRepository }),
    savePreferences: createSavePreferences({ preferencesRepository }),
    resetPreferences: createResetPreferences({ preferencesRepository }),
  };
}
