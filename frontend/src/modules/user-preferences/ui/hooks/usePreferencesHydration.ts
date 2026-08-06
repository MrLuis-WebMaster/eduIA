import { useEffect } from 'react';

import { useTheme } from '@/design-system';

import { usePreferencesStore } from '../store/preferences-store';

/**
 * Loads persisted preferences once and syncs theme into ThemeProvider.
 * Call once under ThemeProvider (e.g. app root bootstrap).
 */
export function usePreferencesHydration() {
  const hydrated = usePreferencesStore((s) => s.hydrated);
  const hydrate = usePreferencesStore((s) => s.hydrate);
  const theme = usePreferencesStore((s) => s.prefs.theme);
  const { preference, setPreference } = useTheme();

  useEffect(() => {
    if (!hydrated) {
      void hydrate();
    }
  }, [hydrated, hydrate]);

  useEffect(() => {
    if (hydrated && preference !== theme) {
      setPreference(theme);
    }
  }, [hydrated, preference, theme, setPreference]);
}
