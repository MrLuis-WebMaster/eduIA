/** User preferences adapters (stubs — Day 5). */

import type { UserPreferences } from '../domain';
import { defaultUserPreferences } from '../application';

export interface PreferencesRepository {
  load(): Promise<UserPreferences>;
  save(prefs: UserPreferences): Promise<void>;
  clear(): Promise<void>;
}

export class InMemoryPreferencesRepository implements PreferencesRepository {
  private value: UserPreferences = { ...defaultUserPreferences };

  async load(): Promise<UserPreferences> {
    return { ...this.value };
  }

  async save(prefs: UserPreferences): Promise<void> {
    this.value = { ...prefs };
  }

  async clear(): Promise<void> {
    this.value = { ...defaultUserPreferences };
  }
}
