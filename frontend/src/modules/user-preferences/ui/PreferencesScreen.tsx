import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  AppButton,
  AppChip,
  AppInput,
  AppSegmentedControl,
  AppSpinner,
  AppText,
  Box,
  Row,
  Stack,
} from '@/design-system';

import {
  LEVEL_OPTIONS,
  ROLE_OPTIONS,
  STYLE_OPTIONS,
  SUBJECT_OPTIONS,
  THEME_OPTIONS,
  type FavoriteSubject,
} from '../domain';
import { usePreferences } from './hooks/usePreferences';
import {
  preferencesFormSchema,
  type PreferencesFormValues,
} from './schema';

export function PreferencesScreen() {
  const {
    prefs,
    hydrated,
    saving,
    resetting,
    clearingHistory,
    statusMessage,
    errorMessage,
    save,
    reset,
    clearHistory,
  } = usePreferences();

  const {
    control,
    handleSubmit,
    reset: resetForm,
    formState: { errors, isDirty },
  } = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: toFormValues(prefs),
  });

  useEffect(() => {
    if (hydrated) {
      resetForm(toFormValues(prefs));
    }
  }, [hydrated, prefs, resetForm]);

  const busy = saving || resetting || clearingHistory;

  const onSave = handleSubmit(async (values) => {
    await save({
      displayName: values.displayName,
      role: values.role,
      preferredLevel: values.preferredLevel,
      favoriteSubjects: values.favoriteSubjects ?? [],
      explanationStyle: values.explanationStyle,
      theme: values.theme,
    });
  });

  if (!hydrated) {
    return (
      <Box className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <AppSpinner label="Cargando perfil…" />
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background dark:bg-background-dark">
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled">
          <Stack gap="md" className="px-4 pt-4">
            <Stack gap="xs">
              <AppText variant="subtitle">Perfil</AppText>
              <AppText tone="muted" variant="caption">
                Nombre, rol y cómo prefieres que EduIA te explique.
              </AppText>
            </Stack>

            <Controller
              control={control}
              name="displayName"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Nombre"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Tu nombre"
                  error={errors.displayName?.message}
                  editable={!busy}
                />
              )}
            />

            <Stack gap="xs">
              <AppText variant="label">Rol</AppText>
              <Controller
                control={control}
                name="role"
                render={({ field: { onChange, value } }) => (
                  <AppSegmentedControl
                    options={ROLE_OPTIONS}
                    value={value}
                    onChange={onChange}
                    disabled={busy}
                  />
                )}
              />
            </Stack>

            <Stack gap="xs">
              <AppText variant="label">Nivel preferido</AppText>
              <Controller
                control={control}
                name="preferredLevel"
                render={({ field: { onChange, value } }) => (
                  <AppSegmentedControl
                    options={LEVEL_OPTIONS}
                    value={value}
                    onChange={onChange}
                    disabled={busy}
                  />
                )}
              />
            </Stack>

            <Stack gap="xs">
              <AppText variant="label">Estilo de explicación</AppText>
              <Controller
                control={control}
                name="explanationStyle"
                render={({ field: { onChange, value } }) => (
                  <AppSegmentedControl
                    options={STYLE_OPTIONS}
                    value={value}
                    onChange={onChange}
                    disabled={busy}
                  />
                )}
              />
            </Stack>

            <Stack gap="xs">
              <AppText variant="label">Materias favoritas</AppText>
              <Controller
                control={control}
                name="favoriteSubjects"
                render={({ field: { onChange, value } }) => (
                  <Row gap="sm" className="flex-wrap">
                    {SUBJECT_OPTIONS.map((option) => {
                      const selected = (value ?? []).includes(option.value);
                      return (
                        <AppChip
                          key={option.value}
                          label={option.label}
                          selected={selected}
                          disabled={busy}
                          onPress={() =>
                            onChange(
                              toggleSubject(value ?? [], option.value),
                            )
                          }
                        />
                      );
                    })}
                  </Row>
                )}
              />
            </Stack>

            <Stack gap="xs">
              <AppText variant="label">Tema</AppText>
              <Controller
                control={control}
                name="theme"
                render={({ field: { onChange, value } }) => (
                  <AppSegmentedControl
                    options={THEME_OPTIONS}
                    value={value}
                    onChange={onChange}
                    disabled={busy}
                  />
                )}
              />
            </Stack>

            {statusMessage ? (
              <AppText tone="success" variant="caption">
                {statusMessage}
              </AppText>
            ) : null}
            {errorMessage ? (
              <AppText tone="danger" variant="caption">
                {errorMessage}
              </AppText>
            ) : null}

            <AppButton
              label="Guardar"
              onPress={onSave}
              loading={saving}
              disabled={busy || !isDirty}
              fullWidth
            />

            <View className="h-px bg-border dark:bg-border-dark" />

            <Stack gap="sm">
              <AppText variant="label">Datos locales</AppText>
              <AppButton
                label="Borrar historial del tutor"
                variant="outline"
                onPress={() => {
                  void clearHistory();
                }}
                loading={clearingHistory}
                disabled={busy}
                fullWidth
              />
              <AppButton
                label="Restablecer preferencias"
                variant="danger"
                onPress={() => {
                  void reset().then((next) => {
                    resetForm(toFormValues(next));
                  });
                }}
                loading={resetting}
                disabled={busy}
                fullWidth
              />
            </Stack>
          </Stack>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
}

function toFormValues(prefs: {
  displayName: string;
  role: PreferencesFormValues['role'];
  preferredLevel: PreferencesFormValues['preferredLevel'];
  favoriteSubjects: FavoriteSubject[];
  explanationStyle: PreferencesFormValues['explanationStyle'];
  theme: PreferencesFormValues['theme'];
}): PreferencesFormValues {
  return {
    displayName: prefs.displayName,
    role: prefs.role,
    preferredLevel: prefs.preferredLevel,
    favoriteSubjects: prefs.favoriteSubjects,
    explanationStyle: prefs.explanationStyle,
    theme: prefs.theme,
  };
}

function toggleSubject(
  current: FavoriteSubject[],
  subject: FavoriteSubject,
): FavoriteSubject[] {
  return current.includes(subject)
    ? current.filter((s) => s !== subject)
    : [...current, subject];
}
