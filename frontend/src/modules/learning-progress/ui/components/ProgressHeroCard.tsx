import { View } from 'react-native';
import { Sparkles } from 'lucide-react-native';

import {
  AppButton,
  AppCard,
  AppText,
  Pressable,
  Row,
  Stack,
  useTheme,
} from '@/design-system';

import { ActivityRing } from './ActivityRing';

export type ProgressHeroCardProps = {
  title: string;
  body: string;
  weeklyPercent: number;
  weeklyTitle: string;
  weeklyLabel: string;
  weeklyDetail: string;
  continueLabel: string;
  onContinue: () => void;
  onEditGoal: () => void;
};

export function ProgressHeroCard({
  title,
  body,
  weeklyPercent,
  weeklyTitle,
  weeklyLabel,
  weeklyDetail,
  onContinue,
  onEditGoal,
  continueLabel,
}: ProgressHeroCardProps) {
  const { colors } = useTheme();

  return (
    <AppCard
      padding="md"
      className="overflow-hidden bg-primary/5"
      style={{ borderColor: `${colors.primary}33` }}
      accessibilityLabel={`${title}. ${weeklyDetail}`}>
      <Stack gap="sm">
        <Row align="start" gap="md">
          <Stack gap="sm" className="min-w-0 flex-1">
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-primary/20">
              <Sparkles size={20} color={colors.primary} strokeWidth={2} />
            </View>
            <AppText variant="subtitle">{title}</AppText>
            <AppText variant="caption" tone="muted">
              {body}
            </AppText>
            <AppButton
              label={continueLabel}
              size="sm"
              className="mt-1 self-start"
              onPress={onContinue}
            />
          </Stack>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cambiar meta semanal"
            onPress={onEditGoal}
            className="active:opacity-80">
            <ActivityRing
              percent={weeklyPercent}
              title={weeklyTitle}
              caption={weeklyLabel}
            />
          </Pressable>
        </Row>
        <AppText variant="caption" tone="muted">
          {weeklyDetail}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cambiar meta semanal"
          onPress={onEditGoal}
          className="active:opacity-80">
          <AppText variant="caption" className="font-semibold text-primary">
            Cambiar meta semanal →
          </AppText>
        </Pressable>
      </Stack>
    </AppCard>
  );
}
