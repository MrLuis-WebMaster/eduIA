/** Tutoring application ports — outbound adapters implement these. */

import type {
  ChatMessage,
  Difficulty,
  ExplanationStyle,
  Subject,
  TutorPersonality,
  TutorSession,
  UserRole,
} from '../domain';

export type SendTutorMessageInput = {
  message: string;
  subject: Subject;
  difficulty: Difficulty;
  userRole: UserRole;
  explanationStyle: ExplanationStyle;
  tutorPersonality: TutorPersonality;
  /** Prior turns (excluding the message being sent). */
  conversation: ChatMessage[];
  signal?: AbortSignal;
};

export type SendTutorMessageResult = {
  reply: ChatMessage;
  provider?: string;
  model?: string | null;
  requestId?: string;
};

export interface TutorEngine {
  sendMessage(input: SendTutorMessageInput): Promise<SendTutorMessageResult>;
}

export interface ConversationRepository {
  load(): Promise<TutorSession | null>;
  save(session: TutorSession): Promise<void>;
  /** Archived sessions with at least one user question (newest first). */
  listHistory(): Promise<TutorSession[]>;
  /** Persist session into history when it has at least one user question. */
  archiveIfMeaningful(session: TutorSession | null): Promise<void>;
  clear(): Promise<void>;
}
