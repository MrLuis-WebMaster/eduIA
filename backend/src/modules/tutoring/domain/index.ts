/** Tutoring domain barrel. */

export type {
  ConversationMessage,
  ConversationRole,
  Difficulty,
  ExplanationStyle,
  TutorPersonality,
  TutorRequest,
  TutorResponse,
  UserRole,
} from './types.js';

export {
  buildPedagogicalSystemPrompt,
  buildTurnControlReminder,
  assessTutorScope,
  resolveSubjectKey,
} from './policies/pedagogical-policy.js';
export type {
  PedagogicalContext,
  ScopeAssessment,
  TutorSubjectKey,
} from './policies/pedagogical-policy.js';

export {
  parseTutorAgentDecision,
} from './services/tutor-agent-decision.js';
export type {
  TutorAgentAction,
  TutorAgentDecision,
} from './services/tutor-agent-decision.js';
