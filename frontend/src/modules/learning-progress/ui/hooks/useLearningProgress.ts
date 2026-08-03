import { useMemo } from 'react';

import { useRecentTutoringSessions } from '@/modules/tutoring/ui/hooks/useRecentTutoringSessions';
import { usePreferencesStore } from '@/modules/user-preferences/ui/store/preferences-store';

import {
  computeProgressSummary,
  emptyProgressSummary,
} from '../../domain';

export function useLearningProgress() {
  const role = usePreferencesStore((s) => s.prefs.role);
  const displayName = usePreferencesStore((s) => s.prefs.displayName);
  const preferredLevel = usePreferencesStore((s) => s.prefs.preferredLevel);
  const weeklyQuestionGoal = usePreferencesStore(
    (s) => s.prefs.weeklyQuestionGoal,
  );
  const hydrated = usePreferencesStore((s) => s.hydrated);
  const sessionsQuery = useRecentTutoringSessions(50);

  const summary = useMemo(() => {
    if (!sessionsQuery.data) return emptyProgressSummary();
    return computeProgressSummary(sessionsQuery.data);
  }, [sessionsQuery.data]);

  return {
    role,
    displayName,
    preferredLevel,
    weeklyQuestionGoal,
    hydrated,
    summary,
    isLoading: !hydrated || sessionsQuery.isLoading,
    isError: sessionsQuery.isError,
    refetch: sessionsQuery.refetch,
    isFetching: sessionsQuery.isFetching,
  };
}
