export type AIChatRole = 'system' | 'user' | 'assistant';

export interface AIChatMessage {
  role: AIChatRole;
  content: string;
}

export interface GenerateCompletionContext {
  /** Subject focus for the tutoring turn (structured; do not parse prompts). */
  subject: string;
  /** Role for scope checks in fake providers (structured). */
  userRole?: 'student' | 'teacher';
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  explanationStyle?: 'simple' | 'detailed' | 'socratic';
  tutorPersonality?:
    | 'friendly'
    | 'formal'
    | 'motivating'
    | 'patient'
    | 'direct';
}

export interface GenerateCompletionInput {
  messages: AIChatMessage[];
  signal?: AbortSignal;
  context?: GenerateCompletionContext;
  /** Request structured JSON object output when the provider supports it. */
  json?: boolean;
}

export interface GenerateCompletionResult {
  content: string;
  provider: string;
  model?: string;
}

export interface AIProvider {
  readonly name: string;
  generateCompletion(
    input: GenerateCompletionInput,
  ): Promise<GenerateCompletionResult>;
}
