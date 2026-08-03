import { View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

import { AppButton } from './AppButton';
import { AppText } from './AppText';
import { layout } from '../tokens/layout';
import { cn } from '../utils/cn';

const errorVariants = cva('w-full', {
  variants: {
    compact: {
      true: 'py-4',
      false: 'py-6',
    },
    fill: {
      true: 'min-h-0 flex-1',
      false: '',
    },
    placement: {
      center: 'justify-center',
      start: 'justify-start pt-2',
    },
    align: {
      center: 'items-center',
      start: 'items-start',
    },
  },
  defaultVariants: {
    compact: false,
    fill: false,
    placement: 'center',
    align: 'center',
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
  fill,
  placement = 'center',
  align = 'center',
  className,
}: AppErrorStateProps) {
  const isStart = align === 'start';

  return (
    <View
      className={cn(
        errorVariants({ compact, fill, placement, align }),
        fill && layout.gutterClassName,
        className,
      )}>
      <View
        className={cn(
          'w-full gap-2',
          isStart ? 'items-start' : 'max-w-[280px] items-center',
        )}>
        <AppText
          variant="subtitle"
          tone="danger"
          align={isStart ? 'left' : 'center'}
          className="w-full">
          {title}
        </AppText>
        <AppText
          tone="muted"
          align={isStart ? 'left' : 'center'}
          variant="body"
          className="w-full text-[15px] leading-5">
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
    </View>
  );
}
