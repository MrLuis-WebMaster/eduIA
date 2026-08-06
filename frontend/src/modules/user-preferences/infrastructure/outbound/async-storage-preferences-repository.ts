import type { KeyValueStorage } from '@/shared';

import { STORAGE_KEYS } from '../storage-keys';
import {
  defaultAppPreferences,
  defaultUserProfile,
  normalizeAppPreferences,
  normalizeProfile,
  type AppPreferences,
  type UserPreferences,
  type UserProfile,
} from '../../domain';
import type { PreferencesRepository } from '../../application/ports';

/**
 * Persists profile and theme prefs in versioned AsyncStorage keys.
 * Normalization belongs to the domain — this adapter only loads/saves snapshots.
 */
export class AsyncStoragePreferencesRepository implements PreferencesRepository {
  constructor(private readonly storage: KeyValueStorage) {}

  async loadProfile(): Promise<UserProfile> {
    const raw = await this.storage.getItem(STORAGE_KEYS.profile);
    if (!raw) return { ...defaultUserProfile };
    try {
      return normalizeProfile(JSON.parse(raw) as Partial<UserProfile>);
    } catch {
      return { ...defaultUserProfile };
    }
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    await this.storage.setItem(
      STORAGE_KEYS.profile,
      JSON.stringify(normalizeProfile(profile)),
    );
  }

  async loadPreferences(): Promise<AppPreferences> {
    const raw = await this.storage.getItem(STORAGE_KEYS.preferences);
    if (!raw) return { ...defaultAppPreferences };
    try {
      return normalizeAppPreferences(
        JSON.parse(raw) as Partial<AppPreferences>,
      );
    } catch {
      return { ...defaultAppPreferences };
    }
  }

  async savePreferences(preferences: AppPreferences): Promise<void> {
    await this.storage.setItem(
      STORAGE_KEYS.preferences,
      JSON.stringify(normalizeAppPreferences(preferences)),
    );
  }

  async loadAll(): Promise<UserPreferences> {
    const [profile, preferences] = await Promise.all([
      this.loadProfile(),
      this.loadPreferences(),
    ]);
    return { ...profile, ...preferences };
  }

  async saveAll(prefs: UserPreferences): Promise<void> {
    const profile: UserProfile = {
      displayName: prefs.displayName,
      role: prefs.role,
      age: prefs.age,
      preferredLevel: prefs.preferredLevel,
      favoriteSubjects: prefs.favoriteSubjects,
      explanationStyle: prefs.explanationStyle,
      tutorPersonality: prefs.tutorPersonality,
    };
    const preferences: AppPreferences = {
      theme: prefs.theme,
      weeklyQuestionGoal: prefs.weeklyQuestionGoal,
    };
    await Promise.all([
      this.saveProfile(profile),
      this.savePreferences(preferences),
    ]);
  }

  async clear(): Promise<void> {
    await Promise.all([
      this.storage.removeItem(STORAGE_KEYS.profile),
      this.storage.removeItem(STORAGE_KEYS.preferences),
    ]);
  }
}

/** In-memory repository for tests / isolated tooling. */
export class InMemoryPreferencesRepository implements PreferencesRepository {
  private profile: UserProfile = { ...defaultUserProfile };
  private preferences: AppPreferences = { ...defaultAppPreferences };

  async loadProfile(): Promise<UserProfile> {
    return { ...this.profile };
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    this.profile = normalizeProfile(profile);
  }

  async loadPreferences(): Promise<AppPreferences> {
    return { ...this.preferences };
  }

  async savePreferences(preferences: AppPreferences): Promise<void> {
    this.preferences = normalizeAppPreferences(preferences);
  }

  async loadAll(): Promise<UserPreferences> {
    return { ...this.profile, ...this.preferences };
  }

  async saveAll(prefs: UserPreferences): Promise<void> {
    this.profile = normalizeProfile(prefs);
    this.preferences = normalizeAppPreferences(prefs);
  }

  async clear(): Promise<void> {
    this.profile = { ...defaultUserProfile };
    this.preferences = { ...defaultAppPreferences };
  }
}
