import type {
  Difficulty,
  ExplanationStyle,
  TutorPersonality,
  UserRole,
} from '../types.js';

export interface PedagogicalContext {
  subject: string;
  difficulty: Difficulty;
  userRole: UserRole;
  explanationStyle: ExplanationStyle;
  tutorPersonality: TutorPersonality;
}

export type TutorSubjectKey =
  | 'math'
  | 'science'
  | 'language'
  | 'history'
  | 'other';

export type ScopeAssessment =
  | { ok: true }
  | {
      ok: false;
      kind: 'off_subject' | 'role_violation';
      /** Ready-to-show assistant reply (Markdown). */
      reply: string;
    };

const DIFFICULTY_GUIDANCE: Record<Difficulty, string> = {
  basic:
    'DIFFICULTY basic (mandatory): short sentences, everyday words only, define any term immediately, one simple example, typically 80–150 words. Do not sound advanced.',
  intermediate:
    'DIFFICULTY intermediate (mandatory): clear + precise, introduce key vocabulary once, one worked example, invite the learner to try a similar step. Typically 150–250 words.',
  advanced:
    'DIFFICULTY advanced (mandatory): go deeper with nuance, edge cases, and concept connections. Use precise domain vocabulary. Typically 220–350 words. Do not oversimplify.',
};

const ROLE_GUIDANCE: Record<UserRole, string> = {
  student:
    'ROLE student (mandatory): tutor a learner. Scaffold reasoning; do not only dump the final answer. Prefer step-by-step help.',
  teacher:
    'ROLE teacher (mandatory): assist a teacher. Include classroom-ready framing, common misconceptions, a formative check, and optional differentiation — not a student homework dump.',
};

const PERSONALITY_GUIDANCE: Record<TutorPersonality, string> = {
  friendly:
    'PERSONALITY friendly (mandatory): warm and conversational. Soft encouragement is OK. Avoid stiff academic tone.',
  formal:
    'PERSONALITY formal (mandatory): precise and professional. Prefer “usted” in Spanish. Avoid slang and pep-talk filler.',
  motivating:
    'PERSONALITY motivating (mandatory): upbeat. Celebrate effort, normalize struggle, reinforce progress explicitly in the reply.',
  patient:
    'PERSONALITY patient (mandatory): calm and unhurried. Break into small steps and briefly recap before moving on.',
  direct:
    'PERSONALITY direct (mandatory): concise. Lead with the key idea in the first sentence; minimize fluff.',
};

const STYLE_GUIDANCE: Record<ExplanationStyle, string> = {
  simple:
    'STYLE simple (mandatory): ≤3 short paragraphs or ≤5 bullets. One clear path. No digressions.',
  detailed:
    'STYLE detailed (mandatory): include context, a worked example, and organized steps/sections. More depth than simple.',
  socratic:
    'STYLE socratic (mandatory): ask at least 2 guiding questions before revealing the full solution. Do not front-load the complete answer.',
};

const SUBJECT_ALIASES: Record<TutorSubjectKey, string[]> = {
  math: ['matemáticas', 'matematicas', 'math', 'mathematics'],
  science: ['ciencias', 'science', 'ciencias naturales'],
  language: ['lengua', 'language', 'español', 'espanol', 'spanish', 'literatura'],
  history: ['historia', 'history'],
  other: ['otro', 'other', 'general'],
};

const SUBJECT_DISPLAY: Record<TutorSubjectKey, string> = {
  math: 'Matemáticas',
  science: 'Ciencias',
  language: 'Lengua',
  history: 'Historia',
  other: 'Otro',
};

/** Strong topical signals used by fake providers / tests (not the remote LLM). */
const SUBJECT_SIGNALS: Record<Exclude<TutorSubjectKey, 'other'>, RegExp[]> = {
  math: [
    /\bmatem[aá]tic/i,
    /\bfracci[oó]n/i,
    /\becuaci[oó]n/i,
    /\balgebra\b/i,
    /\bderivad/i,
    /\bintegral\b/i,
    /\bgeometr/i,
    /\bporcentaje/i,
    /\bmultiplic/i,
    /\bdivisi[oó]n\b/i,
    /\bsuma\b/i,
    /\bresta\b/i,
    /\bpitag[oó]ras\b/i,
    /\bmatriz\b|\bmatrices\b/i,
    /\bprobabilidad\b/i,
    /\bequation\b/i,
    /\bfraction\b/i,
    /\bcalculus\b/i,
    // Numeric fraction / arithmetic notation (e.g. "3/4 + 5/6")
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
    /\bgravedad\b/i,
    /\b[aá]tomo/i,
    /\benerg[ií]a\b/i,
    /\becosistema\b/i,
    /\bbacteria/i,
    /\bADN\b|\bDNA\b/,
    /\bgravity\b/i,
    /\bchemistry\b|\bphysics\b|\bbiology\b/i,
  ],
  language: [
    /\blengua\b/i,
    /\bgram[aá]tica\b/i,
    /\bortograf[ií]a\b/i,
    /\bsin[oó]nimo/i,
    /\bant[oó]nimo/i,
    /\bconjug/i,
    /\bmet[aá]fora\b/i,
    /\bsustantivo\b|\badjetivo\b|\bverbo\b/i,
    /\bortography\b|\bgrammar\b|\bsynonym\b/i,
    /\bliteratura\b|\bpoema\b|\bensayo\b/i,
  ],
  history: [
    /\bhistoria\b/i,
    /\brevoluci[oó]n francesa\b/i,
    /\bguerra mundial\b/i,
    /\bimperio romano\b/i,
    /\bedad media\b/i,
    /\bindependencia\b/i,
    /\bcolonizaci[oó]n\b/i,
    /\bcivilizaci[oó]n\b/i,
    /\bhistoria mundial\b/i,
    /\bworld war\b/i,
    /\bmiddle ages\b|\bromain empire\b|\bromán empire\b/i,
  ],
};

