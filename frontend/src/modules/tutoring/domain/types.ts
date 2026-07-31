/** Tutoring domain value objects and entities. */

export type Subject =
  | 'math'
  | 'science'
  | 'language'
  | 'history'
  | 'other';

export type Difficulty = 'basic' | 'intermediate' | 'advanced';

export type UserRole = 'student' | 'teacher';

export type ChatRole = 'user' | 'assistant' | 'system';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type TutorSession = {
  id: string;
  subject: Subject;
  difficulty: Difficulty;
  messages: ChatMessage[];
  updatedAt: string;
};

export const SUBJECT_OPTIONS: { value: Subject; label: string }[] = [
  { value: 'math', label: 'Matemáticas' },
  { value: 'science', label: 'Ciencias' },
  { value: 'language', label: 'Lengua' },
  { value: 'history', label: 'Historia' },
  { value: 'other', label: 'Otro' },
];

export const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'basic', label: 'Básico' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
];

export const SUBJECT_LABELS: Record<Subject, string> = {
  math: 'Matemáticas',
  science: 'Ciencias',
  language: 'Lengua',
  history: 'Historia',
  other: 'Otro',
};

export const MESSAGE_MAX_LENGTH = 2000;
export const MESSAGE_MIN_LENGTH = 2;
export const CONVERSATION_CONTEXT_LIMIT = 10;

export const QUICK_ACTIONS: Record<UserRole, string[]> = {
  student: [
    'Explícame este concepto con un ejemplo',
    '¿Cómo lo resuelvo paso a paso?',
    'Hazme una pregunta para practicar',
  ],
  teacher: [
    'Dame ideas para explicar esto en clase',
    '¿Cuáles son los errores comunes?',
    'Sugiere una evaluación formativa corta',
  ],
};

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
