/** Lightweight session-scope checks for the offline FakeTutorEngine. */

import type { Subject, UserRole } from '../types';
import { SUBJECT_LABELS } from '../constants';

export type LocalScopeAssessment =
  | { ok: true }
  | { ok: false; kind: 'off_subject' | 'role_violation'; reply: string };

const SUBJECT_SIGNALS: Record<Exclude<Subject, 'other'>, RegExp[]> = {
  math: [
    /\bmatem[aá]tic/i,
    /\bfracci[oó]n/i,
    /\becuaci[oó]n/i,
    /\balgebra\b/i,
    /\bderivad/i,
    /\bintegral\b/i,
    /\bgeometr/i,
    /\bporcentaje/i,
    /\bequation\b/i,
    /\bfraction\b/i,
    /\b\d{1,3}\s*\/\s*\d{1,3}\b/,
    /\b\d+\s*[+\-×÷*]\s*\d+\b/,
    /\bresuelve\b.*\d/i,
    /\bmcm\b|\bmcd\b|\bdenominador\b|\bnumerador\b/i,
  ],
  science: [
    /\bcienci/i,
    /\bfotos[ií]ntesis\b/i,
    /\bc[eé]lula/i,
    /\bmol[eé]cula/i,
    /\bqu[ií]mica\b/i,
    /\bf[ií]sica\b/i,
    /\bchemistry\b|\bphysics\b|\bbiology\b/i,
  ],
  language: [
    /\blengua\b/i,
    /\bgram[aá]tica\b/i,
    /\bortograf[ií]a\b/i,
    /\bsin[oó]nimo/i,
    /\bconjug/i,
    /\bgrammar\b/i,
  ],
  history: [
    /\bhistoria\b/i,
    /\brevoluci[oó]n francesa\b/i,
    /\bguerra mundial\b/i,
    /\bimperio romano\b/i,
    /\bedad media\b/i,
    /\bworld war\b/i,
  ],
};

const STUDENT_ROLE_VIOLATIONS: RegExp[] = [
  /\bhazme\s+(la\s+)?tarea\b/i,
  /\bresu[eé]lveme\s+(todo|la\s+tarea|el\s+examen)\b/i,
  /\bescr[ií]be(me)?\s+(el|un|mi)\s+ensayo\b/i,
  /\bwrite\s+(my|the)\s+(essay|homework|assignment)\b/i,
  /\bdame\s+las\s+respuestas\s+del\s+examen\b/i,
];

export function assessLocalTutorScope(input: {
  subject: Subject;
  userRole: UserRole;
  message: string;
}): LocalScopeAssessment {
  const message = input.message.trim();
  if (!message) return { ok: true };

  if (
    input.userRole === 'student' &&
    STUDENT_ROLE_VIOLATIONS.some((pattern) => pattern.test(message))
  ) {
    return {
      ok: false,
      kind: 'role_violation',
      reply: [
        '### Fuera de mi rol como tutor',
        '',
        'Puedo **acompañarte a aprender**, pero no completar tareas o exámenes por ti.',
        '',
        'Si quieres, reformula tu duda (un concepto, un paso, o un ejemplo) y te guío.',
      ].join('\n'),
    };
  }

  if (input.subject === 'other') return { ok: true };

  const scores = {
    math: 0,
    science: 0,
    language: 0,
    history: 0,
  } as Record<Exclude<Subject, 'other'>, number>;

  for (const key of Object.keys(SUBJECT_SIGNALS) as Array<
    Exclude<Subject, 'other'>
  >) {
    for (const pattern of SUBJECT_SIGNALS[key]) {
      if (pattern.test(message)) scores[key] += 1;
    }
  }

  const activeScore = scores[input.subject];
  let bestOther: Exclude<Subject, 'other'> | null = null;
  let bestOtherScore = 0;

  for (const key of Object.keys(SUBJECT_SIGNALS) as Array<
    Exclude<Subject, 'other'>
  >) {
    if (key === input.subject) continue;
    if (scores[key] > bestOtherScore) {
      bestOtherScore = scores[key];
      bestOther = key;
    }
  }

  if (bestOther && bestOtherScore >= 1 && activeScore === 0) {
    return {
      ok: false,
      kind: 'off_subject',
      reply: [
        '### Fuera del filtro de materia',
        '',
        `Ahora mismo el tutor está en **${SUBJECT_LABELS[input.subject]}**, y tu pregunta parece de **${SUBJECT_LABELS[bestOther]}**.`,
        '',
        'No puedo desarrollar ese contenido aquí. Cambia el filtro de materia o reformula la pregunta dentro de la materia activa.',
      ].join('\n'),
    };
  }

  return { ok: true };
}
