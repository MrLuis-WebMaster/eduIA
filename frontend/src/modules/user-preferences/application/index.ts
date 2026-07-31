/** User preferences use-cases (stubs — Day 5). */

import type { UserPreferences } from '../domain';

export const defaultUserPreferences: UserPreferences = {
  displayName: '',
  role: 'student',
  level: 'beginner',
  favoriteSubjects: [],
  explanationStyle: 'simple',
  theme: 'system',
};

export async function loadUserPreferences(): Promise<UserPreferences> {
  return { ...defaultUserPreferences };
}

export async function saveUserPreferences(
  prefs: UserPreferences,
): Promise<void> {
  void prefs;
  throw new Error('saveUserPreferences is not implemented yet (Day 5)');
}
