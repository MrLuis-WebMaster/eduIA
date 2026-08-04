import { View } from 'react-native';
import { Check } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { Pressable } from '../primitives/Pressable';
import { Row } from '../primitives/Row';
import { Stack } from '../primitives/Stack';
import { cn } from '../utils/cn';
import { useTheme } from '../ThemeProvider';
import { AppText } from './AppText';

export type AppSelectableOptionProps = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  icon?: LucideIcon;
  /** Hide the radio/check indicator on the right (e.g. action lists). */
  hideIndicator?: boolean;
  className?: string;
  accessibilityLabel?: string;
};

/**
 * Selectable option card for sheets and filters.
 * Matches EduIA selector UX: icon + label/description + radio check.
 */
export function AppSelectableOption({
  label,
  description,
  selected,
  onPress,
  disabled,
  icon: Icon,
  hideIndicator = false,
  className,
  accessibilityLabel,
}: AppSelectableOptionProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: Boolean(disabled) }}
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={Boolean(disabled)}
      onPress={onPress}
      className={cn(
        'rounded-2xl border px-4 py-3.5 active:opacity-80',
        selected
          ? 'border-primary bg-transparent'
          : 'border-border bg-transparent',
        disabled && 'opacity-50',
        className,
      )}>
      <Row align="center" justify="between" gap="md">
        <Row align="center" gap="md" className="min-w-0 flex-1">
          {Icon ? (
            selected ? (
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <Icon size={20} color={colors.primary} strokeWidth={2} />
              </View>
            ) : (
              <View className="h-10 w-10 items-center justify-center">
                <Icon size={22} color={colors.foreground} strokeWidth={1.75} />
              </View>
            )
          ) : null}

          <Stack gap="none" className="min-w-0 flex-1">
            <AppText
              variant="label"
              className={cn(
                'text-[16px] font-semibold',
                selected
                  ? 'text-primary'
                  : 'text-foreground',
              )}>
              {label}
            </AppText>
            {description ? (
              <AppText
                variant="caption"
                tone="muted"
                numberOfLines={2}
                className="mt-0.5 text-[13px] leading-5">
                {description}
              </AppText>
            ) : null}
          </Stack>
        </Row>

        {hideIndicator ? null : selected ? (
          <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
            <Check
              size={14}
              color={colors.primaryForeground}
              strokeWidth={2.75}
            />
          </View>
        ) : (
          <View className="h-6 w-6 rounded-full border-[1.5px] border-border" />
        )}
      </Row>
    </Pressable>
  );
}
