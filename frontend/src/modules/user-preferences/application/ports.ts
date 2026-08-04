import type {
  AppPreferences,
  UserPreferences,
  UserProfile,
} from '../domain';

/** Preferences persistence port — outbound adapters implement this. */
export interface PreferencesRepository {
  loadProfile(): Promise<UserProfile>;
  saveProfile(profile: UserProfile): Promise<void>;
  loadPreferences(): Promise<AppPreferences>;
  savePreferences(preferences: AppPreferences): Promise<void>;
  loadAll(): Promise<UserPreferences>;
  saveAll(prefs: UserPreferences): Promise<void>;
  clear(): Promise<void>;
}