const STUDENT_ROLE_VIOLATIONS: RegExp[] = [
  /\bhazme\s+(la\s+)?tarea\b/i,
  /\bresu[eé]lveme\s+(todo|la\s+tarea|el\s+examen)\b/i,
  /\bescr[ií]be(me)?\s+(el|un|mi)\s+ensayo\b/i,
  /\bwrite\s+(my|the)\s+(essay|homework|assignment)\b/i,
  /\bcompleta(me)?\s+(el|mi)\s+examen\b/i,
  /\bdame\s+las\s+respuestas\s+del\s+examen\b/i,
];

/**
 * Builds the system prompt for tutoring. Lives in domain policy so AI adapters
 * stay transport-only and do not embed pedagogy rules.
 *
 * The model must decide scope semantically (not via keyword lists) and return
 * a structured JSON decision consumed by {@link parseTutorAgentDecision}.
 */
export function buildPedagogicalSystemPrompt(ctx: PedagogicalContext): string {
  const subject = ctx.subject.trim() || 'general studies';
  const subjectKey = resolveSubjectKey(subject);

  return [
    'You are EduIA, an educational tutoring assistant for Spanish-speaking and bilingual learners.',
    'Write the user-facing `reply` in the same language the user writes in (Spanish or English). Prefer clear Markdown in `reply`.',
    'Math notation inside `reply` when answering Math: use LaTeX inside $...$ (inline) or $$...$$ (block).',
    `Active subject filter: ${subject} (canonical: ${SUBJECT_DISPLAY[subjectKey]}).`,
    ROLE_GUIDANCE[ctx.userRole],
    DIFFICULTY_GUIDANCE[ctx.difficulty],
    PERSONALITY_GUIDANCE[ctx.tutorPersonality],
    STYLE_GUIDANCE[ctx.explanationStyle],
    'CONTROL PRIORITY (mandatory): difficulty, explanation style, and personality above MUST visibly change how you write `reply`. If earlier conversation turns used different controls, IGNORE that prior tone and adapt to THIS turn’s controls.',
    ...buildScopeRules(subject, subjectKey, ctx.userRole),
    'Safety: refuse harmful, dishonest academic shortcuts (e.g. writing graded essays for the student), and stay age-appropriate.',
    'Keep answers focused; aim for helpful depth without unnecessary length — but still obey the difficulty/style length rules above.',
    '',
    'OUTPUT CONTRACT (mandatory):',
    'Return ONLY a JSON object with this shape:',
    '{"action":"answer"|"refuse_off_subject"|"refuse_role","reply":"<markdown for the user>"}',
    'Decide `action` by understanding the user intent relative to the active subject and role — do not rely on keyword matching.',
    'If the active subject is History and the user asks you to teach Mathematics (fractions, equations, arithmetic, etc.), you MUST use action "refuse_off_subject" and MUST NOT solve or explain the math in `reply`.',
    'Apply the same semantic judgment for any clear cross-subject request (Science vs Language, etc.).',
    'When action is refuse_*, `reply` explains the mismatch and suggests switching the subject filter or rephrasing; never teach the out-of-scope content.',
    'When action is answer, `reply` is the full tutoring response shaped by the difficulty/style/personality controls.',
  ].join('\n');
}

/** Short per-turn reminder so controls beat conversation inertia. */
export function buildTurnControlReminder(ctx: PedagogicalContext): string {
  return [
    'CURRENT CONTROLS FOR THIS TURN (override any earlier assistant tone):',
    `- subject: ${ctx.subject.trim() || 'general studies'}`,
    `- difficulty: ${ctx.difficulty}`,
    `- role: ${ctx.userRole}`,
    `- explanationStyle: ${ctx.explanationStyle}`,
    `- tutorPersonality: ${ctx.tutorPersonality}`,
    'Adapt this reply to these controls now.',
  ].join('\n');
}

export type TutorAgentAction =
  | 'answer'
  | 'refuse_off_subject'
  | 'refuse_role';

export type TutorAgentDecision = {
  action: TutorAgentAction;
  reply: string;
};

