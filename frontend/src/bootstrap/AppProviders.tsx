import { useState, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, ToastProvider, useTheme, type ThemePreference } from '@/design-system';
import { PreferencesHydrator } from '@/modules/user-preferences';

import { DependenciesProvider } from './DependenciesProvider';
import { createQueryClient } from './query-client';

type AppProvidersProps = {
  children: ReactNode;
  initialThemePreference?: ThemePreference;
};

function StatusBarFromTheme() {
  const { colorScheme } = useTheme();
  return <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />;
}

export function AppProviders({
  children,
  initialThemePreference = 'system',
}: AppProvidersProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <SafeAreaProvider>
      <DependenciesProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider initialPreference={initialThemePreference}>
            <ToastProvider>
              <PreferencesHydrator />
              <StatusBarFromTheme />
              {children}
            </ToastProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </DependenciesProvider>
    </SafeAreaProvider>
  );
}
