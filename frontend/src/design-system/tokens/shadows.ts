import { Platform, type ViewStyle } from 'react-native';

/** Soft elevation shadows — prefer subtle over multi-layer glow. */
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } satisfies ViewStyle,
  sm: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#102A43',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
    },
    android: { elevation: 1 },
    default: {},
  })!,
  md: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#102A43',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    android: { elevation: 3 },
    default: {},
  })!,
  lg: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#102A43',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
    default: {},
  })!,
} as const;

export type ShadowToken = keyof typeof shadows;
