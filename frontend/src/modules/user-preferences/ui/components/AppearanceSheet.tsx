import { useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { View } from 'react-native';

import {
  AppBottomSheet,
  AppButton,
  AppSelectableOption,
  AppText,
  Row,
  Stack,
} from '@/design-system';

import {
  THEME_LABELS,
  type ThemePreference,
  type UserPreferences,
} from '../../domain';

type AppearanceSheetProps = {
  visible: boolean;
  prefs: UserPreferences;
  saving: boolean;
  onClose: () => void;
  onSave: (theme: ThemePreference) => Promise<void>;
};

const THEME_ICONS: Record<ThemePreference, LucideIcon> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};

const THEME_DESCRIPTIONS: Record<ThemePreference, string> = {
  system: 'Sigue la configuración del dispositivo',
  light: 'Fondo claro para uso diurno',
  dark: 'Fondo oscuro, ideal de noche',
};

const THEME_STATUS: Record<ThemePreference, string> = {
  system: 'Guardado — Tema del sistema activado',
  light: 'Guardado — Tema claro activado',
  dark: 'Guardado — Tema oscuro activado',
};

const THEME_VALUES: ThemePreference[] = ['system', 'light', 'dark'];

export function AppearanceSheet({
  visible,
  prefs,
  saving,
  onClose,
  onSave,
}: AppearanceSheetProps) {
  const [theme, setTheme] = useState<ThemePreference>(prefs.theme);
  const [prevVisible, setPrevVisible] = useState(visible);

  // Reset draft theme when the sheet opens (avoid syncing via useEffect).
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setTheme(prefs.theme);
    }
  }

  const dirty = theme !== prefs.theme;

  return (
    <AppBottomSheet
      visible={visible}
      title="Apariencia"
      onClose={onClose}
      accessibilityLabel="Apariencia"
      footer={
        <AppButton
          label="Guardar"
          loading={saving}
          disabled={saving || !dirty}
          fullWidth
          onPress={() => {
            void onSave(theme);
          }}
        />
      }>
      <Stack gap="md" className="pb-2">
        <Stack gap="sm">
          <AppText variant="label">Tema</AppText>
          <Stack gap="sm">
            {THEME_VALUES.map((value) => (
              <AppSelectableOption
                key={value}
                label={THEME_LABELS[value]}
                description={THEME_DESCRIPTIONS[value]}
                icon={THEME_ICONS[value]}
                selected={theme === value}
                disabled={saving}
                onPress={() => setTheme(value)}
              />
            ))}
          </Stack>
        </Stack>

        <Stack gap="xs">
          <AppText variant="label">Color de acento</AppText>
          <AppText variant="caption" tone="muted">
            Por ahora EduIA usa el acento teal de la marca.
          </AppText>
          <Row gap="sm" className="mt-1">
            {['#2DD4BF', '#A78BFA', '#60A5FA', '#F472B6', '#FB923C'].map(
              (color, index) => {
                const selected = index === 0;
                return (
                  <View
                    key={color}
                    accessibilityLabel={
                      selected ? 'Acento teal (activo)' : 'Acento no disponible'
                    }
                    className={`h-9 w-9 items-center justify-center rounded-full ${
                      selected
                        ? 'border-2 border-foreground'
                        : 'border border-transparent'
                    }`}>
                    <View
                      className="h-7 w-7 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </View>
                );
              },
            )}
          </Row>
        </Stack>
      </Stack>
    </AppBottomSheet>
  );
}

export { THEME_STATUS };
