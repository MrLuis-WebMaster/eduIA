import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { getDependencies } from '@/bootstrap';
import { useTheme } from '@/design-system';
import {
  RECENT_TUTORING_SESSIONS_QUERY_KEY,
  TUTOR_SESSION_QUERY_KEY,
} from '@/modules/tutoring';

import type { UserPreferences } from '../../domain';
import { usePreferencesStore } from '../store/preferences-store';

export function usePreferences() {
  const queryClient = useQueryClient();
  const { setPreference } = useTheme();
  const prefs = usePreferencesStore((s) => s.prefs);
  const hydrated = usePreferencesStore((s) => s.hydrated);
  const hydrate = usePreferencesStore((s) => s.hydrate);
  const saveStore = usePreferencesStore((s) => s.save);
  const resetStore = usePreferencesStore((s) => s.reset);

  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [clearingHistory, setClearingHistory] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) {
      void hydrate();
    }
  }, [hydrated, hydrate]);

  useEffect(() => {
    if (hydrated) {
      setPreference(prefs.theme);
    }
  }, [hydrated, prefs.theme, setPreference]);

  const save = useCallback(
    async (next: UserPreferences) => {
      setSaving(true);
      setErrorMessage(null);
      setStatusMessage(null);
      try {
        const saved = await saveStore(next);
        setPreference(saved.theme);
        setStatusMessage('Preferencias guardadas');
        return saved;
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'No se pudieron guardar',
        );
        throw error;
      } finally {
        setSaving(false);
      }
    },
    [saveStore, setPreference],
  );

  const reset = useCallback(async () => {
    setResetting(true);
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      const resetPrefs = await resetStore();
      setPreference(resetPrefs.theme);
      setStatusMessage('Preferencias restablecidas');
      return resetPrefs;
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'No se pudieron restablecer',
      );
      throw error;
    } finally {
      setResetting(false);
    }
  }, [resetStore, setPreference]);

  const clearHistory = useCallback(async () => {
    setClearingHistory(true);
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      await getDependencies().tutoring.clearConversation();
      await queryClient.invalidateQueries({ queryKey: TUTOR_SESSION_QUERY_KEY });
      await queryClient.invalidateQueries({
        queryKey: RECENT_TUTORING_SESSIONS_QUERY_KEY,
      });
      setStatusMessage('Historial del tutor borrado');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'No se pudo borrar el historial',
      );
      throw error;
    } finally {
      setClearingHistory(false);
    }
  }, [queryClient]);

  return {
    prefs,
    hydrated,
    saving,
    resetting,
    clearingHistory,
    statusMessage,
    errorMessage,
    clearStatus: () => {
      setStatusMessage(null);
      setErrorMessage(null);
    },
    save,
    reset,
    clearHistory,
  };
}
