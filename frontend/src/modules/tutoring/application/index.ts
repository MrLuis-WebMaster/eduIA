/** Tutoring application use-cases. */

export {
  createSendTutorMessage,
  type SendTutorMessageCommand,
  type SendTutorMessageOutcome,
} from './use-cases/send-tutor-message';

export { createLoadConversation } from './use-cases/load-conversation';

export {
  createStartNewSession,
  type StartNewSessionInput,
} from './use-cases/start-new-session';

export { createClearConversation } from './use-cases/clear-conversation';

/** Re-export port DTOs for convenience (public API / composition). */
export type {
  SendTutorMessageInput,
  SendTutorMessageResult,
} from '../adapters/ports';
