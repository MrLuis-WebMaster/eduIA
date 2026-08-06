import type { ReactNode } from 'react';

import { AppCard, AppText, Stack } from '@/design-system';

type SpaceMenuGroupProps = {
  title: string;
  children: ReactNode;
};

export function SpaceMenuGroup({ title, children }: SpaceMenuGroupProps) {
  return (
    <Stack gap="sm">
      <AppText
        variant="caption"
        tone="muted"
        className="px-1 font-medium uppercase tracking-wide">
        {title}
      </AppText>
      <AppCard padding="none" className="overflow-hidden">
        {children}
      </AppCard>
    </Stack>
  );
}
