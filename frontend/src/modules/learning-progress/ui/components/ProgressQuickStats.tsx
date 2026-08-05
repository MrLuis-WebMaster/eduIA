import {
  BookOpen,
  Flame,
  MessageCircle,
  Target,
} from 'lucide-react-native';

import { AppCard, AppText, Row } from '@/design-system';

import type { ProgressSummary } from '../../domain';

export type ProgressQuickStatsProps = {
  summary: ProgressSummary;
};

export function ProgressQuickStats({ summary }: ProgressQuickStatsProps) {
  const items = [
    {
      label: 'Sesiones',
      value: String(summary.sessionCount),
      icon: BookOpen,
      color: '#A78BFA',
    },
    {
      label: 'Preguntas',
      value: String(summary.questionCount),
      icon: MessageCircle,
      color: '#60A5FA',
    },
    {
      label: 'Racha',
      value:
        summary.streakDays > 0
          ? `${summary.streakDays} día${summary.streakDays === 1 ? '' : 's'}`
          : '0',
      hint: summary.streakDays >= 2 ? '¡Sigue así!' : undefined,
      icon: Flame,
      color: '#FB923C',
    },
    {
      label: 'Nivel más usado',
      value: summary.mostUsedLevelLabel ?? '—',
      icon: Target,
      color: '#34D399',
    },
  ];

  return (
    <Row gap="sm" wrap align="stretch">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <AppCard
            key={item.label}
            padding="sm"
            className="min-w-[46%] flex-1"
            accessibilityLabel={`${item.label}: ${item.value}`}>
            <Row align="center" gap="xs" className="mb-1.5">
              <Icon size={14} color={item.color} strokeWidth={2} />
              <AppText variant="caption" tone="muted" numberOfLines={1}>
                {item.label}
              </AppText>
            </Row>
            <AppText variant="subtitle" numberOfLines={1}>
              {item.value}
            </AppText>
            {item.hint ? (
              <AppText variant="caption" className="mt-0.5 text-primary">
                {item.hint}
              </AppText>
            ) : (
              <AppText variant="caption" tone="muted" className="mt-0.5 opacity-0">
                —
              </AppText>
            )}
          </AppCard>
        );
      })}
    </Row>
  );
}
