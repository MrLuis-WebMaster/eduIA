import { View } from 'react-native';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { cn } from '../utils/cn';
import { useTheme } from '../ThemeProvider';
import { Pressable } from '../primitives';
import { AppText } from './AppText';

export type AppToastTone = 'success' | 'danger' | 'warning' | 'default';

export type AppToastProps = {
  message: string;
  tone?: AppToastTone;
  onDismiss?: () => void;
  className?: string;
};

const TONE_SURFACE: Record<AppToastTone, string> = {
  success:
    'border-success/40 bg-surface dark:border-success-dark/40 dark:bg-surface-dark',
  danger:
    'border-danger/40 bg-surface dark:border-danger-dark/40 dark:bg-surface-dark',
  warning:
    'border-warning/40 bg-surface dark:border-warning-dark/40 dark:bg-surface-dark',
  default:
    'border-border bg-surface dark:border-border-dark dark:bg-surface-dark',
};

const TONE_TEXT: Record<
  AppToastTone,
  'success' | 'danger' | 'warning' | 'default'
> = {
  success: 'success',
  danger: 'danger',
  warning: 'warning',
  default: 'default',
};

const TONE_ICON: Record<AppToastTone, LucideIcon> = {
  success: CheckCircle2,
  danger: AlertCircle,
  warning: AlertTriangle,
  default: Info,
};

/**
 * Presentational toast banner — visual language aligned with AppSheetStatus.
 */
export function AppToast({
  message,
  tone = 'success',
  onDismiss,
  className,
}: AppToastProps) {
  const { colors } = useTheme();
  const Icon = TONE_ICON[tone];
  const iconColor =
    tone === 'success'
      ? colors.success
      : tone === 'danger'
        ? colors.danger
        : tone === 'warning'
          ? colors.warning
          : colors.foregroundMuted;

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      className={cn(
        'flex-row items-start gap-3 rounded-2xl border px-3.5 py-3.5 shadow-lg elevation-6',
        TONE_SURFACE[tone],
        className,
      )}>
      <View className="mt-0.5">
        <Icon size={18} color={iconColor} strokeWidth={2.25} />
      </View>
      <AppText
        variant="caption"
        tone={TONE_TEXT[tone]}
        className="min-w-0 flex-1 font-medium leading-5">
        {message}
      </AppText>
      {onDismiss ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar aviso"
          hitSlop={8}
          onPress={onDismiss}
          className="mt-0.5">
          <X size={16} color={colors.foregroundMuted} strokeWidth={2} />
        </Pressable>
      ) : null}
    </View>
  );
}
