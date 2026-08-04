import { useMemo, type ReactNode } from 'react';

import {
  DependenciesContext,
  getDependencies,
  type AppDependencies,
} from './app-dependencies';

type DependenciesProviderProps = {
  children: ReactNode;
  /** Optional override for tests. */
  value?: AppDependencies;
};

export function DependenciesProvider({
  children,
  value,
}: DependenciesProviderProps) {
  const deps = useMemo(() => value ?? getDependencies(), [value]);
  return (
    <DependenciesContext.Provider value={deps}>
      {children}
    </DependenciesContext.Provider>
  );
}
