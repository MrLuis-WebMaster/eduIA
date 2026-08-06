/** Public DTOs for recent tutoring sessions (consumed by learning-progress). */

import { SUBJECT_LABELS } from './constants';
import type { Difficulty, Subject, TutorSession } from './types';
import { truncate } from '@/shared/utils';

export type RecentTutoringSessionDto = {
  id: string;
  subject: Subject;
  subjectLabel: string;
  difficulty: Difficulty;
  questionCount: number;
  updatedAt: string;
  firstQuestion: string | null;
  lastAssistantPreview: string | null;
};

export function toRecentTutoringSessionDto(
  session: TutorSession,
): RecentTutoringSessionDto {
  const userMessages = session.messages.filter((m) => m.role === 'user');
  const assistantMessages = session.messages.filter(
    (m) => m.role === 'assistant',
  );
  const firstQuestion = userMessages[0]?.content?.trim() || null;
  const lastAssistant = assistantMessages.at(-1)?.content?.trim() || null;

  return {
    id: session.id,
    subject: session.subject,
    subjectLabel: SUBJECT_LABELS[session.subject],
    difficulty: session.difficulty,
    questionCount: userMessages.length,
    updatedAt: session.updatedAt,
    firstQuestion: firstQuestion ? truncate(firstQuestion, 120) : null,
    lastAssistantPreview: lastAssistant ? truncate(lastAssistant, 160) : null,
  };
}
