/** Shared tutor profile vocabulary — owned once, used by tutoring + preferences + progress. */

export type Subject =
  | 'math'
  | 'science'
  | 'language'
  | 'history'
  | 'other';

export type Difficulty = 'basic' | 'intermediate' | 'advanced';

export type UserRole = 'student' | 'teacher';

export type ExplanationStyle = 'simple' | 'detailed' | 'socratic';

export type TutorPersonality =
  | 'friendly'
  | 'formal'
  | 'motivating'
  | 'patient'
  | 'direct';

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

export const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'student', label: 'Estudiante' },
  { value: 'teacher', label: 'Docente' },
];

export const STYLE_OPTIONS: { value: ExplanationStyle; label: string }[] = [
  { value: 'simple', label: 'Simple' },
  { value: 'detailed', label: 'Detallado' },
  { value: 'socratic', label: 'Socrático' },
];

export const PERSONALITY_OPTIONS: {
  value: TutorPersonality;
  label: string;
  description: string;
}[] = [
  {
    value: 'friendly',
    label: 'Cercano',
    description: 'Tono cálido y conversacional',
  },
  {
    value: 'formal',
    label: 'Formal',
    description: 'Lenguaje preciso y profesional',
  },
  {
    value: 'motivating',
    label: 'Motivador',
    description: 'Ánimo y refuerzo positivo',
  },
  {
    value: 'patient',
    label: 'Paciente',
    description: 'Sin prisa, con pasos claros',
  },
  {
    value: 'direct',
    label: 'Directo',
    description: 'Conciso y al grano',
  },
];
