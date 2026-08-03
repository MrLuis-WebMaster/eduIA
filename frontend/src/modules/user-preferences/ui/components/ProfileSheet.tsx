import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
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

import type { UserPreferences } from '../../domain';
import { ROLE_SELECT_OPTIONS } from '../roleOptions';

const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(80, 'Máximo 80 caracteres'),
  role: z.enum(['student', 'teacher']),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type ProfileSheetProps = {
  visible: boolean;
  prefs: UserPreferences;
  saving: boolean;
  onClose: () => void;
  onSave: (patch: Pick<UserPreferences, 'displayName' | 'role'>) => Promise<void>;
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
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: prefs.displayName,
      role: prefs.role,
    },
  });

  useEffect(() => {
    if (visible) {
      reset({
        displayName: prefs.displayName,
        role: prefs.role,
      });
    }
  }, [visible, prefs.displayName, prefs.role, reset]);

  const displayName = watch('displayName');
  const initials = initialsFromName(displayName || prefs.displayName);

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
              className="absolute -bottom-0.5 -right-0.5 h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-primary dark:border-surface-dark dark:bg-primary-dark"
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
      </Stack>
    </AppBottomSheet>
  );
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'E';
  if (parts.length === 1) return parts[0]!.slice(0, 2);
  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`;
}
