/** Session / message factory helpers for the tutoring domain. */

import { CONVERSATION_CONTEXT_LIMIT } from './constants';
import type { ChatMessage, Difficulty, Subject, TutorSession } from './types';

export function createMessageId(prefix = 'msg'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createEmptySession(
  subject: Subject = 'math',
  difficulty: Difficulty = 'basic',
): TutorSession {
  const now = new Date().toISOString();
  return {
    id: createSessionId(),
    subject,
    difficulty,
    messages: [],
    updatedAt: now,
  };
}

export function toApiConversation(
  messages: ChatMessage[],
): { role: 'user' | 'assistant'; content: string }[] {
  return messages
    .filter(
      (m): m is ChatMessage & { role: 'user' | 'assistant' } =>
        m.role === 'user' || m.role === 'assistant',
    )
    .slice(-CONVERSATION_CONTEXT_LIMIT)
    .map((m) => ({ role: m.role, content: m.content }));
}
