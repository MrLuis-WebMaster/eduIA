import { useMemo, useState, type ReactNode } from 'react';
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
  AppScreen,
  AppSpinner,
  AppText,
  Pressable,
  Row,
  Stack,
  useTheme,
} from '@/design-system';

import { LEVEL_OPTIONS, ROLE_OPTIONS, THEME_OPTIONS } from '../domain';
import { AppearanceSheet, THEME_STATUS } from './components/AppearanceSheet';
import { ConversationsSheet } from './components/ConversationsSheet';
import { ProfileSheet } from './components/ProfileSheet';
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
    () => initialsFromName(prefs.displayName),
    [prefs.displayName],
  );

  const roleLabel =
    ROLE_OPTIONS.find((o) => o.value === prefs.role)?.label ?? prefs.role;
  const levelLabel =
    LEVEL_OPTIONS.find((o) => o.value === prefs.preferredLevel)?.label ??
    prefs.preferredLevel;
  const themeLabel =
    THEME_OPTIONS.find((o) => o.value === prefs.theme)?.label ?? prefs.theme;
  const subjectsLabel =
    prefs.favoriteSubjects.length === 0
      ? 'Sin elegir'
      : prefs.favoriteSubjects.length === 1
        ? '1 materia'
        : `${prefs.favoriteSubjects.length} materias`;

  const displayName = prefs.displayName.trim() || 'Tu espacio';

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
            <View className="absolute -bottom-0.5 -right-0.5 h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-primary dark:border-surface-dark dark:bg-primary-dark">
              <Pencil size={12} color={colors.primaryForeground} strokeWidth={2.5} />
            </View>
          </Pressable>

          <Stack gap="xs" className="min-w-0 flex-1">
            <AppText variant="subtitle" numberOfLines={1}>
              {displayName}
            </AppText>
            <Row
              align="center"
              gap="xs"
              className="self-start rounded-full bg-primary/15 px-2.5 py-1 dark:bg-primary-dark/15">
              <GraduationCap size={12} color={colors.primary} strokeWidth={2} />
              <AppText
                variant="caption"
                className="font-medium text-primary dark:text-primary-dark">
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
        <StatCard
          icon={ChartColumn}
          label="Nivel preferido"
          value={levelLabel}
        />
        <StatCard
          icon={BookOpen}
          label="Materias favoritas"
          value={subjectsLabel}
        />
        <StatCard icon={Moon} label="Tema actual" value={themeLabel} />
        <StatCard
          icon={Clock3}
          label="Última sincronización"
          value="Hace unos segundos"
        />
      </Row>

      <MenuGroup title="Personalización">
        <SpaceMenuRow
          title="Perfil"
          description="Nombre, rol y cómo te presentas"
          icon={UserRound}
          iconColor="#A78BFA"
          iconBgClassName="bg-[#A78BFA]/20"
          onPress={() => openSheet('profile')}
        />
        <Divider />
        <SpaceMenuRow
          title="Preferencias del tutor"
          description="Nivel, materias y estilo de explicación"
          icon={SlidersHorizontal}
          iconColor={colors.primary}
          iconBgClassName="bg-primary/15 dark:bg-primary-dark/15"
          onPress={() => openSheet('tutor')}
        />
        <Divider />
        <SpaceMenuRow
          title="Apariencia"
          description="Tema y aspecto visual de la app"
          icon={Palette}
          iconColor="#FB923C"
          iconBgClassName="bg-[#FB923C]/20"
          onPress={() => openSheet('appearance')}
        />
      </MenuGroup>

      <MenuGroup title="Datos">
        <SpaceMenuRow
          title="Conversaciones"
          description="Revisa o borra el historial del tutor"
          icon={MessageSquareText}
          iconColor="#60A5FA"
          iconBgClassName="bg-[#60A5FA]/20"
          onPress={() => openSheet('conversations')}
        />
        <Divider />
        <SpaceMenuRow
          title="Restablecer aplicación"
          description="Vuelve a las preferencias por defecto"
          icon={RotateCcw}
          iconColor={colors.danger}
          iconBgClassName="bg-danger/15 dark:bg-danger-dark/15"
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
      </MenuGroup>

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

function MenuGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Stack gap="sm">
      <AppText variant="caption" tone="muted" className="px-1 font-medium uppercase tracking-wide">
        {title}
      </AppText>
      <AppCard padding="none" className="overflow-hidden">
        {children}
      </AppCard>
    </Stack>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ChartColumn;
  label: string;
  value: string;
}) {
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
      <AppText
        variant="label"
        className="text-primary dark:text-primary-dark"
        numberOfLines={1}>
        {value}
      </AppText>
    </AppCard>
  );
}

function Divider() {
  return <View className="mx-3 h-px bg-border dark:bg-border-dark" />;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'E';
  if (parts.length === 1) return parts[0]!.slice(0, 2);
  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`;
}
