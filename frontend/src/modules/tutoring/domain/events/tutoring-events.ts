/** Domain event records (no bus) — useful for tests and future observability. */

export type SessionStarted = {
  type: 'SessionStarted';
  sessionId: string;
  subject: string;
  difficulty: string;
  occurredAt: string;
};

export type MessageAppended = {
  type: 'MessageAppended';
  sessionId: string;
  messageId: string;
  role: 'user' | 'assistant';
  occurredAt: string;
};

export type TutoringDomainEvent = SessionStarted | MessageAppended;
