import { CircleCheck, Info } from 'lucide-react-native';

import {
  AppCard,
  AppText,
  Pressable,
  Row,
  Stack,
  useTheme,
} from '@/design-system';
import type { UserRole } from '@/shared/domain';

import type { ProgressSummary } from '../../domain';

export type ProgressInsightsPanelProps = {
  role: UserRole;
  recommendations: string[];
  teacherResources: ProgressSummary['teacherResources'];
  teacherActivities: ProgressSummary['teacherActivities'];
  onPressRecommendations: () => void;
};

export function ProgressInsightsPanel({
  role,
  recommendations,
  teacherResources,
  teacherActivities,
  onPressRecommendations,
}: ProgressInsightsPanelProps) {
  if (role === 'teacher') {
    return (
      <TeacherInsights
        resources={teacherResources}
        activities={teacherActivities}
      />
    );
  }

  return (
    <InsightsCard items={recommendations} onPress={onPressRecommendations} />
  );
}

function InsightsCard({
  items,
  onPress,
}: {
  items: string[];
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <AppCard accessibilityLabel="Insights de EduIA">
      <Stack gap="sm">
        <AppText variant="label">Insights de EduIA</AppText>
        {items.length === 0 ? (
          <AppText variant="caption" tone="muted">
            Sin sugerencias todavía
          </AppText>
        ) : (
          items.map((item, index) => (
            <Row key={item} align="start" gap="sm">
              {index === 0 ? (
                <CircleCheck size={16} color={colors.primary} strokeWidth={2} />
              ) : (
                <Info size={16} color={colors.foregroundMuted} strokeWidth={2} />
              )}
              <AppText variant="caption" className="min-w-0 flex-1">
                {item}
              </AppText>
            </Row>
          ))
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ver recomendaciones"
          onPress={onPress}
          className="active:opacity-80">
          <AppText variant="caption" className="font-semibold text-primary">
            Ver recomendaciones →
          </AppText>
        </Pressable>
      </Stack>
    </AppCard>
  );
}

function TeacherInsights({
  resources,
  activities,
}: {
  resources: ProgressSummary['teacherResources'];
  activities: ProgressSummary['teacherActivities'];
}) {
  const items = [...resources.slice(0, 2), ...activities.slice(0, 1)];

  return (
    <AppCard accessibilityLabel="Ideas para clase">
      <Stack gap="sm">
        <AppText variant="label">Ideas para clase</AppText>
        {items.length === 0 ? (
          <AppText variant="caption" tone="muted">
            Genera explicaciones en el Tutor para ver sugerencias.
          </AppText>
        ) : (
          items.map((item) => (
            <AppText key={item} variant="caption">
              • {item}
            </AppText>
          ))
        )}
      </Stack>
    </AppCard>
  );
}
