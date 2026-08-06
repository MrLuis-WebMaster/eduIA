import { View } from 'react-native';

import { AppCard, AppText, Pressable, Row, Stack, useTheme } from '@/design-system';
import { clamp } from '@/shared/utils';

export type ProgressFocusRowProps = {
  topic: string | null;
  streakDays: number;
  preferredLevelLabel: string;
  weeklyPercent: number;
  weeklyTarget: number;
  onPractice: () => void;
  onEditGoal: () => void;
};

export function ProgressFocusRow({
  topic,
  streakDays,
  preferredLevelLabel,
  weeklyPercent,
  weeklyTarget,
  onPractice,
  onEditGoal,
}: ProgressFocusRowProps) {
  return (
    <Row gap="sm" align="stretch" className="w-full">
      <ReinforceCard topic={topic} onPress={onPractice} />
      <GoalCard
        streakDays={streakDays}
        preferredLevelLabel={preferredLevelLabel}
        weeklyPercent={weeklyPercent}
        weeklyTarget={weeklyTarget}
        onEditGoal={onEditGoal}
      />
    </Row>
  );
}

function ReinforceCard({
  topic,
  onPress,
}: {
  topic: string | null;
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <AppCard
      padding="sm"
      className="min-w-0 flex-1"
      style={{ borderColor: `${colors.warning}66` }}
      accessibilityLabel="Necesitas reforzar">
      <Stack gap="sm" className="min-h-[120px] justify-between">
        <Stack gap="xs">
          <AppText variant="caption" tone="muted">
            Necesitas reforzar
          </AppText>
          <AppText variant="label" numberOfLines={2}>
            {topic ?? 'Nada pendiente'}
          </AppText>
        </Stack>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Practicar ahora"
          onPress={onPress}
          className="active:opacity-80">
          <AppText variant="caption" className="font-semibold text-primary">
            Practicar ahora →
          </AppText>
        </Pressable>
      </Stack>
    </AppCard>
  );
}

function GoalCard({
  streakDays,
  preferredLevelLabel,
  weeklyPercent,
  weeklyTarget,
  onEditGoal,
}: {
  streakDays: number;
  preferredLevelLabel: string;
  weeklyPercent: number;
  weeklyTarget: number;
  onEditGoal: () => void;
}) {
  const { colors } = useTheme();
  const goalLabel =
    streakDays >= 3
      ? `Mantén tu racha (${streakDays}d)`
      : `Alcanza nivel ${preferredLevelLabel}`;
  const fill = clamp(weeklyPercent, 0, 100);

  return (
    <AppCard
      padding="sm"
      className="min-w-0 flex-1"
      style={{ borderColor: `${colors.primary}66` }}
      accessibilityLabel="Próximo objetivo">
      <Stack gap="sm" className="min-h-[120px] justify-between">
        <Stack gap="xs">
          <AppText variant="caption" tone="muted">
            Próximo objetivo
          </AppText>
          <AppText variant="label" numberOfLines={2}>
            {goalLabel}
          </AppText>
        </Stack>
        <Stack gap="xs">
          <View className="h-2 w-full overflow-hidden rounded-full border border-border bg-background-secondary">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: `${fill}%` }}
            />
          </View>
          <AppText variant="caption" tone="muted">
            {fill}% · meta {weeklyTarget} preguntas/semana
          </AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cambiar meta"
            onPress={onEditGoal}
            className="active:opacity-80">
            <AppText variant="caption" className="font-semibold text-primary">
              Cambiar meta →
            </AppText>
          </Pressable>
        </Stack>
      </Stack>
    </AppCard>
  );
}
