export type AIChatRole = 'system' | 'user' | 'assistant';

export interface AIChatMessage {
  role: AIChatRole;
  content: string;
}

export interface GenerateCompletionContext {
  /** Subject focus for the tutoring turn (structured; do not parse prompts). */
  subject: string;
}

export interface GenerateCompletionInput {
  messages: AIChatMessage[];
  signal?: AbortSignal;
  context?: GenerateCompletionContext;
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
