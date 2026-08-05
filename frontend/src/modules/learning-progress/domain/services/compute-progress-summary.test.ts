import { describe, expect, it } from 'vitest';

import {
  buildWeeklyActivity,
  computeProgressSummary,
  computeStreak,
  toDateKey,
} from './compute-progress-summary';
import type { RecentTutoringSessionDto } from '@/modules/tutoring';

function session(
  overrides: Partial<RecentTutoringSessionDto> &
    Pick<RecentTutoringSessionDto, 'id' | 'subject' | 'updatedAt'>,
): RecentTutoringSessionDto {
  return {
    subjectLabel: 'Matemáticas',
    difficulty: 'basic',
    questionCount: 1,
    firstQuestion: '¿Qué es una fracción?',
    lastAssistantPreview: 'Una fracción…',
    ...overrides,
  };
}

describe('computeProgressSummary', () => {
  it('returns empty summary when there are no sessions', () => {
    const summary = computeProgressSummary([]);
    expect(summary.sessionCount).toBe(0);
    expect(summary.questionCount).toBe(0);
    expect(summary.topSubject).toBeNull();
    expect(summary.recommendations.length).toBeGreaterThan(0);
  });

  it('aggregates sessions, questions, top subject and level', () => {
    const now = new Date('2026-07-31T12:00:00');
    const summary = computeProgressSummary(
      [
        session({
          id: '1',
          subject: 'math',
          subjectLabel: 'Matemáticas',
          difficulty: 'basic',
          questionCount: 2,
          updatedAt: '2026-07-31T10:00:00.000Z',
        }),
        session({
          id: '2',
          subject: 'science',
          subjectLabel: 'Ciencias',
          difficulty: 'intermediate',
          questionCount: 1,
          updatedAt: '2026-07-30T10:00:00.000Z',
        }),
        session({
          id: '3',
          subject: 'math',
          subjectLabel: 'Matemáticas',
          difficulty: 'basic',
          questionCount: 3,
          updatedAt: '2026-07-29T10:00:00.000Z',
        }),
      ],
      now,
    );

    expect(summary.sessionCount).toBe(3);
    expect(summary.questionCount).toBe(6);
    expect(summary.topSubject).toBe('math');
    expect(summary.topSubjectLabel).toBe('Matemáticas');
    expect(summary.mostUsedLevel).toBe('basic');
    expect(summary.topicsStudied).toContain('Matemáticas');
    expect(summary.topicsStudied).toContain('Ciencias');
    expect(summary.progressBySubject[0]?.subject).toBe('math');
    expect(summary.weeklyActivity).toHaveLength(7);
    expect(summary.teacherResources.length).toBeGreaterThan(0);
    expect(summary.recentItems).toHaveLength(3);
  });
});

describe('computeStreak', () => {
  it('counts consecutive days ending today', () => {
    const now = new Date('2026-07-31T15:00:00');
    const days = [
      toDateKey(now),
      toDateKey(new Date('2026-07-30T12:00:00')),
      toDateKey(new Date('2026-07-29T12:00:00')),
    ];
    expect(computeStreak(days, now)).toBe(3);
  });

  it('returns 0 when last activity is older than yesterday', () => {
    const now = new Date('2026-07-31T15:00:00');
    expect(computeStreak(['2026-07-28'], now)).toBe(0);
  });
});

describe('buildWeeklyActivity', () => {
  it('builds seven days with counts', () => {
    const now = new Date('2026-07-31T12:00:00');
    const today = toDateKey(now);
    const days = buildWeeklyActivity([today, today, '2026-07-30'], now);
    expect(days).toHaveLength(7);
    expect(days.at(-1)?.date).toBe(today);
    expect(days.at(-1)?.questionCount).toBe(2);
  });
});
