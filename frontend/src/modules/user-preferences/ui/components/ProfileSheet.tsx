import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Alert, View } from 'react-native';
import { Camera } from 'lucide-react-native';
import { z } from 'zod';

import {
  AppAvatar,
  AppBottomSheet,
  AppButton,
  AppInput,
  AppSelectableOption,
  AppText,
  Pressable,
  Stack,
  useTheme,
} from '@/design-system';
import { zodResolver } from '@/shared';
import { initialsFromName } from '@/shared/utils';

import type { UserPreferences } from '../../domain';
import { ROLE_SELECT_OPTIONS } from '../options';

const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(80, 'Máximo 80 caracteres'),
  role: z.enum(['student', 'teacher']),
  age: z.number().nullable().refine((age) => age !== null && age >= 18 && age <= 99, 'La edad debe ser mayor o igual a 18 y menor o igual a 99'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type ProfileSheetProps = {
  visible: boolean;
  prefs: UserPreferences;
  saving: boolean;
  onClose: () => void;
  onSave: (patch: Pick<UserPreferences, 'displayName' | 'role' | 'age'>) => Promise<void>;
};

export function ProfileSheet({
  visible,
  prefs,
  saving,
  onClose,
  onSave,
}: ProfileSheetProps) {
  const { colors } = useTheme();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: prefs.displayName,
      role: prefs.role,
      age: prefs.age,
    },
  });

  useEffect(() => {
    if (visible) {
      reset({
        displayName: prefs.displayName,
        role: prefs.role,
        age: prefs.age,
      });
    }
  }, [visible, prefs.displayName, prefs.role, prefs.age, reset]);

  const displayName = useWatch({ control, name: 'displayName' });
  const initials = initialsFromName(displayName || prefs.displayName, 'E');

  return (
    <AppBottomSheet
      visible={visible}
      title="Perfil"
      onClose={onClose}
      accessibilityLabel="Editar perfil"
      footer={
        <AppButton
          label="Guardar"
          loading={saving}
          disabled={saving || !isDirty}
          fullWidth
          onPress={handleSubmit(async (values) => {
            await onSave({
              displayName: values.displayName.trim(),
              role: values.role,
              age: values.age,
            });
          })}
        />
      }>
      <Stack gap="lg" className="pb-2">
        <Stack align="center" gap="sm" className="py-2">
          <View className="relative">
            <AppAvatar
              size="xl"
              tone="primary"
              initials={initials}
              accessibilityLabel="Foto de perfil"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cambiar foto"
              className="absolute -bottom-0.5 -right-0.5 h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-primary"
              onPress={() => {
                Alert.alert(
                  'Foto de perfil',
                  'Pronto podrás subir una foto. Por ahora usamos tus iniciales.',
                );
              }}>
              <Camera size={14} color={colors.primaryForeground} strokeWidth={2} />
            </Pressable>
          </View>
          <AppText variant="caption" tone="muted">
            Usamos tus iniciales hasta que agregues una foto
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
              editable={!saving}
            />
          )}
        />

        <Stack gap="sm">
          <AppText variant="label">Rol</AppText>
          <Controller
            control={control}
            name="role"
            render={({ field: { onChange, value } }) => (
              <Stack gap="sm">
                {ROLE_SELECT_OPTIONS.map((option) => (
                  <AppSelectableOption
                    key={option.value}
                    label={option.label}
                    description={option.description}
                    icon={option.icon}
                    selected={value === option.value}
                    disabled={saving}
                    onPress={() => onChange(option.value)}
                  />
                ))}
              </Stack>
            )}
          />
        </Stack>
        <Stack gap="sm">
          <Controller
            control={control}
            name="age"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Edad"
                value={value?.toString() || ''}
                onChangeText={(text) => {
                  const digits = text.replace(/\D/g, '');
                  onChange(digits === '' ? null : Number(digits));
                }}
                placeholder="Tu edad"
                error={errors.age?.message}
                editable={!saving}
                keyboardType="number-pad"
                maxLength={2}
              />
            )}
          />
        </Stack>
      </Stack>
    </AppBottomSheet>
  );
}
