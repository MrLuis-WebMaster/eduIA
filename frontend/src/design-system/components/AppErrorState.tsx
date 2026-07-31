import { View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

import { AppButton } from './AppButton';
import { AppText } from './AppText';
import { cn } from '../utils/cn';

const errorVariants = cva('items-center justify-center gap-3 px-6 py-10', {
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

export type AppErrorStateProps = VariantProps<typeof errorVariants> & {
  title?: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
};

export function AppErrorState({
  title = 'Algo salió mal',
  message,
  retryLabel = 'Reintentar',
  onRetry,
  compact,
  className,
}: AppErrorStateProps) {
  return (
    <View className={cn(errorVariants({ compact }), className)}>
      <AppText variant="subtitle" tone="danger" align="center">
        {title}
      </AppText>
      <AppText tone="muted" align="center">
        {message}
      </AppText>
      {onRetry ? (
        <AppButton
          label={retryLabel}
          variant="outline"
          onPress={onRetry}
          className="mt-2"
        />
      ) : null}
    </View>
  );
}
