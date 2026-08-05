/** Chat message factory — content invariants live on TutorSessionAggregate. */

import type { ChatMessage, ChatRole } from '../types';

export function createMessageId(prefix = 'msg'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createChatMessage(
  role: ChatRole,
  content: string,
  idPrefix?: string,
): ChatMessage {
  return {
    id: createMessageId(idPrefix ?? role),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}
