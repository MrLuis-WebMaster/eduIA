import { TextInput, type TextInputProps, View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

import { Text } from '../primitives/Text';
import { cn } from '../utils/cn';

const areaVariants = cva(
  'min-h-[96px] rounded-lg border px-3 py-2.5 text-base text-foreground dark:text-foreground-dark',
  {
    variants: {
      invalid: {
        true: 'border-danger dark:border-danger-dark',
        false: 'border-border dark:border-border-dark',
      },
      disabled: {
        true: 'opacity-50 bg-background-secondary dark:bg-background-dark-secondary',
        false: 'bg-surface dark:bg-surface-dark',
      },
    },
    defaultVariants: {
      invalid: false,
      disabled: false,
    },
  },
);

export type AppTextAreaProps = TextInputProps &
  VariantProps<typeof areaVariants> & {
    label?: string;
    error?: string;
    hint?: string;
    className?: string;
    containerClassName?: string;
  };

export function AppTextArea({
  label,
  error,
  hint,
  invalid,
  disabled,
  className,
  containerClassName,
  editable,
  ...props
}: AppTextAreaProps) {
  const isDisabled = disabled || editable === false;
  const isInvalid = Boolean(invalid || error);

  return (
    <View className={cn('gap-1.5', containerClassName)}>
      {label ? (
        <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">
          {label}
        </Text>
      ) : null}
      <TextInput
        multiline
        textAlignVertical="top"
        editable={!isDisabled}
        placeholderTextColor="#829AB1"
        className={cn(
          areaVariants({ invalid: isInvalid, disabled: isDisabled }),
          className,
        )}
        {...props}
      />
      {error ? (
        <Text className="text-xs text-danger dark:text-danger-dark">{error}</Text>
      ) : hint ? (
        <Text className="text-xs text-foreground-muted dark:text-foreground-dark-muted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
