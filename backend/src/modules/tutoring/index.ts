export type {
  ConversationMessage,
  Difficulty,
  ExplanationStyle,
  TutorPersonality,
  TutorRequest,
  TutorResponse,
  UserRole,
} from './domain/index.js';
export {
  buildPedagogicalSystemPrompt,
  buildTurnControlReminder,
  assessTutorScope,
  resolveSubjectKey,
  parseTutorAgentDecision,
} from './domain/index.js';
export type {
  PedagogicalContext,
  ScopeAssessment,
  TutorSubjectKey,
  TutorAgentAction,
  TutorAgentDecision,
} from './domain/index.js';
export type {
  AIChatMessage,
  AIProvider,
  GenerateCompletionContext,
  GenerateCompletionInput,
  GenerateCompletionResult,
} from './application/ports/ai-provider.js';
export { GenerateTutorResponse } from './application/use-cases/generate-tutor-response.js';
export { composeTutoring, createAIProvider } from './composition/compose-tutoring.js';
export { FakeAIProvider } from './infrastructure/outbound/ai/fake-ai-provider.js';
export { OpenAIProvider } from './infrastructure/outbound/ai/openai-provider.js';
