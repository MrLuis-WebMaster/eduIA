import { useQuery } from '@tanstack/react-query';

import { useAppDependencies } from '@/bootstrap/app-dependencies';

import type { RecentTutoringSessionDto } from '../../domain';
import { RECENT_TUTORING_SESSIONS_QUERY_KEY } from '../query-keys';

export { RECENT_TUTORING_SESSIONS_QUERY_KEY };

/** Public hook — recent local tutoring sessions for progress dashboards. */
export function useRecentTutoringSessions(limit = 20) {
  const { tutoring } = useAppDependencies();

  return useQuery({
    queryKey: [...RECENT_TUTORING_SESSIONS_QUERY_KEY, limit],
    queryFn: (): Promise<RecentTutoringSessionDto[]> =>
      tutoring.listRecentSessions(limit),
  });
}
