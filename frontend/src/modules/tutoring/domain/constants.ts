/** Domain catalogs, limits, and option lists for tutoring. */

import type {
  Difficulty,
  FollowUpKind,
  FollowUpSuggestion,
  QuickAction,
  Subject,
  UserRole,
} from './types';

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

export const MESSAGE_MAX_LENGTH = 2000;
export const MESSAGE_MIN_LENGTH = 2;
export const CONVERSATION_CONTEXT_LIMIT = 10;

export const QUICK_ACTIONS: Record<UserRole, QuickAction[]> = {
  student: [
    {
      id: 'explain',
      label: 'Explícame un concepto',
      prompt: 'Explícame este concepto con un ejemplo',
      accent: 'violet',
    },
    {
      id: 'example',
      label: 'Dame un ejemplo',
      prompt: 'Dame un ejemplo claro de esto',
      accent: 'pink',
    },
    {
      id: 'question',
      label: 'Hazme una pregunta',
      prompt: 'Hazme una pregunta para practicar',
      accent: 'orange',
    },
    {
      id: 'steps',
      label: 'Ayúdame paso a paso',
      prompt: '¿Cómo lo resuelvo paso a paso?',
      accent: 'green',
    },
  ],
  teacher: [
    {
      id: 'class-ideas',
      label: 'Ideas para clase',
      prompt: 'Dame ideas para explicar esto en clase',
      accent: 'violet',
    },
    {
      id: 'common-errors',
      label: 'Errores comunes',
      prompt: '¿Cuáles son los errores comunes?',
      accent: 'orange',
    },
    {
      id: 'formative',
      label: 'Evaluación corta',
      prompt: 'Sugiere una evaluación formativa corta',
      accent: 'teal',
    },
  ],
};

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
