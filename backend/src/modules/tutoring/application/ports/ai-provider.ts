export type AIChatRole = 'system' | 'user' | 'assistant';

export interface AIChatMessage {
  role: AIChatRole;
  content: string;
}

export interface GenerateCompletionInput {
  messages: AIChatMessage[];
  signal?: AbortSignal;
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
