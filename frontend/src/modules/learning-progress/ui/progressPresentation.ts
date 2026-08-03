import type { ProgressSummary, SubjectProgress } from '../domain';

export type SubjectActivityRow = SubjectProgress & {
  /** Share of the most-active subject (0–100), not mastery. */
  relativePct: number;
  status: 'strong' | 'practice' | 'idle';
  statusLabel: string;
};

export type ProgressAchievement = {
  id: string;
  label: string;
  unlocked: boolean;
  progress: number;
};

export function firstNameFromDisplayName(displayName: string): string {
  const part = displayName.trim().split(/\s+/).filter(Boolean)[0];
  return part || 'estudiante';
}

export function weeklyActivityScore(
  summary: ProgressSummary,
  weeklyQuestionGoal: number = 7,
): {
  questionsThisWeek: number;
  target: number;
  percent: number;
  title: string;
  label: string;
  detail: string;
} {
  const target = Math.max(1, Math.round(weeklyQuestionGoal));
  const questionsThisWeek = summary.weeklyActivity.reduce(
    (sum, day) => sum + day.questionCount,
    0,
  );
  const percent = Math.min(
    100,
    Math.round((questionsThisWeek / target) * 100),
  );

  const detail =
    questionsThisWeek === 0
      ? `Aún no hay preguntas esta semana. Meta: ${target} preguntas.`
      : questionsThisWeek >= target
        ? `Cumpliste la meta (${questionsThisWeek} de ${target} preguntas).`
        : `Llevas ${questionsThisWeek} de ${target} preguntas esta semana.`;

  return {
    questionsThisWeek,
    target,
    percent,
    title: 'Meta semanal',
    label: `${questionsThisWeek}/${target} preg.`,
    detail,
  };
}

export function buildSubjectActivityRows(
  subjects: SubjectProgress[],
): SubjectActivityRow[] {
  const maxQuestions = Math.max(1, ...subjects.map((s) => s.questionCount));
  return subjects.slice(0, 4).map((subject) => {
    const relativePct = Math.round((subject.questionCount / maxQuestions) * 100);
    const status: SubjectActivityRow['status'] =
      relativePct >= 70 ? 'strong' : relativePct >= 35 ? 'practice' : 'idle';
    const statusLabel =
      status === 'strong'
        ? 'Muy activo'
        : status === 'practice'
          ? 'Necesita práctica'
          : 'Poca actividad';
    return { ...subject, relativePct, status, statusLabel };
  });
}

export function buildAchievements(
  summary: ProgressSummary,
): ProgressAchievement[] {
  return [
    {
      id: 'first-session',
      label: 'Primera sesión',
      unlocked: summary.sessionCount >= 1,
      progress: Math.min(1, summary.sessionCount),
    },
    {
      id: 'ten-questions',
      label: '10 preguntas',
      unlocked: summary.questionCount >= 10,
      progress: Math.min(1, summary.questionCount / 10),
    },
    {
      id: 'streak-3',
      label: 'Racha de 3',
      unlocked: summary.streakDays >= 3,
      progress: Math.min(1, summary.streakDays / 3),
    },
    {
      id: 'subjects-3',
      label: '3 materias',
      unlocked: summary.progressBySubject.length >= 3,
      progress: Math.min(1, summary.progressBySubject.length / 3),
    },
  ];
}

export function formatRelativeDay(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const key = (d: Date) =>
    `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  if (key(date) === key(today)) return 'Hoy';
  if (key(date) === key(yesterday)) return 'Ayer';

  const diffMs = today.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0);
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (days > 1 && days < 7) return `Hace ${days} días`;

  return date.toLocaleDateString('es', { day: 'numeric', month: 'short' });
}

export function heroCopy(summary: ProgressSummary, firstName: string): {
  title: string;
  body: string;
} {
  if (summary.sessionCount === 0) {
    return {
      title: `¡Empecemos, ${firstName}!`,
      body: 'Tu progreso aparecerá aquí cuando hables con el Tutor.',
    };
  }

  if (summary.streakDays >= 2) {
    return {
      title: `¡Vas por buen camino, ${firstName}!`,
      body: summary.topSubjectLabel
        ? `Llevas ${summary.streakDays} días de racha. Sigue con ${summary.topSubjectLabel} o refuerza lo pendiente.`
        : `Llevas ${summary.streakDays} días de racha. Una pregunta corta mantiene el ritmo.`,
    };
  }

  return {
    title: `Sigue adelante, ${firstName}`,
    body: summary.topicsToReinforce[0]
      ? `Última actividad registrada. Refuerza ${summary.topicsToReinforce[0]} cuando quieras.`
      : 'Cada sesión suma a tu resumen local de aprendizaje.',
  };
}
