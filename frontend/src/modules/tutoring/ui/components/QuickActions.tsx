import { ScrollView } from 'react-native';

import { AppChip, AppText, Row, Stack } from '@/design-system';

import { QUICK_ACTIONS, type UserRole } from '../../domain';

type QuickActionsProps = {
  role: UserRole;
  onSelect: (prompt: string) => void;
  disabled?: boolean;
};

export function QuickActions({ role, onSelect, disabled }: QuickActionsProps) {
  const actions = QUICK_ACTIONS[role];

  return (
    <Stack gap="xs" className="px-4">
      <AppText variant="label" tone="muted">
        Acciones rápidas
      </AppText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Row gap="sm" className="pr-4">
          {actions.map((action) => (
            <AppChip
              key={action}
              label={action}
              disabled={disabled}
              onPress={() => onSelect(action)}
            />
          ))}
        </Row>
      </ScrollView>
    </Stack>
  );
}
