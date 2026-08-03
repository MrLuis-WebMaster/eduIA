import type { LucideIcon } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';
import { View } from 'react-native';

import {
  AppText,
  Pressable,
  Row,
  Stack,
  useTheme,
} from '@/design-system';

type SpaceMenuRowProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgClassName: string;
  onPress: () => void;
  danger?: boolean;
};

export function SpaceMenuRow({
  title,
  description,
  icon: Icon,
  iconColor,
  iconBgClassName,
  onPress,
  danger,
}: SpaceMenuRowProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      className="active:opacity-80">
      <Row align="center" gap="md" className="px-3 py-3">
        <View
          className={`h-10 w-10 items-center justify-center rounded-xl ${iconBgClassName}`}>
          <Icon size={18} color={iconColor} strokeWidth={2} />
        </View>
        <Stack gap="none" className="min-w-0 flex-1">
          <AppText
            variant="label"
            className={danger ? 'text-danger dark:text-danger-dark' : undefined}>
            {title}
          </AppText>
          <AppText variant="caption" tone="muted" numberOfLines={2}>
            {description}
          </AppText>
        </Stack>
        <ChevronRight size={18} color={colors.foregroundMuted} strokeWidth={2} />
      </Row>
    </Pressable>
  );
}
