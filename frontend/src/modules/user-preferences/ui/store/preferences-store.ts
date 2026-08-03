import { create } from 'zustand';

import { getDependencies } from '@/bootstrap/dependencies';

import { defaultUserPreferences } from '../../application';
import type { UserPreferences } from '../../domain';

type PreferencesStore = {
  prefs: UserPreferences;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setPrefs: (prefs: UserPreferences) => void;
  save: (prefs: UserPreferences) => Promise<UserPreferences>;
  reset: () => Promise<UserPreferences>;
};

/**
 * In-memory mirror of AsyncStorage preferences.
 * Storage remains the source of truth; this store is for reactive UI.
 */
export const usePreferencesStore = create<PreferencesStore>((set) => ({
  prefs: { ...defaultUserPreferences },
  hydrated: false,

  hydrate: async () => {
    const loaded = await getDependencies().userPreferences.loadPreferences();
    set({ prefs: loaded, hydrated: true });
  },

  setPrefs: (prefs) => set({ prefs }),

  save: async (prefs) => {
    const saved = await getDependencies().userPreferences.savePreferences(prefs);
    set({ prefs: saved, hydrated: true });
    return saved;
  },

  reset: async () => {
    const reset = await getDependencies().userPreferences.resetPreferences();
    set({ prefs: reset, hydrated: true });
    return reset;
  },
}));
