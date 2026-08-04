import type { KeyValueStorage } from '@/shared';

import { STORAGE_KEYS } from '../storage-keys';
import {
  WEEKLY_QUESTION_GOAL_MAX,
  WEEKLY_QUESTION_GOAL_MIN,
  type AppPreferences,
  type FavoriteSubject,
  type ExplanationStyle,
  type PreferredLevel,
  type ThemePreference,
  type TutorPersonality,
  type UserPreferences,
  type UserProfile,
  type UserRole,
} from '../../domain';
import {
  defaultAppPreferences,
  defaultUserPreferences,
  defaultUserProfile,
} from '../../application/defaults';
import type { PreferencesRepository } from '../../application/ports';

const VALID_ROLES: UserRole[] = ['student', 'teacher'];
const VALID_LEVELS: PreferredLevel[] = ['basic', 'intermediate', 'advanced'];
const VALID_STYLES: ExplanationStyle[] = ['simple', 'detailed', 'socratic'];
const VALID_PERSONALITIES: TutorPersonality[] = [
  'friendly',
  'formal',
  'motivating',
  'patient',
  'direct',
];
const VALID_SUBJECTS: FavoriteSubject[] = [
  'math',
  'science',
  'language',
  'history',
  'other',
];
const VALID_THEMES: ThemePreference[] = ['system', 'light', 'dark'];

/**
 * Persists profile and theme prefs in versioned AsyncStorage keys.
 * AsyncStorage is the source of truth; callers keep an in-memory mirror.
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
      return normalizePreferences(JSON.parse(raw) as Partial<AppPreferences>);
    } catch {
      return { ...defaultAppPreferences };
    }
  }

  async savePreferences(preferences: AppPreferences): Promise<void> {
    await this.storage.setItem(
      STORAGE_KEYS.preferences,
      JSON.stringify(normalizePreferences(preferences)),
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
    this.preferences = normalizePreferences(preferences);
  }

  async loadAll(): Promise<UserPreferences> {
    return { ...this.profile, ...this.preferences };
  }

  async saveAll(prefs: UserPreferences): Promise<void> {
    await this.saveProfile(prefs);
    await this.savePreferences({
      theme: prefs.theme,
      weeklyQuestionGoal: prefs.weeklyQuestionGoal,
    });
  }

  async clear(): Promise<void> {
    this.profile = { ...defaultUserProfile };
    this.preferences = { ...defaultAppPreferences };
  }
}

function normalizeProfile(input: Partial<UserProfile>): UserProfile {
  const role = VALID_ROLES.includes(input.role as UserRole)
    ? (input.role as UserRole)
    : defaultUserPreferences.role;
  const preferredLevel = VALID_LEVELS.includes(input.preferredLevel as PreferredLevel)
    ? (input.preferredLevel as PreferredLevel)
    : defaultUserPreferences.preferredLevel;
  const explanationStyle = VALID_STYLES.includes(
    input.explanationStyle as ExplanationStyle,
  )
    ? (input.explanationStyle as ExplanationStyle)
    : defaultUserPreferences.explanationStyle;
  const tutorPersonality = VALID_PERSONALITIES.includes(
    input.tutorPersonality as TutorPersonality,
  )
    ? (input.tutorPersonality as TutorPersonality)
    : defaultUserPreferences.tutorPersonality;
  const favoriteSubjects = Array.isArray(input.favoriteSubjects)
    ? input.favoriteSubjects.filter((s): s is FavoriteSubject =>
        VALID_SUBJECTS.includes(s as FavoriteSubject),
      )
    : [];

  return {
    displayName:
      typeof input.displayName === 'string'
        ? input.displayName.trim().slice(0, 80)
        : '',
    role,
    preferredLevel,
    favoriteSubjects,
    explanationStyle,
    tutorPersonality,
  };
}

function normalizePreferences(
  input: Partial<AppPreferences>,
): AppPreferences {
  const theme = VALID_THEMES.includes(input.theme as ThemePreference)
    ? (input.theme as ThemePreference)
    : defaultAppPreferences.theme;

  const rawGoal = input.weeklyQuestionGoal;
  const weeklyQuestionGoal =
    typeof rawGoal === 'number' &&
    Number.isFinite(rawGoal) &&
    rawGoal >= WEEKLY_QUESTION_GOAL_MIN &&
    rawGoal <= WEEKLY_QUESTION_GOAL_MAX
      ? Math.round(rawGoal)
      : defaultAppPreferences.weeklyQuestionGoal;

  return { theme, weeklyQuestionGoal };
}
