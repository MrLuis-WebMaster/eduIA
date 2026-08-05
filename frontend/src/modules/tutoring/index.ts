/** Public API — tutoring module (non-UI boundary). Screens live under `./ui`. */

export type {
  Subject,
  Difficulty,
  UserRole,
  ExplanationStyle,
  TutorPersonality,
  ChatRole,
  ChatMessage,
  TutorSession,
  RecentTutoringSessionDto,
  QuickAction,
  QuickActionId,
} from './domain';

export {
  SUBJECT_OPTIONS,
  DIFFICULTY_OPTIONS,
  SUBJECT_LABELS,
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  QUICK_ACTIONS,
  ROLE_OPTIONS,
  createEmptySession,
  toRecentTutoringSessionDto,
} from './domain';

export type {
  SendTutorMessageInput,
  SendTutorMessageResult,
  SendTutorMessageCommand,
  SendTutorMessageOutcome,
  StartNewSessionInput,
  EnsureActiveSessionInput,
} from './application';

export type { TutorEngine, ConversationRepository } from './application/ports';
export {
  FakeTutorEngine,
  HttpTutorEngine,
  AsyncStorageConversationRepository,
  InMemoryConversationRepository,
} from './adapters';

export {
  createTutoringModule,
  type TutoringDependencies,
  type TutoringModuleOptions,
} from './composition';

/** Query keys — safe for cross-module imports (no React hooks). */
export {
  TUTOR_SESSION_QUERY_KEY,
  RECENT_TUTORING_SESSIONS_QUERY_KEY,
} from './ui/query-keys';

/** Hook used by other modules (e.g. conversation history sheet). */
export { useRecentTutoringSessions } from './ui/hooks/useRecentTutoringSessions';
