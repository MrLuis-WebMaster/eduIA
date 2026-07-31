import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppCard,
  AppEmptyState,
  AppErrorState,
  AppSkeleton,
  AppText,
  Box,
  Row,
  Stack,
} from '@/design-system';

import type { ProgressSummary, WeeklyActivityDay } from '../domain';
import { useLearningProgress } from './hooks/useLearningProgress';

export function ProgressScreen() {
  const { role, summary, isLoading, isError, refetch } = useLearningProgress();

  if (isLoading) {
    return (
      <Box className="flex-1 bg-background dark:bg-background-dark">
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
          <Stack gap="md" className="px-4 pt-6">
            <AppSkeleton height={32} width={160} />
            <AppSkeleton height={96} width="100%" />
            <AppSkeleton height={96} width="100%" />
            <AppSkeleton height={160} width="100%" />
          </Stack>
        </SafeAreaView>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="flex-1 bg-background dark:bg-background-dark">
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
          <AppErrorState
            title="No se pudo cargar el progreso"
            message="Revisa el historial local e inténtalo de nuevo."
            retryLabel="Reintentar"
            onRetry={() => {
              void refetch();
            }}
          />
        </SafeAreaView>
      </Box>
    );
  }

  const isEmpty = summary.sessionCount === 0;

  return (
    <Box className="flex-1 bg-background dark:bg-background-dark">
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          accessibilityLabel="Progreso de aprendizaje">
          <Stack gap="md" className="px-4 pt-4">
            <Stack gap="xs">
              <AppText variant="subtitle">Progreso</AppText>
              <AppText tone="muted" variant="caption">
                {role === 'teacher'
                  ? 'Resumen local de explicaciones y recursos sugeridos.'
                  : 'Métricas derivadas de tus sesiones locales con el Tutor.'}
              </AppText>
            </Stack>

            {isEmpty ? (
              <AppEmptyState
                title="Aún no hay actividad"
                description="Habla con el Tutor para registrar sesiones, rachas y materias."
                compact
              />
            ) : (
              <>
                <MetricsGrid summary={summary} />
                <WeeklyActivityBar days={summary.weeklyActivity} />

                {role === 'teacher' ? (
                  <TeacherSections summary={summary} />
                ) : (
                  <StudentSections summary={summary} />
                )}
              </>
            )}
          </Stack>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
}

function MetricsGrid({ summary }: { summary: ProgressSummary }) {
  const items = [
    { label: 'Sesiones', value: String(summary.sessionCount) },
    { label: 'Preguntas', value: String(summary.questionCount) },
    {
      label: 'Materia top',
      value: summary.topSubjectLabel ?? '—',
    },
    {
      label: 'Nivel más usado',
      value: summary.mostUsedLevelLabel ?? '—',
    },
    {
      label: 'Racha',
      value: summary.streakDays > 0 ? `${summary.streakDays}d` : '0',
    },
  ];

  return (
    <Row gap="sm" className="flex-wrap">
      {items.map((item) => (
        <AppCard
          key={item.label}
          variant="muted"
          padding="sm"
          className="min-w-[30%] flex-1"
          accessibilityLabel={`${item.label}: ${item.value}`}>
          <AppText variant="caption" tone="muted">
            {item.label}
          </AppText>
          <AppText variant="subtitle" className="mt-1">
            {item.value}
          </AppText>
        </AppCard>
      ))}
    </Row>
  );
}

function WeeklyActivityBar({ days }: { days: WeeklyActivityDay[] }) {
  const max = Math.max(1, ...days.map((d) => d.questionCount));

  return (
    <AppCard accessibilityLabel="Actividad semanal">
      <Stack gap="sm">
        <AppText variant="label">Actividad semanal</AppText>
        <Row gap="xs" className="items-end justify-between">
          {days.map((day) => {
            const height = 8 + Math.round((day.questionCount / max) * 56);
            return (
              <Stack key={day.date} gap="xs" className="flex-1 items-center">
                <View
                  accessibilityLabel={`${day.label}: ${day.questionCount} preguntas`}
                  className="w-full rounded-md bg-primary dark:bg-primary-dark"
                  style={{ height, maxWidth: 28, opacity: day.questionCount ? 0.9 : 0.25 }}
                />
                <AppText variant="caption" tone="muted">
                  {day.label}
                </AppText>
              </Stack>
            );
          })}
        </Row>
      </Stack>
    </AppCard>
  );
}

function StudentSections({ summary }: { summary: ProgressSummary }) {
  return (
    <>
      <SectionCard title="Temas estudiados">
        <ChipList items={summary.topicsStudied} empty="Sin temas aún" />
      </SectionCard>

      <SectionCard title="Para reforzar">
        <ChipList items={summary.topicsToReinforce} empty="Todo al día" />
      </SectionCard>

      <SectionCard title="Progreso por materia">
        {summary.progressBySubject.length === 0 ? (
          <AppText tone="muted" variant="caption">
            Sin datos
          </AppText>
        ) : (
          <Stack gap="sm">
            {summary.progressBySubject.map((item) => (
              <Row
                key={item.subject}
                className="items-center justify-between"
                accessibilityLabel={`${item.label}: ${item.sessionCount} sesiones, ${item.questionCount} preguntas`}>
                <AppText>{item.label}</AppText>
                <AppText tone="muted" variant="caption">
                  {item.sessionCount} ses. · {item.questionCount} preg.
                </AppText>
              </Row>
            ))}
          </Stack>
        )}
      </SectionCard>

      <SectionCard title="Recomendaciones">
        <BulletList items={summary.recommendations} />
      </SectionCard>

      <RecentList
        title="Recientes"
        items={summary.recentItems}
        empty="Sin sesiones recientes"
      />
    </>
  );
}

function TeacherSections({ summary }: { summary: ProgressSummary }) {
  return (
    <>
      <SectionCard title="Recursos sugeridos">
        <BulletList items={summary.teacherResources} />
      </SectionCard>

      <SectionCard title="Actividades para clase">
        <BulletList items={summary.teacherActivities} />
      </SectionCard>

      <SectionCard title="Materias y niveles">
        <Stack gap="sm">
          {summary.progressBySubject.map((subject) => (
            <Row
              key={subject.subject}
              className="items-center justify-between"
              accessibilityLabel={`${subject.label}: ${subject.sessionCount} explicaciones`}>
              <AppText>{subject.label}</AppText>
              <AppText tone="muted" variant="caption">
                {subject.sessionCount} expl. · {subject.questionCount} preg.
              </AppText>
            </Row>
          ))}
          {summary.levelUsage.length > 0 ? (
            <AppText tone="muted" variant="caption">
              Niveles:{' '}
              {summary.levelUsage
                .map((l) => `${l.label} (${l.sessionCount})`)
                .join(', ')}
            </AppText>
          ) : (
            <AppText tone="muted" variant="caption">
              Sin datos
            </AppText>
          )}
        </Stack>
      </SectionCard>

      <RecentList
        title="Explicaciones recientes"
        items={summary.recentItems}
        empty="Sin explicaciones recientes"
      />
    </>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <AppCard accessibilityLabel={title}>
      <Stack gap="sm">
        <AppText variant="label">{title}</AppText>
        {children}
      </Stack>
    </AppCard>
  );
}

function ChipList({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) {
    return (
      <AppText tone="muted" variant="caption">
        {empty}
      </AppText>
    );
  }
  return (
    <Row gap="sm" className="flex-wrap">
      {items.map((item) => (
        <View
          key={item}
          className="rounded-full border border-border px-3 py-1.5 dark:border-border-dark"
          accessibilityLabel={item}>
          <AppText variant="caption">{item}</AppText>
        </View>
      ))}
    </Row>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return (
      <AppText tone="muted" variant="caption">
        Sin sugerencias
      </AppText>
    );
  }
  return (
    <Stack gap="xs">
      {items.map((item) => (
        <AppText key={item} variant="caption">
          • {item}
        </AppText>
      ))}
    </Stack>
  );
}

function RecentList({
  title,
  items,
  empty,
}: {
  title: string;
  items: ProgressSummary['recentItems'];
  empty: string;
}) {
  return (
    <SectionCard title={title}>
      {items.length === 0 ? (
        <AppText tone="muted" variant="caption">
          {empty}
        </AppText>
      ) : (
        <Stack gap="sm">
          {items.map((item) => (
            <Stack
              key={item.id}
              gap="xs"
              accessibilityLabel={`${item.title}. ${item.subtitle}`}>
              <AppText numberOfLines={2}>{item.title}</AppText>
              <AppText tone="muted" variant="caption">
                {item.subtitle}
              </AppText>
            </Stack>
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}
