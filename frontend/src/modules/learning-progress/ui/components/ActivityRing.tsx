import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { AppText, Stack, useTheme } from '@/design-system';

type ActivityRingProps = {
  percent: number;
  /** Short heading above the ring, e.g. "Meta semanal". */
  title?: string;
  /** Compact ratio under the ring, e.g. "13/7 preg.". */
  caption: string;
  size?: number;
};

export function ActivityRing({
  percent,
  title,
  caption,
  size = 88,
}: ActivityRingProps) {
  const { colors } = useTheme();
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <Stack align="center" gap="xs" className="max-w-[112px] shrink-0">
      {title ? (
        <AppText
          variant="caption"
          tone="muted"
          className="text-center font-medium">
          {title}
        </AppText>
      ) : null}
      <View
        style={{ width: size, height: size }}
        accessibilityLabel={`${title ?? 'Progreso'}: ${clamped}%, ${caption}`}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.border}
            strokeWidth={stroke}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.primary}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View className="absolute inset-0 items-center justify-center">
          <AppText
            variant="subtitle"
            className="text-primary dark:text-primary-dark">
            {clamped}%
          </AppText>
        </View>
      </View>
      <AppText variant="caption" tone="muted" className="text-center">
        {caption}
      </AppText>
    </Stack>
  );
}
