/** Tutoring domain public surface. */

export type {
  Subject,
  Difficulty,
  UserRole,
  ExplanationStyle,
  TutorPersonality,
  ChatRole,
  ChatMessage,
  TutorSession,
  QuickAction,
  QuickActionId,
  FollowUpSuggestion,
  FollowUpKind,
} from './types';

export {
  SUBJECT_OPTIONS,
  DIFFICULTY_OPTIONS,
  SUBJECT_LABELS,
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  CONVERSATION_CONTEXT_LIMIT,
  QUICK_ACTIONS,
  ROLE_OPTIONS,
} from './constants';

export { DomainError } from './errors';

export {
  createMessageId,
  createChatMessage,
} from './entities/chat-message';
export {
  TutorSessionAggregate,
  createSessionId,
  createEmptySession,
  toApiConversation,
} from './entities/tutor-session';

export type { TutoringDomainEvent, SessionStarted, MessageAppended } from './events/tutoring-events';

export type { RecentTutoringSessionDto } from './session-summary';
export { toRecentTutoringSessionDto } from './session-summary';

export type { LocalScopeAssessment } from './policies/scope-policy';
export { assessLocalTutorScope } from './policies/scope-policy';

export {
  detectFollowUpKind,
  getFollowUpSuggestions,
} from './policies/follow-up-policy';
