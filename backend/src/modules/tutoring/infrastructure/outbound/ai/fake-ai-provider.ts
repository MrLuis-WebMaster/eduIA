import { AppError } from '@/shared/errors/app-error.js';
import { assessTutorScope } from '../../../domain/policies/pedagogical-policy.js';
import type {
  AIProvider,
  GenerateCompletionInput,
  GenerateCompletionResult,
} from '../../../application/ports/ai-provider.js';

/**
 * Deterministic provider for local demos and automated tests.
 * Uses structured `input.context` — never parses the system prompt.
 * Scope heuristics here are fake-only; OpenAI decides scope semantically.
 */
export class FakeAIProvider implements AIProvider {
  readonly name = 'fake';

  async generateCompletion(
    input: GenerateCompletionInput,
  ): Promise<GenerateCompletionResult> {
    if (input.signal?.aborted) {
      throw AppError.aiTimeout();
    }

    const userMessages = input.messages.filter((m) => m.role === 'user');
    const lastUser = userMessages.at(-1)?.content?.trim() ?? '';
    const subject = input.context?.subject?.trim() || 'tu materia';
    const userRole = input.context?.userRole ?? 'student';
    const difficulty = input.context?.difficulty ?? 'basic';
    const explanationStyle = input.context?.explanationStyle ?? 'simple';
    const tutorPersonality = input.context?.tutorPersonality ?? 'friendly';

    const scope = assessTutorScope({
      subject,
      userRole,
      message: lastUser,
    });

    if (!scope.ok) {
      const action =
        scope.kind === 'role_violation' ? 'refuse_role' : 'refuse_off_subject';
      return {
        content: JSON.stringify({ action, reply: scope.reply }),
        provider: this.name,
        model: 'fake-v1',
      };
    }

    const reply = buildFakeReply({
      subject,
      difficulty,
      userRole,
      explanationStyle,
      tutorPersonality,
      lastUser,
    });

    return {
      content: JSON.stringify({ action: 'answer', reply }),
      provider: this.name,
      model: 'fake-v1',
    };
  }
}

function buildFakeReply(input: {
  subject: string;
  difficulty: string;
  userRole: string;
  explanationStyle: string;
  tutorPersonality: string;
  lastUser: string;
}): string {
  const openingByPersonality: Record<string, string> = {
    friendly: 'Vamos con calma, te acompaño.',
    formal: 'Procedamos con una explicación estructurada.',
    motivating: '¡Buen enfoque! Sigamos construyendo desde aquí.',
    patient: 'Sin prisa: revisemos esto paso a paso.',
    direct: 'Idea clave primero:',
  };

  const depthByDifficulty: Record<string, string> = {
    basic: 'Nivel básico: lenguaje sencillo y un solo ejemplo concreto.',
    intermediate:
      'Nivel intermedio: vocabulario clave + un ejemplo trabajado.',
    advanced:
      'Nivel avanzado: matices, casos límite y conexiones entre ideas.',
  };

  const shapeByStyle: Record<string, string[]> = {
    simple: [
      '1. Respuesta corta en una idea.',
      '2. Un ejemplo breve.',
      '3. Cierre en una frase.',
    ],
    detailed: [
      '1. Contexto breve.',
      '2. Ejemplo trabajado con pasos.',
      '3. Matiz o variación.',
      '4. Pregunta de comprobación.',
    ],
    socratic: [
      '1. ¿Qué parte ya entiendes?',
      '2. ¿Qué pasaría si cambias un dato?',
      '3. Solo después: esbozo de la solución.',
    ],
  };

  const roleLine =
    input.userRole === 'teacher'
      ? 'Enfoque docente: idea para clase + posible error frecuente.'
      : 'Enfoque estudiante: andamiaje para que razones tú.';

  return [
    `**(Fake EduIA · ${input.subject})**`,
    '',
    openingByPersonality[input.tutorPersonality] ?? openingByPersonality.friendly,
    depthByDifficulty[input.difficulty] ?? depthByDifficulty.basic,
    roleLine,
    `Estilo **${input.explanationStyle}** · Personalidad **${input.tutorPersonality}** · Dificultad **${input.difficulty}**.`,
    '',
    input.lastUser ? `Sobre: _"${truncate(input.lastUser, 160)}"_\n` : '',
    ...(shapeByStyle[input.explanationStyle] ?? shapeByStyle.simple),
    '',
    '_Respuesta generada por `FakeAIProvider` (sin llamar a un modelo externo)._',
  ]
    .filter(Boolean)
    .join('\n');
}

function truncate(value: string, max: number): string {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, max - 1)}…`;
}