/** Parse the structured tutor agent JSON (with light fence/raw fallbacks). */
export function parseTutorAgentDecision(
  raw: string,
): TutorAgentDecision | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const candidates = [trimmed];
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) candidates.unshift(fenced[1].trim());
  const embedded = trimmed.match(/\{[\s\S]*\}/);
  if (embedded?.[0]) candidates.unshift(embedded[0]);

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as Partial<TutorAgentDecision>;
      if (
        parsed &&
        (parsed.action === 'answer' ||
          parsed.action === 'refuse_off_subject' ||
          parsed.action === 'refuse_role') &&
        typeof parsed.reply === 'string' &&
        parsed.reply.trim().length > 0
      ) {
        return {
          action: parsed.action,
          reply: parsed.reply.trim(),
        };
      }
    } catch {
      // try next candidate
    }
  }

  return null;
}

function buildScopeRules(
  subjectLabel: string,
  subjectKey: TutorSubjectKey,
  userRole: UserRole,
): string[] {
  const subjectRules =
    subjectKey === 'other'
      ? [
          'Subject scope: the active filter is "Other" — you may help across school topics, but stay educational and age-appropriate.',
        ]
      : [
          `Subject scope (hard boundary): only teach content that belongs to **${subjectLabel}**.`,
          'If the user asks about a clearly different school subject (e.g. Math while History is selected), do NOT teach that content.',
          'Instead: (1) politely say it is outside the active subject filter, (2) name the mismatch, (3) invite them to switch the subject filter in the app or rephrase within the active subject.',
          'Borderline help is OK when it supports the active subject (e.g. a timeline date in History, light counting that serves a History question). Reject when the main goal is another discipline.',
        ];

  const roleRules =
    userRole === 'student'
      ? [
          'Role scope (student): guide learning; do not complete graded work for them (full essays, exam answer keys, or “do my homework”).',
          'If they ask for dishonest shortcuts, refuse briefly, explain why, and offer a learning-oriented alternative (outline, practice question, steps to try).',
        ]
      : [
          'Role scope (teacher): optimize for classroom use — explanations, misconceptions, formative checks, differentiation tips.',
          'Do not role-play as a student completing graded assignments; stay in a teacher-assistant posture.',
        ];

  return [...subjectRules, ...roleRules];
}

/** Normalize free-text subject labels from the API into a canonical key. */
export function resolveSubjectKey(subject: string): TutorSubjectKey {
  const normalized = subject.trim().toLowerCase();
  if (!normalized) return 'other';

  for (const [key, aliases] of Object.entries(SUBJECT_ALIASES) as Array<
    [TutorSubjectKey, string[]]
  >) {
    if (aliases.some((alias) => normalized === alias || normalized.includes(alias))) {
      return key;
    }
  }

  return 'other';
}

/**
 * Deterministic scope helper for the fake provider / unit tests only.
 * The OpenAI path must decide scope semantically via the model + JSON contract.
 */
export function assessTutorScope(input: {
  subject: string;
  userRole: UserRole;
  message: string;
}): ScopeAssessment {
  const message = input.message.trim();
  if (!message) return { ok: true };

  if (input.userRole === 'student' && matchesAny(message, STUDENT_ROLE_VIOLATIONS)) {
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

  const active = resolveSubjectKey(input.subject);
  if (active === 'other') return { ok: true };

  const scores = scoreSubjects(message);
  const activeScore = scores[active];
  let bestOther: Exclude<TutorSubjectKey, 'other'> | null = null;
  let bestOtherScore = 0;

  for (const key of Object.keys(SUBJECT_SIGNALS) as Array<
    Exclude<TutorSubjectKey, 'other'>
  >) {
    if (key === active) continue;
    if (scores[key] > bestOtherScore) {
      bestOtherScore = scores[key];
      bestOther = key;
    }
  }

  // Foreign topical signal with no support for the active subject.
  if (bestOther && bestOtherScore >= 1 && activeScore === 0) {
    return {
      ok: false,
      kind: 'off_subject',
      reply: [
        '### Fuera del filtro de materia',
        '',
        `Ahora mismo el tutor está en **${SUBJECT_DISPLAY[active]}**, y tu pregunta parece de **${SUBJECT_DISPLAY[bestOther]}**.`,
        '',
        'No puedo desarrollar ese contenido aquí. Cambia el filtro de materia en la app o reformula la pregunta dentro de la materia activa.',
      ].join('\n'),
    };
  }

  return { ok: true };
}

function scoreSubjects(message: string): Record<Exclude<TutorSubjectKey, 'other'>, number> {
  const scores = {
    math: 0,
    science: 0,
    language: 0,
    history: 0,
  } as Record<Exclude<TutorSubjectKey, 'other'>, number>;

  for (const key of Object.keys(SUBJECT_SIGNALS) as Array<
    Exclude<TutorSubjectKey, 'other'>
  >) {
    for (const pattern of SUBJECT_SIGNALS[key]) {
      if (pattern.test(message)) scores[key] += 1;
    }
  }

  return scores;
}

function matchesAny(value: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(value));
}
