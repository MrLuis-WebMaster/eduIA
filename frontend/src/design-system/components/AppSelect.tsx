import { useState } from 'react';
import { View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { Stack } from '../primitives/Stack';
import { cn } from '../utils/cn';
import { useTheme } from '../ThemeProvider';
import { AppBottomSheet } from './AppBottomSheet';
import { AppSelectableOption } from './AppSelectableOption';
import { AppText } from './AppText';

export type AppSelectOption<T extends string = string> = {
  value: T;
  label: string;
  description?: string;
  icon?: LucideIcon;
};

export type AppSelectProps<T extends string = string> = {
  label: string;
  value: T;
  options: AppSelectOption<T>[];
  onChange: (value: T) => void;
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
  accessibilityLabel?: string;
};

export function AppSelect<T extends string = string>({
  label,
  value,
  options,
  onChange,
  icon: Icon,
  disabled,
  className,
  accessibilityLabel,
}: AppSelectProps<T>) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const display = selected?.label ?? value;

  return (
    <>
      <View className={cn('min-w-0 flex-1 gap-1', className)}>
        <AppText variant="caption" tone="muted" className="px-0.5">
          {label}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel ?? `${label}: ${display}`}
          accessibilityState={{ disabled: Boolean(disabled), expanded: open }}
          disabled={Boolean(disabled)}
          onPress={() => setOpen(true)}
          className={cn(
            'h-10 flex-row items-center gap-1 rounded-xl border border-border bg-surface px-2 py-0 dark:border-border-dark dark:bg-surface-dark',
            disabled && 'opacity-50',
          )}>
          {Icon ? (
            <Icon size={13} color={colors.primary} strokeWidth={2} />
          ) : null}
          <Text
            className="min-w-0 flex-1 text-xs font-medium text-foreground dark:text-foreground-dark"
            numberOfLines={1}>
            {display}
          </Text>
          <ChevronDown size={13} color={colors.foregroundMuted} strokeWidth={2} />
        </Pressable>
      </View>

      <AppBottomSheet
        visible={open}
        title={label}
        onClose={() => setOpen(false)}
        maxHeightClassName="max-h-[75%]"
        accessibilityLabel={`Seleccionar ${label}`}>
        <Stack gap="sm">
          {options.map((option) => (
            <AppSelectableOption
              key={option.value}
              label={option.label}
              description={option.description}
              icon={option.icon}
              selected={option.value === value}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
            />
          ))}
        </Stack>
      </AppBottomSheet>
    </>
  );
}
