import { View, type ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../utils/cn';

const cardVariants = cva('rounded-xl border', {
  variants: {
    variant: {
      elevated:
        'border-border bg-surface',
      outlined:
        'border-border-strong bg-transparent',
      muted:
        'border-transparent bg-background-secondary',
    },
    padding: {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    variant: 'elevated',
    padding: 'md',
  },
});

export type AppCardProps = ViewProps &
  VariantProps<typeof cardVariants> & {
    className?: string;
  };

export function AppCard({ className, variant, padding, ...props }: AppCardProps) {
  return (
    <View className={cn(cardVariants({ variant, padding }), className)} {...props} />
  );
}
