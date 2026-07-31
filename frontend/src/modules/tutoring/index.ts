/** Public API — tutoring module. */

export type {
  Subject,
  Difficulty,
  UserRole,
  ChatRole,
  ChatMessage,
  TutorSession,
} from './domain';

export {
  SUBJECT_OPTIONS,
  DIFFICULTY_OPTIONS,
  SUBJECT_LABELS,
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  QUICK_ACTIONS,
  createEmptySession,
} from './domain';

export type {
  SendTutorMessageInput,
  SendTutorMessageResult,
  SendTutorMessageCommand,
  SendTutorMessageOutcome,
  StartNewSessionInput,
} from './application';

export type { TutorEngine, ConversationRepository } from './adapters/ports';
export {
  FakeTutorEngine,
  HttpTutorEngine,
  AsyncStorageConversationRepository,
} from './adapters';

export {
  createTutoringModule,
  type TutoringDependencies,
  type TutoringModuleOptions,
} from './composition';

export { TutorScreen, useTutorSession, TUTOR_SESSION_QUERY_KEY } from './ui';
