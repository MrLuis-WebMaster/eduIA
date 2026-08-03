import { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { Plus, SendHorizontal, Square } from 'lucide-react-native';

import { AppIconButton, AppScreenSection, AppText, Row, useTheme } from '@/design-system';

import { MESSAGE_MAX_LENGTH } from '../../domain';

type MessageComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  onCancel?: () => void;
  /** Opens the quick-actions sheet (ChatGPT-style "+"). */
  onOpenActions?: () => void;
  disabled?: boolean;
  sending?: boolean;
};

export function MessageComposer({
  value,
  onChange,
  onSend,
  onCancel,
  onOpenActions,
  disabled,
  sending,
}: MessageComposerProps) {
  const { colors } = useTheme();
  /** Local buffer preserves spaces while typing. */
  const [text, setText] = useState(value);

  useEffect(() => {
    setText((current) => (current === value ? current : value));
  }, [value]);

  const length = text.length;
  const canSend =
    !disabled &&
    !sending &&
    text.trim().length >= 2 &&
    length <= MESSAGE_MAX_LENGTH;

  const actionsDisabled = disabled || sending || !onOpenActions;

  return (
    <AppScreenSection className="pb-2.5 pt-1">
      <Row gap="sm" align="center">
        <View className="min-w-0 flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-3 py-2 dark:border-border-dark dark:bg-surface-dark">
          <AppIconButton
            icon={Plus}
            accessibilityLabel="Acciones rápidas"
            variant="secondary"
            size="sm"
            rounded
            disabled={actionsDisabled}
            className="mb-0.5 shrink-0"
            iconColor={
              actionsDisabled ? colors.foregroundMuted : colors.foreground
            }
            onPress={onOpenActions}
          />

          <View className="min-w-0 flex-1 justify-center">
            <TextInput
              value={text}
              onChangeText={(next) => {
                setText(next);
                onChange(next);
              }}
              placeholder="Escribe tu pregunta…"
              placeholderClassName="my-auto"
              placeholderTextColor={colors.foregroundMuted}
              editable={!disabled && !sending}
              multiline
              blurOnSubmit={false}
              maxLength={MESSAGE_MAX_LENGTH}
              className="max-h-24 min-h-fit py-1 text-[15px] leading-5 text-foreground dark:text-foreground-dark"
            />
            <AppText
              variant="caption"
              tone={length > MESSAGE_MAX_LENGTH - 100 ? 'warning' : 'muted'}
              className="self-end pt-0.5 text-[11px]">
              {length}/{MESSAGE_MAX_LENGTH}
            </AppText>
          </View>
        </View>

        {sending ? (
          <AppIconButton
            icon={Square}
            accessibilityLabel="Cancelar solicitud al tutor"
            variant="outline"
            size="md"
            rounded
            className="shrink-0"
            onPress={onCancel}
            iconColor={colors.foreground}
          />
        ) : (
          <AppIconButton
            icon={SendHorizontal}
            accessibilityLabel="Enviar mensaje"
            variant="solid"
            size="md"
            rounded
            className="shrink-0"
            disabled={!canSend}
            onPress={() => onSend(text)}
            iconColor={colors.primaryForeground}
          />
        )}
      </Row>
    </AppScreenSection>
  );
}
