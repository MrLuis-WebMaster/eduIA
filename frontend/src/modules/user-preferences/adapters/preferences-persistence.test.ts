import { describe, expect, it } from 'vitest';

import { MemoryStorage } from '@/shared/storage';
import { AsyncStoragePreferencesRepository } from '@/modules/user-preferences/adapters';
import { defaultUserPreferences } from '@/modules/user-preferences/application';
import { STORAGE_KEYS } from '@/modules/user-preferences/domain';

describe('preferences persistence (critical)', () => {
  it('saves and reloads profile + theme from storage', async () => {
    const storage = new MemoryStorage();
    const repo = new AsyncStoragePreferencesRepository(storage);

    await repo.saveAll({
      ...defaultUserPreferences,
      displayName: 'Luis',
      role: 'teacher',
      preferredLevel: 'advanced',
      favoriteSubjects: ['math', 'science'],
      explanationStyle: 'socratic',
      tutorPersonality: 'motivating',
      theme: 'dark',
      weeklyQuestionGoal: 14,
    });

    const loaded = await repo.loadAll();
    expect(loaded.displayName).toBe('Luis');
    expect(loaded.role).toBe('teacher');
    expect(loaded.preferredLevel).toBe('advanced');
    expect(loaded.favoriteSubjects).toEqual(['math', 'science']);
    expect(loaded.explanationStyle).toBe('socratic');
    expect(loaded.tutorPersonality).toBe('motivating');
    expect(loaded.theme).toBe('dark');
    expect(loaded.weeklyQuestionGoal).toBe(14);
  });

  it('falls back to defaults after clear', async () => {
    const storage = new MemoryStorage();
    const repo = new AsyncStoragePreferencesRepository(storage);

    await repo.saveAll({
      ...defaultUserPreferences,
      displayName: 'Temp',
      theme: 'light',
    });
    await repo.clear();

    const loaded = await repo.loadAll();
    expect(loaded.displayName).toBe(defaultUserPreferences.displayName);
    expect(loaded.theme).toBe(defaultUserPreferences.theme);
    expect(loaded.role).toBe(defaultUserPreferences.role);
    expect(loaded.weeklyQuestionGoal).toBe(
      defaultUserPreferences.weeklyQuestionGoal,
    );
  });

  it('normalizes invalid stored JSON fields', async () => {
    const storage = new MemoryStorage();
    await storage.setItem(
      STORAGE_KEYS.profile,
      JSON.stringify({
        displayName: '  Ada  ',
        role: 'admin',
        preferredLevel: 'expert',
        favoriteSubjects: ['math', 'invalid'],
        explanationStyle: 'weird',
        tutorPersonality: 'chaotic',
      }),
    );
    await storage.setItem(
      STORAGE_KEYS.preferences,
      JSON.stringify({ theme: 'neon', weeklyQuestionGoal: 999 }),
    );

    const repo = new AsyncStoragePreferencesRepository(storage);
    const loaded = await repo.loadAll();

    expect(loaded.displayName).toBe('Ada');
    expect(loaded.role).toBe(defaultUserPreferences.role);
    expect(loaded.preferredLevel).toBe(defaultUserPreferences.preferredLevel);
    expect(loaded.favoriteSubjects).toEqual(['math']);
    expect(loaded.explanationStyle).toBe(defaultUserPreferences.explanationStyle);
    expect(loaded.tutorPersonality).toBe(defaultUserPreferences.tutorPersonality);
    expect(loaded.theme).toBe(defaultUserPreferences.theme);
    expect(loaded.weeklyQuestionGoal).toBe(
      defaultUserPreferences.weeklyQuestionGoal,
    );
  });
});
