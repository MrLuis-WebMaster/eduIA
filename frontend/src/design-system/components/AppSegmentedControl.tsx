import { View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { cn } from '../utils/cn';

const segmentVariants = cva('flex-1 items-center justify-center rounded-md px-2 py-2', {
  variants: {
    active: {
      true: 'bg-surface dark:bg-surface-dark-elevated',
      false: 'bg-transparent',
    },
  },
  defaultVariants: {
    active: false,
  },
});

export type SegmentOption<T extends string = string> = {
  value: T;
  label: string;
};

export type AppSegmentedControlProps<T extends string = string> =
  VariantProps<typeof segmentVariants> & {
    options: SegmentOption<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
    disabled?: boolean;
  };

export function AppSegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  className,
  disabled = false,
}: AppSegmentedControlProps<T>) {
  return (
    <View
      className={cn(
        'flex-row rounded-lg bg-background-secondary p-1 dark:bg-background-dark-secondary',
        disabled && 'opacity-50',
        className,
      )}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: active, disabled }}
            disabled={disabled}
            onPress={() => onChange(option.value)}
            className={segmentVariants({ active })}>
            <Text
              className={cn(
                'text-sm font-medium',
                active
                  ? 'text-foreground dark:text-foreground-dark'
                  : 'text-foreground-muted dark:text-foreground-dark-muted',
              )}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
