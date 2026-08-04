/** Domain catalogs and storage keys for user preferences. */

import {
  DIFFICULTY_OPTIONS,
  PERSONALITY_OPTIONS,
  ROLE_OPTIONS,
  STYLE_OPTIONS,
  SUBJECT_OPTIONS,
} from '@/shared/domain';

import type { ThemePreference } from './types';

export {
  ROLE_OPTIONS,
  STYLE_OPTIONS,
  PERSONALITY_OPTIONS,
  SUBJECT_OPTIONS,
};

/** Alias of shared DIFFICULTY_OPTIONS for preferences screens. */
export const LEVEL_OPTIONS = DIFFICULTY_OPTIONS;

export const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Sistema' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
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
