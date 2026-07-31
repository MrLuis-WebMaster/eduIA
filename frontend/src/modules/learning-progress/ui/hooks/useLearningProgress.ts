import { useMemo } from 'react';

import { useRecentTutoringSessions } from '@/modules/tutoring';
import { usePreferencesStore } from '@/modules/user-preferences';

import {
  computeProgressSummary,
  emptyProgressSummary,
} from '../../domain';

export function useLearningProgress() {
  const role = usePreferencesStore((s) => s.prefs.role);
  const hydrated = usePreferencesStore((s) => s.hydrated);
  const sessionsQuery = useRecentTutoringSessions(50);

  const summary = useMemo(() => {
    if (!sessionsQuery.data) return emptyProgressSummary();
    return computeProgressSummary(sessionsQuery.data);
  }, [sessionsQuery.data]);

  return {
    role,
    hydrated,
    summary,
    isLoading: !hydrated || sessionsQuery.isLoading,
    isError: sessionsQuery.isError,
    refetch: sessionsQuery.refetch,
    isFetching: sessionsQuery.isFetching,
  };
}
