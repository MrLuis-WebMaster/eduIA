/**
 * Shared kernel re-exports — tutor profile vocabulary owned in `@/shared/domain`
 * and used by tutoring, preferences, and progress (DDD shared kernel).
 */
export type {
  Subject,
  Difficulty,
  UserRole,
  ExplanationStyle,
  TutorPersonality,
} from '@/shared/domain';

export {
  SUBJECT_OPTIONS,
  DIFFICULTY_OPTIONS,
  SUBJECT_LABELS,
  ROLE_OPTIONS,
  STYLE_OPTIONS,
  PERSONALITY_OPTIONS,
} from '@/shared/domain';
