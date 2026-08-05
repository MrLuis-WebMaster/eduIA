import { describe, expect, it } from 'vitest';

import {
  DomainError,
  TutorSessionAggregate,
  createEmptySession,
  toApiConversation,
} from './index';

describe('TutorSessionAggregate', () => {
  it('creates an empty session snapshot and records SessionStarted', () => {
    const aggregate = TutorSessionAggregate.createEmpty('math', 'basic');
    const events = aggregate.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.type).toBe('SessionStarted');
    expect(aggregate.toSnapshot().messages).toHaveLength(0);
  });

  it('rejects short and oversized user messages', () => {
    const aggregate = TutorSessionAggregate.fromSnapshot(createEmptySession());
    expect(() => aggregate.appendUserMessage('a')).toThrow(DomainError);
    expect(() => aggregate.appendUserMessage('x'.repeat(2001))).toThrow(
      DomainError,
    );
  });

  it('appends user and assistant turns and emits MessageAppended', () => {
    const aggregate = TutorSessionAggregate.fromSnapshot(createEmptySession());
    aggregate.pullEvents();
    const user = aggregate.appendUserMessage('¿Qué es una fracción?');
    const assistant = aggregate.appendAssistantMessage({
      id: 'a1',
      role: 'assistant',
      content: 'Una fracción…',
      createdAt: new Date().toISOString(),
    });
    expect(aggregate.toSnapshot().messages).toEqual([user, assistant]);
    const events = aggregate.pullEvents();
    expect(events.map((e) => e.type)).toEqual([
      'MessageAppended',
      'MessageAppended',
    ]);
  });

  it('limits API conversation context', () => {
    const messages = Array.from({ length: 12 }, (_, i) => ({
      id: `m${i}`,
      role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
      content: `msg ${i}`,
      createdAt: new Date().toISOString(),
    }));
    const api = toApiConversation(messages);
    expect(api).toHaveLength(10);
    expect(api[0]?.content).toBe('msg 2');
  });
});
