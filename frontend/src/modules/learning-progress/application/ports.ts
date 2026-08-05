/**
 * Anti-corruption port toward the tutoring context.
 * Learning-progress never reads AsyncStorage directly — it consumes tutoring DTOs.
 */
import type { RecentTutoringSessionDto } from '@/modules/tutoring';

export type ListRecentSessions = (
  limit?: number,
) => Promise<RecentTutoringSessionDto[]>;
