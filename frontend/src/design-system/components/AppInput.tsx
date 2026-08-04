import { TextInput, type TextInputProps, View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

import { Text } from '../primitives/Text';
import { cn } from '../utils/cn';

const fieldVariants = cva(
  'rounded-lg border px-3 py-2.5 text-base text-foreground',
  {
    variants: {
      invalid: {
        true: 'border-danger',
        false: 'border-border',
      },
      disabled: {
        true: 'opacity-50 bg-background-secondary',
        false: 'bg-surface',
      },
    },
    defaultVariants: {
      invalid: false,
      disabled: false,
    },
  },
);

export type AppInputProps = TextInputProps &
  VariantProps<typeof fieldVariants> & {
    label?: string;
    error?: string;
    hint?: string;
    className?: string;
    containerClassName?: string;
  };

export function AppInput({
  label,
  error,
  hint,
  invalid,
  disabled,
  className,
  containerClassName,
  editable,
  ...props
}: AppInputProps) {
  const isDisabled = disabled || editable === false;
  const isInvalid = Boolean(invalid || error);

  return (
    <View className={cn('gap-1.5', containerClassName)}>
      {label ? (
        <Text className="text-sm font-medium text-foreground">
          {label}
        </Text>
      ) : null}
      <TextInput
        editable={!isDisabled}
        placeholderTextColor="#829AB1"
        accessibilityLabel={props.accessibilityLabel ?? label}
        className={cn(
          fieldVariants({ invalid: isInvalid, disabled: isDisabled }),
          className,
        )}
        {...props}
      />
      {error ? (
        <Text className="text-xs text-danger">{error}</Text>
      ) : hint ? (
        <Text className="text-xs text-foreground-muted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
