/** User preferences composition (stubs — Day 5). */

import {
  InMemoryPreferencesRepository,
  type PreferencesRepository,
} from '../adapters';

export type UserPreferencesDependencies = {
  preferencesRepository: PreferencesRepository;
};

export function createUserPreferencesModule(): UserPreferencesDependencies {
  return {
    preferencesRepository: new InMemoryPreferencesRepository(),
  };
}
