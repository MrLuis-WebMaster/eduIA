import { useQuery } from '@tanstack/react-query';

import { useAppDependencies } from '@/bootstrap/app-dependencies';
import {
  RECENT_TUTORING_SESSIONS_QUERY_KEY,
} from '@/modules/tutoring';
import { usePreferencesStore } from '@/modules/user-preferences';

import { emptyProgressSummary } from '../../domain';

const DEFAULT_LIMIT = 50;

export function useLearningProgress() {
  const role = usePreferencesStore((s) => s.prefs.role);
  const displayName = usePreferencesStore((s) => s.prefs.displayName);
  const preferredLevel = usePreferencesStore((s) => s.prefs.preferredLevel);
  const weeklyQuestionGoal = usePreferencesStore(
    (s) => s.prefs.weeklyQuestionGoal,
  );
  const hydrated = usePreferencesStore((s) => s.hydrated);
  const { learningProgress } = useAppDependencies();

  // Share prefix with tutoring recent-sessions so invalidations stay coherent.
  const summaryQuery = useQuery({
    queryKey: [...RECENT_TUTORING_SESSIONS_QUERY_KEY, 'summary', DEFAULT_LIMIT],
    queryFn: () => learningProgress.getProgressSummary(DEFAULT_LIMIT),
  });

  return {
    role,
    displayName,
    preferredLevel,
    weeklyQuestionGoal,
    hydrated,
    summary: summaryQuery.data ?? emptyProgressSummary(),
    isLoading: !hydrated || summaryQuery.isLoading,
    isError: summaryQuery.isError,
    refetch: summaryQuery.refetch,
    isFetching: summaryQuery.isFetching,
  };
}
