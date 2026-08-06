import type { LucideIcon } from 'lucide-react-native';

import { AppCard, AppText, Row, useTheme } from '@/design-system';

type PreferenceStatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export function PreferenceStatCard({
  icon: Icon,
  label,
  value,
}: PreferenceStatCardProps) {
  const { colors } = useTheme();

  return (
    <AppCard
      variant="muted"
      padding="sm"
      className="min-w-[46%] flex-1"
      accessibilityLabel={`${label}: ${value}`}>
      <Row align="center" gap="xs" className="mb-1.5">
        <Icon size={14} color={colors.foregroundMuted} strokeWidth={2} />
        <AppText variant="caption" tone="muted" numberOfLines={1}>
          {label}
        </AppText>
      </Row>
      <AppText variant="label" className="text-primary" numberOfLines={1}>
        {value}
      </AppText>
    </AppCard>
  );
}
