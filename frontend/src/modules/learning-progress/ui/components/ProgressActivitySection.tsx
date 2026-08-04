import { View } from 'react-native';
import {
  Atom,
  BookOpen,
  Calculator,
  Landmark,
  Lightbulb,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { AppCard, AppText, Row, Stack, useTheme } from '@/design-system';
import type { Subject } from '@/shared/domain';

import type { WeeklyActivityDay } from '../../domain';
import type { SubjectActivityRow } from '../progressPresentation';

const SUBJECT_ICONS: Record<Subject, LucideIcon> = {
  math: Calculator,
  science: Atom,
  language: BookOpen,
  history: Landmark,
  other: Lightbulb,
};

export type ProgressActivitySectionProps = {
  subjectRows: SubjectActivityRow[];
  days: WeeklyActivityDay[];
};

export function ProgressActivitySection({
  subjectRows,
  days,
}: ProgressActivitySectionProps) {
  return (
    <Stack gap="sm">
      <SubjectActivityCard rows={subjectRows} />
      <WeeklyHeatmap days={days} />
    </Stack>
  );
}

function SubjectActivityCard({ rows }: { rows: SubjectActivityRow[] }) {
  const { colors } = useTheme();

  return (
    <AppCard accessibilityLabel="Actividad por materia">
      <Stack gap="md">
        <AppText variant="label">Actividad por materia</AppText>
        {rows.length === 0 ? (
          <AppText variant="caption" tone="muted">
            Sin datos aún
          </AppText>
        ) : (
          rows.map((row) => {
            const Icon = SUBJECT_ICONS[row.subject as Subject] ?? Lightbulb;
            const barColor =
              row.status === 'strong'
                ? colors.primary
                : row.status === 'practice'
                  ? '#FB923C'
                  : colors.danger;

            return (
              <Stack key={row.subject} gap="xs">
                <Row align="center" justify="between" gap="sm">
                  <Row align="center" gap="sm" className="min-w-0 flex-1">
                    <Icon size={16} color={barColor} strokeWidth={2} />
                    <AppText variant="label" numberOfLines={1}>
                      {row.label}
                    </AppText>
                  </Row>
                  <AppText variant="caption" tone="muted">
                    {row.relativePct}%
                  </AppText>
                </Row>
                <View className="h-2 overflow-hidden rounded-full bg-background-secondary">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(row.relativePct, 4)}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </View>
                <AppText variant="caption" tone="muted">
                  {row.statusLabel} · {row.questionCount} preg. ·{' '}
                  {row.sessionCount} ses.
                </AppText>
              </Stack>
            );
          })
        )}
      </Stack>
    </AppCard>
  );
}

function WeeklyHeatmap({ days }: { days: WeeklyActivityDay[] }) {
  const { colors } = useTheme();
  const max = Math.max(1, ...days.map((d) => d.questionCount));

  return (
    <AppCard accessibilityLabel="Actividad semanal">
      <Stack gap="md">
        <AppText variant="label">Actividad semanal</AppText>
        <Row gap="sm" justify="between">
          {days.map((day) => {
            const intensity = day.questionCount / max;
            const opacity =
              day.questionCount === 0 ? 0.18 : 0.35 + intensity * 0.65;
            return (
              <Stack key={day.date} align="center" gap="xs" className="flex-1">
                <View
                  accessibilityLabel={`${day.label}: ${day.questionCount} preguntas`}
                  className="aspect-square w-full max-w-[36px] rounded-md"
                  style={{
                    backgroundColor: colors.primary,
                    opacity,
                  }}
                />
                <AppText variant="caption" tone="muted">
                  {day.label.charAt(0)}
                </AppText>
              </Stack>
            );
          })}
        </Row>
        <Row align="center" gap="xs">
          <AppText variant="caption" tone="muted">
            Menos
          </AppText>
          {[0.18, 0.4, 0.65, 0.9].map((opacity) => (
            <View
              key={opacity}
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: colors.primary, opacity }}
            />
          ))}
          <AppText variant="caption" tone="muted">
            Más
          </AppText>
        </Row>
      </Stack>
    </AppCard>
  );
}
