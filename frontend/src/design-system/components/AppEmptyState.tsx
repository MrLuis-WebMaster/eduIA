import { View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

import { AppButton } from './AppButton';
import { AppText } from './AppText';
import { cn } from '../utils/cn';

const emptyVariants = cva('items-center justify-center gap-3 px-6 py-10', {
  variants: {
    compact: {
      true: 'py-6',
      false: 'py-10',
    },
  },
  defaultVariants: {
    compact: false,
  },
});

export type AppEmptyStateProps = VariantProps<typeof emptyVariants> & {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function AppEmptyState({
  title,
  description,
  actionLabel,
  onAction,
  compact,
  className,
}: AppEmptyStateProps) {
  return (
    <View className={cn(emptyVariants({ compact }), className)}>
      <AppText variant="subtitle" align="center">
        {title}
      </AppText>
      {description ? (
        <AppText tone="muted" align="center">
          {description}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <AppButton label={actionLabel} onPress={onAction} className="mt-2" />
      ) : null}
    </View>
  );
}
