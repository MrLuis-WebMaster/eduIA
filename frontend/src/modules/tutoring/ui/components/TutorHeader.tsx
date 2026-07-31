import { AppButton, AppText, Row } from '@/design-system';

type TutorHeaderProps = {
  displayName?: string;
  roleLabel: string;
  onNewSession: () => void;
  newSessionDisabled?: boolean;
};

export function TutorHeader({
  displayName = 'Estudiante',
  roleLabel,
  onNewSession,
  newSessionDisabled,
}: TutorHeaderProps) {
  return (
    <Row justify="between" align="start" className="px-4 pt-2 pb-1">
      <Row gap="sm" align="center" className="flex-1 pr-3">
        <AppText variant="subtitle" numberOfLines={1}>
          Hola, {displayName}
        </AppText>
      </Row>
      <AppButton
        label="Nueva"
        variant="outline"
        size="sm"
        onPress={onNewSession}
        disabled={newSessionDisabled}
      />
    </Row>
  );
}

export function TutorRoleHint({ roleLabel }: { roleLabel: string }) {
  return (
    <AppText tone="muted" variant="caption" className="px-4 pb-2">
      Modo {roleLabel} · elige materia y nivel, luego pregunta
    </AppText>
  );
}
