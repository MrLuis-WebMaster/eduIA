import {
  Atom,
  BookOpen,
  Calculator,
  CircleDot,
  Ellipsis,
  Landmark,
  Sparkles,
  Zap,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import type { AppSelectOption } from '@/design-system';

import type { Difficulty, Subject } from '../domain';

/** Shared subject choices for Tutor filters (icons + descriptions). */
export const SUBJECT_SELECT_OPTIONS: (AppSelectOption<Subject> & {
  icon: LucideIcon;
  description: string;
})[] = [
  {
    value: 'math',
    label: 'Matemáticas',
    description: 'Álgebra, geometría, cálculo y más',
    icon: Calculator,
  },
  {
    value: 'science',
    label: 'Ciencias',
    description: 'Física, química y biología',
    icon: Atom,
  },
  {
    value: 'language',
    label: 'Lengua',
    description: 'Lectura, escritura y gramática',
    icon: BookOpen,
  },
  {
    value: 'history',
    label: 'Historia',
    description: 'Hechos, contextos y análisis',
    icon: Landmark,
  },
  {
    value: 'other',
    label: 'Otro',
    description: 'Cualquier otro tema de estudio',
    icon: Ellipsis,
  },
];

/** Shared difficulty choices for Tutor filters. */
export const DIFFICULTY_SELECT_OPTIONS: (AppSelectOption<Difficulty> & {
  icon: LucideIcon;
  description: string;
})[] = [
  {
    value: 'basic',
    label: 'Básico',
    description: 'Fundamentos claros y paso a paso',
    icon: CircleDot,
  },
  {
    value: 'intermediate',
    label: 'Intermedio',
    description: 'Práctica con un poco más de reto',
    icon: Zap,
  },
  {
    value: 'advanced',
    label: 'Avanzado',
    description: 'Profundiza y conecta ideas complejas',
    icon: Sparkles,
  },
];
