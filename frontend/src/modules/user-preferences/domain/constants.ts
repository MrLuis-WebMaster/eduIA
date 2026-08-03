/** Domain catalogs and storage keys for user preferences. */

import type {
  ExplanationStyle,
  FavoriteSubject,
  PreferredLevel,
  ThemePreference,
  TutorPersonality,
  UserRole,
} from './types';

export const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Sistema' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
];

export const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'student', label: 'Estudiante' },
  { value: 'teacher', label: 'Docente' },
];

export const LEVEL_OPTIONS: { value: PreferredLevel; label: string }[] = [
  { value: 'basic', label: 'Básico' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
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

export const SUBJECT_OPTIONS: { value: FavoriteSubject; label: string }[] = [
  { value: 'math', label: 'Matemáticas' },
  { value: 'science', label: 'Ciencias' },
  { value: 'language', label: 'Lengua' },
  { value: 'history', label: 'Historia' },
  { value: 'other', label: 'Otro' },
];

/** Preset weekly question goals for the progress ring. */
export const WEEKLY_QUESTION_GOAL_OPTIONS: {
  value: number;
  label: string;
  description: string;
}[] = [
  { value: 3, label: '3 preguntas', description: 'Meta suave para empezar' },
  { value: 5, label: '5 preguntas', description: 'Ritmo ligero' },
  { value: 7, label: '7 preguntas', description: 'Una al día, en promedio' },
  { value: 10, label: '10 preguntas', description: 'Práctica constante' },
  { value: 14, label: '14 preguntas', description: 'Dos al día, en promedio' },
  { value: 21, label: '21 preguntas', description: 'Ritmo intensivo' },
];

export const WEEKLY_QUESTION_GOAL_MIN = 1;
export const WEEKLY_QUESTION_GOAL_MAX = 50;

export const STORAGE_KEYS = {
  profile: '@eduia/profile:v1',
  preferences: '@eduia/preferences:v1',
} as const;
