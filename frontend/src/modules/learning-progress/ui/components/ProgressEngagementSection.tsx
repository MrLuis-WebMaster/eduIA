import { View } from 'react-native';
import { Trophy } from 'lucide-react-native';

import {
  AppCard,
  AppText,
  Pressable,
  Row,
  Stack,
  cn,
  useTheme,
} from '@/design-system';

import type { RecentProgressItem } from '../../domain';
import {
  formatRelativeDay,
  type ProgressAchievement,
} from '../progressPresentation';

export type ProgressEngagementSectionProps = {
  recentItems: RecentProgressItem[];
  achievements: ProgressAchievement[];
  subjectLabel: string | null;
  onStartRecommendation: () => void;
};

export function ProgressEngagementSection({
  recentItems,
  achievements,
  subjectLabel,
  onStartRecommendation,
}: ProgressEngagementSectionProps) {
  return (
    <>
      <RecentTimeline items={recentItems} />
      <AchievementsRow items={achievements} />
      <RecommendationCard
        subjectLabel={subjectLabel}
        onPress={onStartRecommendation}
      />
    </>
  );
}

function RecentTimeline({ items }: { items: RecentProgressItem[] }) {
  return (
    <AppCard accessibilityLabel="Actividad reciente">
      <Stack gap="sm">
        <AppText variant="label">Actividad reciente</AppText>
        {items.length === 0 ? (
          <AppText variant="caption" tone="muted">
            Sin sesiones recientes
          </AppText>
        ) : (
          items.slice(0, 5).map((item, index) => (
            <Row key={item.id} align="start" gap="md">
              <Stack align="center" gap="none" className="w-4">
                <View className="h-2.5 w-2.5 rounded-full bg-primary" />
                {index < Math.min(items.length, 5) - 1 ? (
                  <View
                    className="mt-1 w-px flex-1 bg-border"
                    style={{ minHeight: 28 }}
                  />
                ) : null}
              </Stack>
              <Stack gap="none" className="min-w-0 flex-1 pb-2">
                <Row align="center" justify="between" gap="sm">
                  <AppText
                    variant="label"
                    numberOfLines={1}
                    className="min-w-0 flex-1">
                    {item.title}
                  </AppText>
                  <AppText variant="caption" tone="muted">
                    {formatRelativeDay(item.updatedAt)}
                  </AppText>
                </Row>
                <AppText variant="caption" tone="muted" numberOfLines={1}>
                  {item.subtitle}
                </AppText>
              </Stack>
            </Row>
          ))
        )}
      </Stack>
    </AppCard>
  );
}

function AchievementsRow({ items }: { items: ProgressAchievement[] }) {
  const { colors } = useTheme();

  return (
    <AppCard accessibilityLabel="Logros">
      <Stack gap="sm">
        <Row align="center" gap="xs">
          <Trophy size={16} color={colors.primary} strokeWidth={2} />
          <AppText variant="label">Logros</AppText>
        </Row>
        <Row gap="sm" align="start" className="justify-between">
          {items.map((item) => (
            <Stack
              key={item.id}
              align="center"
              gap="xs"
              className="w-[23%] max-w-[23%]"
              accessibilityLabel={`${item.label}: ${item.unlocked ? 'desbloqueado' : `${Math.round(item.progress * 100)}%`}`}>
              <View
                className={cn(
                  'h-12 w-12 items-center justify-center rounded-2xl border',
                  item.unlocked
                    ? 'border-primary bg-primary/15'
                    : 'border-border bg-background-secondary',
                )}>
                <Trophy
                  size={18}
                  color={
                    item.unlocked ? colors.primary : colors.foregroundMuted
                  }
                  strokeWidth={2}
                />
              </View>
              <View className="h-8 w-full justify-start">
                <AppText
                  variant="caption"
                  className="text-center"
                  numberOfLines={2}>
                  {item.label}
                </AppText>
              </View>
              <View className="h-1 w-10 overflow-hidden rounded-full bg-border">
                {item.unlocked ? (
                  <View className="h-full w-full rounded-full bg-primary" />
                ) : (
                  <View
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(item.progress * 100, 6)}%` }}
                  />
                )}
              </View>
            </Stack>
          ))}
        </Row>
      </Stack>
    </AppCard>
  );
}

function RecommendationCard({
  subjectLabel,
  onPress,
}: {
  subjectLabel: string | null;
  onPress: () => void;
}) {
  return (
    <AppCard
      padding="md"
      className="border-chat-user/30 bg-chat-user/10"
      accessibilityLabel="Recomendación para ti">
      <Stack gap="sm">
        <AppText variant="label">Recomendación para ti</AppText>
        <AppText variant="caption" tone="muted">
          {subjectLabel
            ? `Practica ${subjectLabel} con una explicación o un ejemplo en el Tutor.`
            : 'Abre el Tutor y elige una materia para tu próxima sesión.'}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Comenzar ahora"
          onPress={onPress}
          className="active:opacity-80">
          <AppText variant="caption" className="font-semibold text-primary">
            Comenzar ahora →
          </AppText>
        </Pressable>
      </Stack>
    </AppCard>
  );
}
