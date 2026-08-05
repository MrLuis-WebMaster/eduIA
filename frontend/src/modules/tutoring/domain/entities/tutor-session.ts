/**
 * Tutoring session aggregate.
 * Persistence and UI use plain `TutorSession` snapshots via toSnapshot/fromSnapshot.
 */

import {
  CONVERSATION_CONTEXT_LIMIT,
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
} from '../constants';
import { DomainError } from '../errors';
import type { MessageAppended, SessionStarted, TutoringDomainEvent } from '../events/tutoring-events';
import type { ChatMessage, Difficulty, Subject, TutorSession } from '../types';
import { createChatMessage, createMessageId } from './chat-message';

export function createSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export class TutorSessionAggregate {
  private events: TutoringDomainEvent[] = [];

  private constructor(private props: TutorSession) {}

  static createEmpty(
    subject: Subject = 'math',
    difficulty: Difficulty = 'basic',
  ): TutorSessionAggregate {
    const now = new Date().toISOString();
    const aggregate = new TutorSessionAggregate({
      id: createSessionId(),
      subject,
      difficulty,
      messages: [],
      updatedAt: now,
    });
    const started: SessionStarted = {
      type: 'SessionStarted',
      sessionId: aggregate.props.id,
      subject,
      difficulty,
      occurredAt: now,
    };
    aggregate.events.push(started);
    return aggregate;
  }

  static fromSnapshot(snapshot: TutorSession): TutorSessionAggregate {
    return new TutorSessionAggregate({
      ...snapshot,
      messages: [...snapshot.messages],
    });
  }

  toSnapshot(): TutorSession {
    return {
      id: this.props.id,
      subject: this.props.subject,
      difficulty: this.props.difficulty,
      messages: [...this.props.messages],
      updatedAt: this.props.updatedAt,
    };
  }

  /** Drain recorded domain events (no bus). */
  pullEvents(): TutoringDomainEvent[] {
    const drained = [...this.events];
    this.events = [];
    return drained;
  }

  get id(): string {
    return this.props.id;
  }

  get messages(): readonly ChatMessage[] {
    return this.props.messages;
  }

  withSubjectDifficulty(
    subject: Subject,
    difficulty: Difficulty,
  ): TutorSessionAggregate {
    this.props = {
      ...this.props,
      subject,
      difficulty,
      updatedAt: new Date().toISOString(),
    };
    return this;
  }

  appendUserMessage(content: string): ChatMessage {
    const trimmed = content.trim();
    if (trimmed.length < MESSAGE_MIN_LENGTH) {
      throw new DomainError(
        `El mensaje debe tener al menos ${MESSAGE_MIN_LENGTH} caracteres`,
      );
    }
    if (trimmed.length > MESSAGE_MAX_LENGTH) {
      throw new DomainError(
        `El mensaje no puede superar ${MESSAGE_MAX_LENGTH} caracteres`,
      );
    }

    const userMessage = createChatMessage('user', trimmed, 'user');
    this.props = {
      ...this.props,
      messages: [...this.props.messages, userMessage],
      updatedAt: new Date().toISOString(),
    };
    this.recordMessageAppended(userMessage);
    return userMessage;
  }

  appendAssistantMessage(message: ChatMessage): ChatMessage {
    const assistantMessage: ChatMessage = {
      ...message,
      role: 'assistant',
      id: message.id || createMessageId('assistant'),
      createdAt: message.createdAt || new Date().toISOString(),
    };
    this.props = {
      ...this.props,
      messages: [...this.props.messages, assistantMessage],
      updatedAt: new Date().toISOString(),
    };
    this.recordMessageAppended(assistantMessage);
    return assistantMessage;
  }

  /** Prior turns for the API (excluding a message not yet in the session). */
  toApiConversation(): { role: 'user' | 'assistant'; content: string }[] {
    return this.props.messages
      .filter(
        (m): m is ChatMessage & { role: 'user' | 'assistant' } =>
          m.role === 'user' || m.role === 'assistant',
      )
      .slice(-CONVERSATION_CONTEXT_LIMIT)
      .map((m) => ({ role: m.role, content: m.content }));
  }

  hasUserQuestions(): boolean {
    return this.props.messages.some((m) => m.role === 'user');
  }

  private recordMessageAppended(message: ChatMessage): void {
    if (message.role !== 'user' && message.role !== 'assistant') return;
    const event: MessageAppended = {
      type: 'MessageAppended',
      sessionId: this.props.id,
      messageId: message.id,
      role: message.role,
      occurredAt: message.createdAt,
    };
    this.events.push(event);
  }
}

/** Snapshot factory — preferred for UI / persistence entry points. */
export function createEmptySession(
  subject: Subject = 'math',
  difficulty: Difficulty = 'basic',
): TutorSession {
  return TutorSessionAggregate.createEmpty(subject, difficulty).toSnapshot();
}

/** Map messages to API conversation turns (context window). */
export function toApiConversation(
  messages: ChatMessage[],
): { role: 'user' | 'assistant'; content: string }[] {
  return TutorSessionAggregate.fromSnapshot({
    id: 'transient',
    subject: 'other',
    difficulty: 'basic',
    messages,
    updatedAt: new Date().toISOString(),
  }).toApiConversation();
}
