/** Pure helpers to derive learning-progress metrics. */

import type {
  Difficulty,
  RecentTutoringSessionDto,
  Subject,
} from '@/modules/tutoring/domain';
import { DIFFICULTY_OPTIONS, SUBJECT_LABELS } from '@/modules/tutoring/domain';

import type {
  LevelUsage,
  ProgressSummary,
  RecentProgressItem,
  SubjectProgress,
  WeeklyActivityDay,
} from './types';

const WEEKDAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as const;

const DIFFICULTY_LABELS: Record<Difficulty, string> = Object.fromEntries(
  DIFFICULTY_OPTIONS.map((o) => [o.value, o.label]),
) as Record<Difficulty, string>;

export function emptyProgressSummary(): ProgressSummary {
  return {
    sessionCount: 0,
    questionCount: 0,
    topSubject: null,
    topSubjectLabel: null,
    mostUsedLevel: null,
    mostUsedLevelLabel: null,
    streakDays: 0,
    weeklyActivity: buildWeeklyActivity([], new Date()),
    progressBySubject: [],
    levelUsage: [],
    topicsStudied: [],
    topicsToReinforce: [],
    recommendations: [
      'Envía tu primera pregunta en el Tutor para empezar a registrar progreso.',
    ],
    recentItems: [],
    teacherResources: [],
    teacherActivities: [],
  };
}

