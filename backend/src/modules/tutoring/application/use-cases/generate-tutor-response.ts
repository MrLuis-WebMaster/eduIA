import { AppError } from '@/shared/errors/app-error.js';
import {
  buildPedagogicalSystemPrompt,
  buildTurnControlReminder,
} from '../../domain/policies/pedagogical-policy.js';
import { parseTutorAgentDecision } from '../../domain/services/tutor-agent-decision.js';
import type { TutorRequest, TutorResponse } from '../../domain/types.js';
import type { AIChatMessage, AIProvider } from '../ports/ai-provider.js';

export interface GenerateTutorResponseDeps {
  aiProvider: AIProvider;
  timeoutMs: number;
}

export class GenerateTutorResponse {
  private readonly aiProvider: AIProvider;
  private readonly timeoutMs: number;

  constructor(deps: GenerateTutorResponseDeps) {
    this.aiProvider = deps.aiProvider;
    this.timeoutMs = deps.timeoutMs;
  }

  async execute(request: TutorRequest): Promise<TutorResponse> {
    const pedagogicalCtx = {
      subject: request.subject,
      difficulty: request.difficulty,
      userRole: request.userRole,
      explanationStyle: request.explanationStyle,
      tutorPersonality: request.tutorPersonality,
    };

    const messages: AIChatMessage[] = [
      { role: 'system', content: buildPedagogicalSystemPrompt(pedagogicalCtx) },
      ...request.conversation.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      // Keep controls salient on every turn so chat history cannot freeze tone.
      { role: 'system', content: buildTurnControlReminder(pedagogicalCtx) },
      { role: 'user', content: request.message },
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const result = await this.aiProvider.generateCompletion({
        messages,
        signal: controller.signal,
        json: true,
        context: {
          subject: request.subject,
          userRole: request.userRole,
          difficulty: request.difficulty,
          explanationStyle: request.explanationStyle,
          tutorPersonality: request.tutorPersonality,
        },
      });

      const decision = parseTutorAgentDecision(result.content);
      const reply = decision?.reply ?? result.content;

      return {
        reply,
        provider: result.provider,
        model: result.model,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (controller.signal.aborted || isAbortError(error)) {
        throw AppError.aiTimeout();
      }

      throw AppError.aiProvider(
        error instanceof Error ? error.message : 'AI provider failed',
        true,
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const name = 'name' in error ? String(error.name) : '';
  const message = 'message' in error ? String(error.message) : '';
  return (
    name === 'AbortError' ||
    name === 'APIUserAbortError' ||
    /aborted|abort/i.test(message)
  );
}
