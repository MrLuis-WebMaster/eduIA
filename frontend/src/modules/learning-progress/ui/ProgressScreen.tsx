import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import {
  AppEmptyState,
  AppErrorState,
  AppScreen,
  AppScreenHeading,
  AppSkeleton,
} from '@/design-system';
import { LEVEL_OPTIONS, usePreferences } from '@/modules/user-preferences';
import { firstNameFromDisplayName } from '@/shared/utils';

import { ProgressActivitySection } from './components/ProgressActivitySection';
import { ProgressEngagementSection } from './components/ProgressEngagementSection';
import { ProgressFocusRow } from './components/ProgressFocusRow';
import { ProgressHeroCard } from './components/ProgressHeroCard';
import { ProgressInsightsPanel } from './components/ProgressInsightsPanel';
import { ProgressQuickStats } from './components/ProgressQuickStats';
import { WeeklyGoalSheet } from './components/WeeklyGoalSheet';
import { useLearningProgress } from './hooks/useLearningProgress';
import {
  buildAchievements,
  buildSubjectActivityRows,
  heroCopy,
  weeklyActivityScore,
} from './progressPresentation';

export function ProgressScreen() {
  const router = useRouter();
  const {
    role,
    displayName,
    preferredLevel,
    weeklyQuestionGoal,
    summary,
    isLoading,
    isError,
    refetch,
  } = useLearningProgress();
  const { prefs, saving, save } = usePreferences();

  const [goalSheetOpen, setGoalSheetOpen] = useState(false);

  const firstName = useMemo(
    () => firstNameFromDisplayName(displayName),
    [displayName],
  );
  const weekly = useMemo(
    () => weeklyActivityScore(summary, weeklyQuestionGoal),
    [summary, weeklyQuestionGoal],
  );
  const subjectRows = useMemo(
    () => buildSubjectActivityRows(summary.progressBySubject),
    [summary.progressBySubject],
  );
  const achievements = useMemo(() => buildAchievements(summary), [summary]);
  const hero = useMemo(
    () => heroCopy(summary, firstName),
    [summary, firstName],
  );
  const preferredLevelLabel =
    LEVEL_OPTIONS.find((o) => o.value === preferredLevel)?.label ??
    preferredLevel;

  const goToTutor = () => {
    router.push('/(tabs)');
  };

  const openGoalSheet = () => {
    setGoalSheetOpen(true);
  };

  if (isLoading) {
    return (
      <AppScreen>
        <AppSkeleton height={32} width={160} />
        <AppSkeleton height={140} width="100%" />
        <AppSkeleton height={72} width="100%" />
        <AppSkeleton height={160} width="100%" />
      </AppScreen>
    );
  }

  if (isError) {
    return (
      <AppScreen padded={false}>
        <AppErrorState
          fill
          title="No se pudo cargar el progreso"
          message="Revisa el historial local e inténtalo de nuevo."
          retryLabel="Reintentar"
          onRetry={() => {
            void refetch();
          }}
        />
      </AppScreen>
    );
  }

  const isEmpty = summary.sessionCount === 0;

  return (
    <AppScreen scroll accessibilityLabel="Progreso de aprendizaje">
      <AppScreenHeading
        title="Progreso"
        description="Tu aprendizaje, resumido y pensado para ti."
      />

      <ProgressHeroCard
        title={hero.title}
        body={hero.body}
        weeklyPercent={weekly.percent}
        weeklyTitle={weekly.title}
        weeklyLabel={weekly.label}
        weeklyDetail={weekly.detail}
        onContinue={goToTutor}
        onEditGoal={openGoalSheet}
        continueLabel={
          isEmpty ? 'Empezar con el Tutor' : 'Continuar aprendiendo'
        }
      />

      {isEmpty ? (
        <AppEmptyState
          title="Aún no hay actividad"
          description="Habla con el Tutor para registrar sesiones, rachas y materias."
          compact
        />
      ) : (
        <>
          <ProgressQuickStats summary={summary} />
          <ProgressActivitySection
            subjectRows={subjectRows}
            days={summary.weeklyActivity}
          />
          <ProgressFocusRow
            topic={summary.topicsToReinforce[0] ?? null}
            streakDays={summary.streakDays}
            preferredLevelLabel={preferredLevelLabel}
            weeklyPercent={weekly.percent}
            weeklyTarget={weekly.target}
            onPractice={goToTutor}
            onEditGoal={openGoalSheet}
          />
          <ProgressInsightsPanel
            role={role}
            recommendations={summary.recommendations}
            teacherResources={summary.teacherResources}
            teacherActivities={summary.teacherActivities}
            onPressRecommendations={goToTutor}
          />
          <ProgressEngagementSection
            recentItems={summary.recentItems}
            achievements={achievements}
            subjectLabel={
              summary.topicsToReinforce[0] ?? summary.topSubjectLabel
            }
            onStartRecommendation={goToTutor}
          />
        </>
      )}

      <WeeklyGoalSheet
        visible={goalSheetOpen}
        currentGoal={weeklyQuestionGoal}
        saving={saving}
        onClose={() => {
          setGoalSheetOpen(false);
        }}
        onSave={async (goal) => {
          setGoalSheetOpen(false);
          await save(
            { ...prefs, weeklyQuestionGoal: goal },
            { statusMessage: `Guardado — Meta de ${goal} preguntas/semana` },
          );
        }}
      />
    </AppScreen>
  );
}