/** Pure function — derive dashboard metrics from tutoring session DTOs. */
export function computeProgressSummary(
  sessions: RecentTutoringSessionDto[],
  now: Date = new Date(),
): ProgressSummary {
  if (sessions.length === 0) {
    return emptyProgressSummary();
  }

  const sessionCount = sessions.length;
  const questionCount = sessions.reduce((sum, s) => sum + s.questionCount, 0);

  const subjectCounts = new Map<Subject, { sessions: number; questions: number }>();
  const levelCounts = new Map<Difficulty, number>();
  const activityDates: string[] = [];

  for (const session of sessions) {
    const subjectEntry = subjectCounts.get(session.subject) ?? {
      sessions: 0,
      questions: 0,
    };
    subjectEntry.sessions += 1;
    subjectEntry.questions += session.questionCount;
    subjectCounts.set(session.subject, subjectEntry);

    levelCounts.set(
      session.difficulty,
      (levelCounts.get(session.difficulty) ?? 0) + 1,
    );

    for (let i = 0; i < session.questionCount; i += 1) {
      activityDates.push(toDateKey(new Date(session.updatedAt)));
    }
    if (session.questionCount === 0) {
      activityDates.push(toDateKey(new Date(session.updatedAt)));
    }
  }

  const progressBySubject: SubjectProgress[] = [...subjectCounts.entries()]
    .map(([subject, counts]) => ({
      subject,
      label: SUBJECT_LABELS[subject],
      sessionCount: counts.sessions,
      questionCount: counts.questions,
    }))
    .sort((a, b) => b.questionCount - a.questionCount || b.sessionCount - a.sessionCount);

  const top = progressBySubject[0] ?? null;

  const levelUsage: LevelUsage[] = [...levelCounts.entries()]
    .map(([difficulty, count]) => ({
      difficulty,
      label: DIFFICULTY_LABELS[difficulty],
      sessionCount: count,
    }))
    .sort((a, b) => b.sessionCount - a.sessionCount);

  const mostUsed = levelUsage[0] ?? null;

  const topicsStudied = progressBySubject.map((s) => s.label);
  const topicsToReinforce = progressBySubject
    .filter((s) => s.sessionCount === 1 || s.questionCount <= 2)
    .map((s) => s.label);

  const streakDays = computeStreak(
    [...new Set(sessions.map((s) => toDateKey(new Date(s.updatedAt))))],
    now,
  );

  const weeklyActivity = buildWeeklyActivity(
    sessions.flatMap((s) =>
      Array.from({ length: Math.max(s.questionCount, 1) }, () =>
        toDateKey(new Date(s.updatedAt)),
      ),
    ),
    now,
  );

  const recommendations = buildStudentRecommendations({
    streakDays,
    questionCount,
    topicsToReinforce,
    topSubjectLabel: top?.label ?? null,
  });

  const recentItems: RecentProgressItem[] = sessions.slice(0, 8).map((s) => ({
    id: s.id,
    title: s.firstQuestion ?? `Sesión de ${s.subjectLabel}`,
    subtitle: `${s.subjectLabel} · ${DIFFICULTY_LABELS[s.difficulty]} · ${s.questionCount} pregunta${s.questionCount === 1 ? '' : 's'}`,
    updatedAt: s.updatedAt,
  }));

  const teacherResources = buildTeacherResources(progressBySubject);
  const teacherActivities = buildTeacherActivities(progressBySubject, mostUsed);

  return {
    sessionCount,
    questionCount,
    topSubject: top?.subject ?? null,
    topSubjectLabel: top?.label ?? null,
    mostUsedLevel: mostUsed?.difficulty ?? null,
    mostUsedLevelLabel: mostUsed?.label ?? null,
    streakDays,
    weeklyActivity,
    progressBySubject,
    levelUsage,
    topicsStudied,
    topicsToReinforce:
      topicsToReinforce.length > 0
        ? topicsToReinforce
        : topicsStudied.slice(0, 1),
    recommendations,
    recentItems,
    teacherResources,
    teacherActivities,
  };
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function computeStreak(activityDays: string[], now: Date): number {
  const unique = [...new Set(activityDays)].sort().reverse();
  if (unique.length === 0) return 0;

  const today = toDateKey(now);
  const yesterday = toDateKey(addDays(now, -1));

  let cursor = unique[0] === today || unique[0] === yesterday ? unique[0] : null;
  if (!cursor) return 0;

  let streak = 0;
  let expected = cursor;
  for (const day of unique) {
    if (day !== expected) break;
    streak += 1;
    expected = toDateKey(addDays(parseDateKey(expected), -1));
  }
  return streak;
}

export function buildWeeklyActivity(
  activityDates: string[],
  now: Date,
): WeeklyActivityDay[] {
  const counts = new Map<string, number>();
  for (const date of activityDates) {
    counts.set(date, (counts.get(date) ?? 0) + 1);
  }

  const days: WeeklyActivityDay[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = addDays(now, -offset);
    const key = toDateKey(date);
    days.push({
      date: key,
      label: WEEKDAY_LABELS[date.getDay()],
      questionCount: counts.get(key) ?? 0,
    });
  }
  return days;
}

function buildStudentRecommendations(input: {
  streakDays: number;
  questionCount: number;
  topicsToReinforce: string[];
  topSubjectLabel: string | null;
}): string[] {
  const items: string[] = [];
  if (input.streakDays >= 3) {
    items.push(`Llevas ${input.streakDays} días seguidos — mantén la racha con una pregunta corta hoy.`);
  } else if (input.streakDays === 0) {
    items.push('Practica hoy para iniciar tu racha de estudio.');
  } else {
    items.push('Vuelve mañana para alargar tu racha.');
  }

  if (input.topicsToReinforce[0]) {
    items.push(`Refuerza ${input.topicsToReinforce[0]} con un ejemplo paso a paso en el Tutor.`);
  }

  if (input.topSubjectLabel && input.questionCount >= 3) {
    items.push(`Sube de nivel en ${input.topSubjectLabel} o explora otra materia favorita.`);
  }

  return items.slice(0, 3);
}

function buildTeacherResources(subjects: SubjectProgress[]): string[] {
  if (subjects.length === 0) {
    return [
      'Usa el Tutor para generar guiones de explicación y material de clase.',
    ];
  }
  return subjects.slice(0, 3).map((s) => {
    switch (s.subject) {
      case 'math':
        return 'Ficha de problemas graduales (básico → avanzado) para Matemáticas.';
      case 'science':
        return 'Guion de demo corta con pregunta socrática para Ciencias.';
      case 'language':
        return 'Rúbrica rápida de escritura para Lengua.';
      case 'history':
        return 'Línea de tiempo + debate guiado para Historia.';
      default:
        return `Banco de preguntas formativas para ${s.label}.`;
    }
  });
}

function buildTeacherActivities(
  subjects: SubjectProgress[],
  mostUsed: LevelUsage | null,
): string[] {
  const level = mostUsed?.label ?? 'Básico';
  if (subjects.length === 0) {
    return [
      'Pide al Tutor ideas de evaluación formativa para tu próxima clase.',
    ];
  }
  return subjects.slice(0, 3).map((s) =>
    `Actividad de ${level} en ${s.label}: errores comunes + mini práctica (5 min).`,
  );
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setHours(12, 0, 0, 0);
  next.setDate(next.getDate() + days);
  return next;
}

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}
