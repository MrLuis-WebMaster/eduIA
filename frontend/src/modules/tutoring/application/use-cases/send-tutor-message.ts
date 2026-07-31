import { AppError } from '@/shared';

import {
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  createMessageId,
  type ChatMessage,
  type Difficulty,
  type Subject,
  type TutorSession,
  type UserRole,
} from '../../domain';
import type {
  ConversationRepository,
  SendTutorMessageResult,
  TutorEngine,
} from '../../adapters/ports';

export type SendTutorMessageCommand = {
  message: string;
  subject: Subject;
  difficulty: Difficulty;
  userRole: UserRole;
  session: TutorSession;
  signal?: AbortSignal;
};

export type SendTutorMessageOutcome = {
  session: TutorSession;
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
  provider?: string;
  model?: string | null;
  requestId?: string;
};

export function createSendTutorMessage(deps: {
  tutorEngine: TutorEngine;
  conversationRepository: ConversationRepository;
}) {
  return async function sendTutorMessage(
    command: SendTutorMessageCommand,
  ): Promise<SendTutorMessageOutcome> {
    const trimmed = command.message.trim();
    if (trimmed.length < MESSAGE_MIN_LENGTH) {
      throw new AppError(
        'VALIDATION',
        `El mensaje debe tener al menos ${MESSAGE_MIN_LENGTH} caracteres`,
        { retryable: false },
      );
    }
    if (trimmed.length > MESSAGE_MAX_LENGTH) {
      throw new AppError(
        'VALIDATION',
        `El mensaje no puede superar ${MESSAGE_MAX_LENGTH} caracteres`,
        { retryable: false },
      );
    }

    const userMessage: ChatMessage = {
      id: createMessageId('user'),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    const result: SendTutorMessageResult = await deps.tutorEngine.sendMessage({
      message: trimmed,
      subject: command.subject,
      difficulty: command.difficulty,
      userRole: command.userRole,
      conversation: command.session.messages,
      signal: command.signal,
    });

    const session: TutorSession = {
      ...command.session,
      subject: command.subject,
      difficulty: command.difficulty,
      messages: [...command.session.messages, userMessage, result.reply],
      updatedAt: new Date().toISOString(),
    };

    await deps.conversationRepository.save(session);

    return {
      session,
      userMessage,
      assistantMessage: result.reply,
      provider: result.provider,
      model: result.model,
      requestId: result.requestId,
    };
  };
}
