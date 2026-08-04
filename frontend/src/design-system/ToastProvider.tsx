import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemeSurface } from './ThemeProvider';
import { AppToast, type AppToastTone } from './components/AppToast';

const DEFAULT_DURATION_MS = 3200;
const ENTER_MS = 220;
const EXIT_MS = 180;

export type ShowToastOptions = {
  message: string;
  tone?: AppToastTone;
  /** Auto-dismiss delay. Pass `0` to keep until dismissed. */
  durationMs?: number;
};

type ToastState = {
  id: number;
  message: string;
  tone: AppToastTone;
  durationMs: number;
};

type ToastContextValue = {
  show: (options: ShowToastOptions | string) => void;
  success: (message: string, durationMs?: number) => void;
  error: (message: string, durationMs?: number) => void;
  warning: (message: string, durationMs?: number) => void;
  dismiss: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [hostOpen, setHostOpen] = useState(false);
  const idRef = useRef(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progress = useSharedValue(0);
  const dismissRef = useRef<() => void>(() => undefined);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const finishHide = useCallback(() => {
    setHostOpen(false);
    setToast(null);
    progress.value = 0;
  }, [progress]);

  const dismiss = useCallback(() => {
    clearHideTimer();
    progress.value = withTiming(0, { duration: EXIT_MS }, (finished) => {
      if (finished) {
        runOnJS(finishHide)();
      }
    });
  }, [clearHideTimer, finishHide, progress]);

  dismissRef.current = dismiss;

  const show = useCallback(
    (options: ShowToastOptions | string) => {
      const next: ShowToastOptions =
        typeof options === 'string' ? { message: options } : options;
      const message = next.message.trim();
      if (!message) return;

      clearHideTimer();
      idRef.current += 1;
      const id = idRef.current;
      const durationMs = next.durationMs ?? DEFAULT_DURATION_MS;

      setToast({
        id,
        message,
        tone: next.tone ?? 'success',
        durationMs,
      });
      setHostOpen(true);
      progress.value = 0;
      progress.value = withTiming(1, { duration: ENTER_MS });

      if (durationMs > 0) {
        hideTimerRef.current = setTimeout(() => {
          if (idRef.current === id) {
            dismissRef.current();
          }
        }, durationMs);
      }
    },
    [clearHideTimer, progress],
  );

  useEffect(() => () => clearHideTimer(), [clearHideTimer]);

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (message, durationMs) =>
        show({ message, tone: 'success', durationMs }),
      error: (message, durationMs) =>
        show({ message, tone: 'danger', durationMs }),
      warning: (message, durationMs) =>
        show({ message, tone: 'warning', durationMs }),
      dismiss,
    }),
    [dismiss, show],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastHost
        toast={toast}
        open={hostOpen}
        progress={progress}
        onDismiss={dismiss}
      />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}

function ToastHost({
  toast,
  open,
  progress,
  onDismiss,
}: {
  toast: ToastState | null;
  open: boolean;
  progress: SharedValue<number>;
  onDismiss: () => void;
}) {
  const insets = useSafeAreaInsets();
  const topOffset = Math.max(insets.top, 12) + 8;
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        translateY: (1 - progress.value) * -16,
      },
    ],
  }));

  // Dedicated Modal so toasts stack above AppBottomSheet (also a Modal).
  // ThemeSurface re-applies CSS vars — RN Modal roots do not inherit them.
  return (
    <Modal
      transparent
      visible={open && toast != null}
      animationType="none"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={onDismiss}>
      <ThemeSurface className="justify-start">
        <View pointerEvents="box-none" style={styles.host}>
          {toast ? (
            <Animated.View
              pointerEvents="box-none"
              style={[
                styles.toastAnchor,
                { top: topOffset },
                animatedStyle,
              ]}>
              <AppToast
                key={toast.id}
                message={toast.message}
                tone={toast.tone}
                onDismiss={onDismiss}
              />
            </Animated.View>
          ) : null}
        </View>
      </ThemeSurface>
    </Modal>
  );
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  toastAnchor: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
});
