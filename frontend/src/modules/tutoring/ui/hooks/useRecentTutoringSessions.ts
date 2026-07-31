import { useQuery } from '@tanstack/react-query';

import { getDependencies } from '@/bootstrap';

import type { RecentTutoringSessionDto } from '../../domain';

export const RECENT_TUTORING_SESSIONS_QUERY_KEY = [
  'tutoring',
  'recent-sessions',
] as const;

/** Public hook — recent local tutoring sessions for progress dashboards. */
export function useRecentTutoringSessions(limit = 20) {
  const tutoring = getDependencies().tutoring;

  return useQuery({
    queryKey: [...RECENT_TUTORING_SESSIONS_QUERY_KEY, limit],
    queryFn: (): Promise<RecentTutoringSessionDto[]> =>
      tutoring.listRecentSessions(limit),
  });
}
