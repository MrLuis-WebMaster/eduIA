/** Follow-up chip policy — classify assistant replies and suggest next prompts. */

import type { UserRole } from '@/shared/domain';

import type { FollowUpKind, FollowUpSuggestion } from '../types';

const FOLLOW_UP_SUGGESTIONS: Record<
  UserRole,
  Record<FollowUpKind, FollowUpSuggestion[]>
> = {
  student: {
    explanation: [
      {
        id: 'practice',
        label: 'Practicar ahora',
        prompt: 'Hazme una pregunta para practicar lo que acabas de explicar',
      },
      {
        id: 'another-example',
        label: 'Otro ejemplo',
        prompt: 'Dame otro ejemplo distinto sobre lo mismo',
      },
      {
        id: 'make-quiz',
        label: 'Crear un quiz',
        prompt: 'Crea un quiz corto de 3 preguntas sobre este tema',
      },
    ],
    activity: [
      {
        id: 'harder',
        label: 'Más difícil',
        prompt: 'Haz la actividad un poco más difícil',
      },
      {
        id: 'easier-time',
        label: 'Más corta',
        prompt: 'Reduce el tiempo o la cantidad de ítems',
      },
      {
        id: 'add-solutions',
        label: 'Agregar soluciones',
        prompt: 'Agrega las soluciones o una rúbrica breve',
      },
    ],
    summary: [
      {
        id: 'shorter',
        label: 'Más corto',
        prompt: 'Haz un resumen más corto, solo lo esencial',
      },
      {
        id: 'deeper',
        label: 'Más detallado',
        prompt: 'Amplía el resumen con más detalle',
      },
      {
        id: 'flashcards',
        label: 'Flashcards',
        prompt: 'Convierte este resumen en flashcards para estudiar',
      },
    ],
  },
  teacher: {
    explanation: [
      {
        id: 'class-activity',
        label: 'Actividad de clase',
        prompt: 'Propón una actividad corta para trabajar esto en clase',
      },
      {
        id: 'another-angle',
        label: 'Otro enfoque',
        prompt: 'Explícalo con otro enfoque o analogía para la clase',
      },
      {
        id: 'formative-check',
        label: 'Chequeo formativo',
        prompt: 'Sugiere 3 preguntas de chequeo formativo sobre esto',
      },
    ],
    activity: [
      {
        id: 'differentiate',
        label: 'Diferenciar',
        prompt: 'Adapta la actividad a dos niveles de dificultad',
      },
      {
        id: 'rubric',
        label: 'Rúbrica',
        prompt: 'Agrega una rúbrica breve para evaluar esta actividad',
      },
      {
        id: 'extend',
        label: 'Extender',
        prompt: 'Sugiere una extensión para estudiantes más avanzados',
      },
    ],
    summary: [
      {
        id: 'slide-bullets',
        label: 'Bullets para slides',
        prompt: 'Convierte el resumen en bullets listos para una diapositiva',
      },
      {
        id: 'deeper-teacher',
        label: 'Más detalle',
        prompt: 'Amplía el resumen con matices útiles para docencia',
      },
      {
        id: 'exit-ticket',
        label: 'Exit ticket',
        prompt: 'Crea un exit ticket de 2 preguntas basado en este resumen',
      },
    ],
  },
};

/** Heuristic: classify the latest assistant reply to pick follow-up chips. */
export function detectFollowUpKind(content: string): FollowUpKind {
  const text = content.toLowerCase();

  if (
    /\b(quiz|evaluación|evaluacion|pregunta\s*\d|opci[oó]n\s*[a-d]|verdadero|falso|ejercicio|actividad|completa|elige|selecciona|resuelve)\b/.test(
      text,
    )
  ) {
    return 'activity';
  }

  if (
    /\b(resumen|en\s+s[ií]ntesis|puntos?\s+clave|en\s+resumen|flashcard|para\s+recordar)\b/.test(
      text,
    )
  ) {
    return 'summary';
  }

  return 'explanation';
}

export function getFollowUpSuggestions(
  role: UserRole,
  lastAssistantContent: string,
): FollowUpSuggestion[] {
  const kind = detectFollowUpKind(lastAssistantContent);
  return FOLLOW_UP_SUGGESTIONS[role][kind];
}
