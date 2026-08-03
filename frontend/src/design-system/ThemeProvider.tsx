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
      colors: colorScheme === 'dark' ? darkTheme : lightTheme,
      setPreference,
      toggleColorScheme,
    }),
    [preference, colorScheme, setPreference, toggleColorScheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View className={cn('flex-1', colorScheme === 'dark' && 'dark', className)}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
