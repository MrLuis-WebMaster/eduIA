export type Difficulty = 'basic' | 'intermediate' | 'advanced';
export type UserRole = 'student' | 'teacher';
export type ExplanationStyle = 'simple' | 'detailed' | 'socratic';
export type TutorPersonality =
  | 'friendly'
  | 'formal'
  | 'motivating'
  | 'patient'
  | 'direct';
export type ConversationRole = 'user' | 'assistant';

export interface ConversationMessage {
  role: ConversationRole;
  content: string;
}

export interface TutorRequest {
  message: string;
  subject: string;
  difficulty: Difficulty;
  userRole: UserRole;
  explanationStyle: ExplanationStyle;
  tutorPersonality: TutorPersonality;
  conversation: ConversationMessage[];
}

export interface TutorResponse {
  reply: string;
  provider: string;
  model?: string;
}
