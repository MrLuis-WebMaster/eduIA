import { AppButton, AppText, AppTextArea, Row, Stack } from '@/design-system';

import { MESSAGE_MAX_LENGTH } from '../../domain';

type MessageComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  sending?: boolean;
};

export function MessageComposer({
  value,
  onChange,
  onSend,
  disabled,
  sending,
}: MessageComposerProps) {
  const length = value.length;
  const canSend =
    !disabled && !sending && value.trim().length >= 2 && length <= MESSAGE_MAX_LENGTH;

  return (
    <Stack gap="xs" className="border-t border-border px-4 pb-3 pt-2 dark:border-border-dark">
      <AppTextArea
        value={value}
        onChangeText={onChange}
        placeholder="Escribe tu pregunta…"
        maxLength={MESSAGE_MAX_LENGTH}
        editable={!disabled && !sending}
        className="min-h-[72px]"
      />
      <Row justify="between" align="center">
        <AppText
          variant="caption"
          tone={length > MESSAGE_MAX_LENGTH - 100 ? 'warning' : 'muted'}>
          {length}/{MESSAGE_MAX_LENGTH}
        </AppText>
        <AppButton
          label="Enviar"
          size="sm"
          loading={sending}
          disabled={!canSend}
          onPress={onSend}
        />
      </Row>
    </Stack>
  );
}
