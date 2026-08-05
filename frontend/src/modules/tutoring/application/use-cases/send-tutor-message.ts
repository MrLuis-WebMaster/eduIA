import { AppError } from '@/shared';

import {
  DomainError,
  TutorSessionAggregate,
  type ChatMessage,
  type Difficulty,
  type ExplanationStyle,
  type Subject,
  type TutorPersonality,
  type TutorSession,
  type UserRole,
} from '../../domain';
import type {
  ConversationRepository,
  SendTutorMessageResult,
  TutorEngine,
} from '../ports';

export type SendTutorMessageCommand = {
  message: string;
  subject: Subject;
  difficulty: Difficulty;
  userRole: UserRole;
  explanationStyle: ExplanationStyle;
  tutorPersonality: TutorPersonality;
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
    const aggregate = TutorSessionAggregate.fromSnapshot(command.session)
      .withSubjectDifficulty(command.subject, command.difficulty);

    let userMessage: ChatMessage;
    try {
      userMessage = aggregate.appendUserMessage(command.message);
    } catch (error) {
      throw mapDomainError(error);
    }

    // Engine sees prior turns only (exclude the message just appended).
    const priorMessages = aggregate.toSnapshot().messages.slice(0, -1);

    let result: SendTutorMessageResult;
    try {
      result = await deps.tutorEngine.sendMessage({
        message: userMessage.content,
        subject: command.subject,
        difficulty: command.difficulty,
        userRole: command.userRole,
        explanationStyle: command.explanationStyle,
        tutorPersonality: command.tutorPersonality,
        conversation: priorMessages,
        signal: command.signal,
      });
    } catch (error) {
      throw mapSendError(error, command.signal);
    }

    const assistantMessage = aggregate.appendAssistantMessage(result.reply);
    const session = aggregate.toSnapshot();
    aggregate.pullEvents();

    await deps.conversationRepository.save(session);

    return {
      session,
      userMessage,
      assistantMessage,
      provider: result.provider,
      model: result.model,
      requestId: result.requestId,
    };
  };
}

function mapDomainError(error: unknown): AppError {
  if (error instanceof DomainError) {
    return new AppError('VALIDATION', error.message, { retryable: false });
  }
  if (error instanceof AppError) return error;
  return new AppError('UNKNOWN', 'Error de dominio al enviar el mensaje', {
    retryable: false,
    cause: error,
  });
}

function mapSendError(error: unknown, signal?: AbortSignal): AppError {
  // Prefer the abort signal over the thrown shape: RN may surface cancel as
  // NETWORK / TypeError ("Network request failed") instead of AbortError.
  if (signal?.aborted === true) {
    return new AppError('CANCELLED', 'Solicitud cancelada', {
      retryable: true,
      cause: error,
    });
  }
  if (error instanceof AppError) return error;
  if (error instanceof Error && error.name === 'AbortError') {
    return new AppError(
      'TIMEOUT',
      'La solicitud agotó el tiempo de espera',
      { retryable: true, cause: error },
    );
  }
  if (error instanceof Error) {
    return new AppError('UNKNOWN', error.message || 'Error al enviar el mensaje', {
      retryable: true,
      cause: error,
    });
  }
  return new AppError('UNKNOWN', 'Error al enviar el mensaje', {
    retryable: true,
    cause: error,
  });
}
