import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';

type KeyboardSpacerProps = {
  /** When false, spacer collapses to 0 but the hook stays mounted safely. */
  enabled?: boolean;
};

/**
 * Pushes siblings above the IME using Reanimated keyboard metrics.
 * Works in Expo Go (no extra native module). Height comes from the device IME —
 * no hardcoded offsets.
 *
 * Edge-to-edge Android: translucent status/nav so height matches the real frame.
 */
export function KeyboardSpacer({ enabled = true }: KeyboardSpacerProps) {
  const keyboard = useAnimatedKeyboard({
    isStatusBarTranslucentAndroid: true,
    isNavigationBarTranslucentAndroid: true,
  });

  const style = useAnimatedStyle(() => ({
    height: enabled ? Math.max(keyboard.height.value, 0) : 0,
  }));

  return <Animated.View style={style} />;
}
