import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { getDependencies } from '@/bootstrap/dependencies';
import { useTheme, useToast } from '@/design-system';
import { TUTOR_SESSION_QUERY_KEY } from '@/modules/tutoring/ui/hooks/useTutorSession';
import { RECENT_TUTORING_SESSIONS_QUERY_KEY } from '@/modules/tutoring/ui/hooks/useRecentTutoringSessions';

import type { UserPreferences } from '../../domain';
import { usePreferencesStore } from '../store/preferences-store';

export function usePreferences() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { preference, setPreference } = useTheme();
  const prefs = usePreferencesStore((s) => s.prefs);
  const hydrated = usePreferencesStore((s) => s.hydrated);
  const hydrate = usePreferencesStore((s) => s.hydrate);
  const saveStore = usePreferencesStore((s) => s.save);
  const resetStore = usePreferencesStore((s) => s.reset);

  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [clearingHistory, setClearingHistory] = useState(false);

  useEffect(() => {
    if (!hydrated) {
      void hydrate();
    }
  }, [hydrated, hydrate]);

  useEffect(() => {
    if (hydrated && preference !== prefs.theme) {
      setPreference(prefs.theme);
    }
  }, [hydrated, preference, prefs.theme, setPreference]);

  const save = useCallback(
    async (
      next: UserPreferences,
      options?: { statusMessage?: string },
    ) => {
      setSaving(true);
      try {
        const saved = await saveStore(next);
        setPreference(saved.theme);
        const message =
          options?.statusMessage ?? 'Guardado — Se aplicaron los cambios';
        // After the sheet Modal closes, open the toast Modal on top.
        setTimeout(() => toast.success(message), 160);
        return saved;
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'No se pudieron guardar',
        );
        throw error;
      } finally {
        setSaving(false);
      }
    },
    [saveStore, setPreference, toast],
  );

  const reset = useCallback(async () => {
    setResetting(true);
    try {
      const resetPrefs = await resetStore();
      setPreference(resetPrefs.theme);
      setTimeout(() => toast.success('Preferencias restablecidas'), 120);
      return resetPrefs;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'No se pudieron restablecer',
      );
      throw error;
    } finally {
      setResetting(false);
    }
  }, [resetStore, setPreference, toast]);

  const clearHistory = useCallback(async () => {
    setClearingHistory(true);
    try {
      await getDependencies().tutoring.clearConversation();
      await queryClient.invalidateQueries({ queryKey: TUTOR_SESSION_QUERY_KEY });
      await queryClient.invalidateQueries({
        queryKey: RECENT_TUTORING_SESSIONS_QUERY_KEY,
      });
      setTimeout(() => toast.success('Guardado — Historial eliminado'), 160);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'No se pudo borrar el historial',
      );
      throw error;
    } finally {
      setClearingHistory(false);
    }
  }, [queryClient, toast]);

  return {
    prefs,
    hydrated,
    saving,
    resetting,
    clearingHistory,
    save,
    reset,
    clearHistory,
  };
}
