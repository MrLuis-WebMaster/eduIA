import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme as useSystemColorScheme, View } from 'react-native';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';

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
  const { setColorScheme } = useNativeWindColorScheme();
  const [preference, setPreference] = useState<ThemePreference>(initialPreference);

  const colorScheme: ResolvedColorScheme = useMemo(() => {
    if (preference === 'system') {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return preference;
  }, [preference, systemScheme]);

  useEffect(() => {
    setColorScheme(colorScheme);
  }, [colorScheme, setColorScheme]);

  const toggleColorScheme = useCallback(() => {
    setPreference((prev) => {
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
    [preference, colorScheme, toggleColorScheme],
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
