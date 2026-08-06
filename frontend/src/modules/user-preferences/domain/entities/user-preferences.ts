/**
 * User preferences normalization — domain invariants for profile + app prefs.
 * Infrastructure only persists the resulting snapshot.
 */

import {
  WEEKLY_QUESTION_GOAL_MAX,
  WEEKLY_QUESTION_GOAL_MIN,
} from '../constants';
import {
  defaultAppPreferences,
  defaultUserPreferences,
  defaultUserProfile,
} from '../defaults';
import type {
  AppPreferences,
  ExplanationStyle,
  FavoriteSubject,
  PreferredLevel,
  ThemePreference,
  TutorPersonality,
  UserPreferences,
  UserProfile,
  UserRole,
} from '../types';

export const DISPLAY_NAME_MAX_LENGTH = 80;

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
const MIN_AGE = 18;
const MAX_AGE = 99;

export function normalizeProfile(input: Partial<UserProfile>): UserProfile {
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

  const displayName = typeof input.displayName === 'string'
    ? input.displayName.trim().slice(0, DISPLAY_NAME_MAX_LENGTH)
    : '';
  const age = typeof input.age === 'number' && Number.isFinite(input.age)
    ? input.age >= MIN_AGE && input.age <= MAX_AGE ? Math.round(input.age) : defaultUserPreferences.age
    : defaultUserPreferences.age;

  return {
    displayName,
    age,
    role,
    preferredLevel,
    favoriteSubjects,
    explanationStyle,
    tutorPersonality,
  };
}

export function normalizeAppPreferences(
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

export function normalizeUserPreferences(
  prefs: UserPreferences,
): UserPreferences {
  const profile = normalizeProfile(prefs);
  const app = normalizeAppPreferences(prefs);
  return { ...profile, ...app };
}

export function emptyUserProfile(): UserProfile {
  return { ...defaultUserProfile };
}

export function emptyAppPreferences(): AppPreferences {
  return { ...defaultAppPreferences };
}
