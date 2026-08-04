import { cva, type VariantProps } from 'class-variance-authority';

import { Pressable, type PressableProps } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { cn } from '../utils/cn';

const chipVariants = cva(
  'flex-row items-center justify-center rounded-full border px-3 py-1.5',
  {
    variants: {
      selected: {
        true: 'border-primary bg-primary-muted',
        false:
          'border-border bg-surface',
      },
      disabled: {
        true: 'opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      selected: false,
      disabled: false,
    },
  },
);

const chipLabelVariants = cva('text-sm font-medium', {
  variants: {
    selected: {
      true: 'text-primary',
      false: 'text-foreground',
    },
  },
  defaultVariants: {
    selected: false,
  },
});

export type AppChipProps = Omit<PressableProps, 'children' | 'disabled'> &
  VariantProps<typeof chipVariants> & {
    label: string;
    className?: string;
  };

export function AppChip({
  label,
  selected,
  disabled,
  className,
  ...props
}: AppChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: Boolean(selected), disabled: Boolean(disabled) }}
      disabled={Boolean(disabled)}
      className={cn(chipVariants({ selected, disabled }), className)}
      {...props}
      accessibilityLabel={props.accessibilityLabel ?? label}>
      <Text className={chipLabelVariants({ selected })}>{label}</Text>
    </Pressable>
  );
}
