/** Tutoring application use-cases (stubs — Day 4). */

import type { ChatMessage, Difficulty, Subject, UserRole } from '../domain';

export type SendTutorMessageInput = {
  message: string;
  subject: Subject;
  difficulty: Difficulty;
  userRole: UserRole;
  conversation: ChatMessage[];
};

export type SendTutorMessageResult = {
  reply: ChatMessage;
};

/** Placeholder use-case — wired in composition when TutorEngine exists. */
export async function sendTutorMessage(
  _input: SendTutorMessageInput,
): Promise<SendTutorMessageResult> {
  throw new Error('sendTutorMessage is not implemented yet (Day 4)');
}
