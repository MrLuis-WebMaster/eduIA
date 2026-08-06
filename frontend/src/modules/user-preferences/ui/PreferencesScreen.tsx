import { useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import {
  BookOpen,
  ChartColumn,
  Clock3,
  GraduationCap,
  MessageSquareText,
  Moon,
  Palette,
  Pencil,
  RotateCcw,
  SlidersHorizontal,
  UserRound,
} from 'lucide-react-native';

import {
  AppAvatar,
  AppCard,
  AppDivider,
  AppScreen,
  AppSpinner,
  AppText,
  Pressable,
  Row,
  Stack,
  useTheme,
} from '@/design-system';
import { initialsFromName } from '@/shared/utils';
import {
  DIFFICULTY_LABELS,
  ROLE_LABELS,
  SUBJECT_LABELS,
} from '@/shared/domain/tutor-profile';

import { THEME_LABELS } from '../domain/constants';
import { AppearanceSheet, THEME_STATUS } from './components/AppearanceSheet';
import { ConversationsSheet } from './components/ConversationsSheet';
import { PreferenceStatCard } from './components/PreferenceStatCard';
import { ProfileSheet } from './components/ProfileSheet';
import { SpaceMenuGroup } from './components/SpaceMenuGroup';
import { SpaceMenuRow } from './components/SpaceMenuRow';
import { TutorPreferencesSheet } from './components/TutorPreferencesSheet';
import { usePreferences } from './hooks/usePreferences';

type SheetId = 'profile' | 'tutor' | 'appearance' | 'conversations' | null;

export function PreferencesScreen() {
  const { colors } = useTheme();
  const {
    prefs,
    hydrated,
    saving,
    resetting,
    clearingHistory,
    save,
    reset,
    clearHistory,
  } = usePreferences();

  const [sheet, setSheet] = useState<SheetId>(null);

  const openSheet = (id: Exclude<SheetId, null>) => {
    setSheet(id);
  };

  const closeSheet = () => {
    setSheet(null);
  };

  const initials = useMemo(
    () => initialsFromName(prefs.displayName, 'E'),
    [prefs.displayName],
  );

  const roleLabel = ROLE_LABELS[prefs.role];
  const levelLabel = DIFFICULTY_LABELS[prefs.preferredLevel];
  const themeLabel = THEME_LABELS[prefs.theme];
  const subjectsLabel = prefs.favoriteSubjects.map((subject) => SUBJECT_LABELS[subject]).join(', ') || 'Sin elegir';

  const displayName = prefs.displayName.trim() || 'Tu espacio';
  const ageLabel = prefs.age ? `${prefs.age} años` : '';

  if (!hydrated) {
    return (
      <AppScreen padded={false}>
        <AppSpinner fill label="Cargando tu espacio…" />
      </AppScreen>
    );
  }

  return (
    <AppScreen scroll accessibilityLabel="Mi espacio">
      <AppText variant="title" className="mb-1">
        Mi espacio
      </AppText>

      <AppCard padding="md" className="overflow-hidden">
        <Row align="center" gap="md">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Editar perfil"
            onPress={() => openSheet('profile')}
            className="relative">
            <AppAvatar
              size="xl"
              tone="primary"
              initials={initials}
              accessibilityLabel={displayName}
            />
            <View className="absolute -bottom-0.5 -right-0.5 h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-primary">
              <Pencil size={12} color={colors.primaryForeground} strokeWidth={2.5} />
            </View>
          </Pressable>

          <Stack gap="xs" className="min-w-0 flex-1">
            <AppText variant="subtitle" numberOfLines={1}>
              {displayName} ({ageLabel})
            </AppText>
            <Row
              align="center"
              gap="xs"
              className="self-start rounded-full bg-primary/15 px-2.5 py-1">
              <GraduationCap size={12} color={colors.primary} strokeWidth={2} />
              <AppText
                variant="caption"
                className="font-medium text-primary">
                {roleLabel}
              </AppText>
            </Row>
            <AppText variant="caption" tone="muted">
              Personaliza tu experiencia y la forma en que EduIA te ayuda.
            </AppText>
          </Stack>
        </Row>
      </AppCard>

      <Row gap="sm" wrap>
        <PreferenceStatCard
          icon={ChartColumn}
          label="Nivel preferido"
          value={levelLabel}
        />
        <PreferenceStatCard
          icon={BookOpen}
          label="Materias favoritas"
          value={subjectsLabel}
        />
        <PreferenceStatCard icon={Moon} label="Tema actual" value={themeLabel} />
        <PreferenceStatCard
          icon={Clock3}
          label="Última sincronización"
          value="Hace unos segundos"
        />
      </Row>

      <SpaceMenuGroup title="Personalización">
        <SpaceMenuRow
          title="Perfil"
          description="Nombre, rol y cómo te presentas"
          icon={UserRound}
          iconColor="#A78BFA"
          iconBgClassName="bg-[#A78BFA]/20"
          onPress={() => openSheet('profile')}
        />
        <AppDivider />
        <SpaceMenuRow
          title="Preferencias del tutor"
          description="Nivel, materias y estilo de explicación"
          icon={SlidersHorizontal}
          iconColor={colors.primary}
          iconBgClassName="bg-primary/15"
          onPress={() => openSheet('tutor')}
        />
        <AppDivider />
        <SpaceMenuRow
          title="Apariencia"
          description="Tema y aspecto visual de la app"
          icon={Palette}
          iconColor="#FB923C"
          iconBgClassName="bg-[#FB923C]/20"
          onPress={() => openSheet('appearance')}
        />
      </SpaceMenuGroup>

      <SpaceMenuGroup title="Datos">
        <SpaceMenuRow
          title="Conversaciones"
          description="Revisa o borra el historial del tutor"
          icon={MessageSquareText}
          iconColor="#60A5FA"
          iconBgClassName="bg-[#60A5FA]/20"
          onPress={() => openSheet('conversations')}
        />
        <AppDivider />
        <SpaceMenuRow
          title="Restablecer aplicación"
          description="Vuelve a las preferencias por defecto"
          icon={RotateCcw}
          iconColor={colors.danger}
          iconBgClassName="bg-danger/15"
          danger
          onPress={() => {
            Alert.alert(
              'Restablecer aplicación',
              'Se restaurarán nombre, rol, tema y preferencias del tutor. El historial de conversaciones no se borra.',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Restablecer',
                  style: 'destructive',
                  onPress: () => {
                    void reset();
                  },
                },
              ],
            );
          }}
        />
      </SpaceMenuGroup>

      {resetting ? (
        <AppText variant="caption" tone="muted">
          Restableciendo preferencias…
        </AppText>
      ) : null}

      <ProfileSheet
        visible={sheet === 'profile'}
        prefs={prefs}
        saving={saving}
        onClose={closeSheet}
        onSave={async (patch) => {
          closeSheet();
          await save(
            { ...prefs, ...patch },
            { statusMessage: 'Guardado — Se aplicaron los cambios' },
          );
        }}
      />

      <TutorPreferencesSheet
        visible={sheet === 'tutor'}
        prefs={prefs}
        saving={saving}
        onClose={closeSheet}
        onSave={async (patch) => {
          closeSheet();
          await save(
            { ...prefs, ...patch },
            { statusMessage: 'Guardado — Preferencias actualizadas' },
          );
        }}
      />

      <AppearanceSheet
        visible={sheet === 'appearance'}
        prefs={prefs}
        saving={saving}
        onClose={closeSheet}
        onSave={async (theme) => {
          closeSheet();
          await save(
            { ...prefs, theme },
            { statusMessage: THEME_STATUS[theme] },
          );
        }}
      />

      <ConversationsSheet
        visible={sheet === 'conversations'}
        clearingHistory={clearingHistory}
        onClose={closeSheet}
        onClearHistory={async () => {
          closeSheet();
          await clearHistory();
        }}
      />
    </AppScreen>
  );
}
