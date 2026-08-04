import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme as useSystemColorScheme, View } from 'react-native';

import { darkTheme, lightTheme, type ThemeColors } from './themes';
import { themeVars } from './themeVars';
import { cn } from './utils/cn';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedColorScheme = 'light' | 'dark';

type ThemeContextValue = {
  preference: ThemePreference;
  colorScheme: ResolvedColorScheme;
  colors: ThemeColors;
  setPreference: (preference: ThemePreference) => void;
  toggleColorScheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export type ThemeProviderProps = {
  children: ReactNode;
  initialPreference?: ThemePreference;
  className?: string;
};

export function ThemeProvider({
  children,
  initialPreference = 'system',
  className,
}: ThemeProviderProps) {
  const systemScheme = useSystemColorScheme();
  const [preference, setPreferenceState] =
    useState<ThemePreference>(initialPreference);

  const colorScheme: ResolvedColorScheme = useMemo(() => {
    if (preference === 'system') {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return preference;
  }, [preference, systemScheme]);

  const colors = colorScheme === 'dark' ? darkTheme : lightTheme;

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState((prev) => (prev === next ? prev : next));
  }, []);

  const toggleColorScheme = useCallback(() => {
    setPreferenceState((prev) => {
      const current =
        prev === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : prev;
      return current === 'dark' ? 'light' : 'dark';
    });
  }, [systemScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      colorScheme,
      colors,
      setPreference,
      toggleColorScheme,
    }),
    [preference, colorScheme, colors, setPreference, toggleColorScheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View
        style={themeVars(colors)}
        className={cn('flex-1', className)}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export type ThemeSurfaceProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Re-applies theme CSS variables. Required inside RN Modal roots, which do not
 * inherit the ThemeProvider view tree / vars.
 */
export function ThemeSurface({ children, className }: ThemeSurfaceProps) {
  const { colors } = useTheme();
  return (
    <View style={themeVars(colors)} className={cn('flex-1', className)}>
      {children}
    </View>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
