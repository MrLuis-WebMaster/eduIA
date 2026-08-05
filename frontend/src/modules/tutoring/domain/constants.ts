/** Domain catalogs and limits for tutoring. */

import type { UserRole } from '@/shared/domain';

import type { QuickAction } from './types';

export {
  SUBJECT_OPTIONS,
  DIFFICULTY_OPTIONS,
  SUBJECT_LABELS,
  ROLE_OPTIONS,
} from './value-objects';

export const MESSAGE_MAX_LENGTH = 2000;
export const MESSAGE_MIN_LENGTH = 2;
export const CONVERSATION_CONTEXT_LIMIT = 10;

export const QUICK_ACTIONS: Record<UserRole, QuickAction[]> = {
  student: [
    {
      id: 'explain',
      label: 'Explícame un concepto',
      prompt: 'Explícame este concepto con un ejemplo',
    },
    {
      id: 'example',
      label: 'Dame un ejemplo',
      prompt: 'Dame un ejemplo claro de esto',
    },
    {
      id: 'question',
      label: 'Hazme una pregunta',
      prompt: 'Hazme una pregunta para practicar',
    },
    {
      id: 'steps',
      label: 'Ayúdame paso a paso',
      prompt: '¿Cómo lo resuelvo paso a paso?',
    },
  ],
  teacher: [
    {
      id: 'class-ideas',
      label: 'Ideas para clase',
      prompt: 'Dame ideas para explicar esto en clase',
    },
    {
      id: 'common-errors',
      label: 'Errores comunes',
      prompt: '¿Cuáles son los errores comunes?',
    },
    {
      id: 'formative',
      label: 'Evaluación corta',
      prompt: 'Sugiere una evaluación formativa corta',
    },
  ],
};
