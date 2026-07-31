import { AppError, httpJson } from '@/shared';

import {
  SUBJECT_LABELS,
  createMessageId,
  toApiConversation,
} from '../../domain';
import type {
  SendTutorMessageInput,
  SendTutorMessageResult,
  TutorEngine,
} from '../ports';

type TutorApiResponse = {
  reply: string;
  provider: string;
  model: string | null;
  requestId: string;
};

/**
 * Calls `POST /api/v1/tutor/messages` and maps the backend contract
 * `{ reply, provider, model, requestId }` into a domain ChatMessage.
 */
export class HttpTutorEngine implements TutorEngine {
  constructor(
    private readonly baseUrl: string,
    private readonly timeoutMs = 20_000,
  ) {}

  async sendMessage(input: SendTutorMessageInput): Promise<SendTutorMessageResult> {
    const url = `${trimTrailingSlash(this.baseUrl)}/api/v1/tutor/messages`;

    try {
      const data = await httpJson<TutorApiResponse>(url, {
        method: 'POST',
        timeoutMs: this.timeoutMs,
        signal: input.signal,
        body: {
          message: input.message,
          subject: SUBJECT_LABELS[input.subject],
          difficulty: input.difficulty,
          userRole: input.userRole,
          conversation: toApiConversation(input.conversation),
        },
      });

      return {
        reply: {
          id: createMessageId('assistant'),
          role: 'assistant',
          content: data.reply,
          createdAt: new Date().toISOString(),
        },
        provider: data.provider,
        model: data.model,
        requestId: data.requestId,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('UNKNOWN', 'Failed to reach tutor API', {
        retryable: true,
        cause: error,
      });
    }
  }
}

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}
