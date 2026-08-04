/** Tutoring application use-cases. */

export {
  createSendTutorMessage,
  type SendTutorMessageCommand,
  type SendTutorMessageOutcome,
} from './use-cases/send-tutor-message';

export { createLoadConversation } from './use-cases/load-conversation';

export {
  createEnsureActiveSession,
  type EnsureActiveSessionInput,
} from './use-cases/ensure-active-session';

export {
  createStartNewSession,
  type StartNewSessionInput,
} from './use-cases/start-new-session';

export { createClearConversation } from './use-cases/clear-conversation';

export { createListRecentSessions } from './use-cases/list-recent-sessions';

export type {
  SendTutorMessageInput,
  SendTutorMessageResult,
  TutorEngine,
  ConversationRepository,
} from './ports';
