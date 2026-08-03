import { Plus } from 'lucide-react-native';

import { AppButton, AppScreenSection, Row } from '@/design-system';

type TutorSessionBarProps = {
  onNewSession: () => void;
  newSessionDisabled?: boolean;
};

/** Tutor-only session controls (not part of the global header). */
export function TutorSessionBar({
  onNewSession,
  newSessionDisabled,
}: TutorSessionBarProps) {
  return (
    <AppScreenSection>
      <Row justify="end" align="center">
        <AppButton
          label="Nueva sesión"
          icon={Plus}
          variant="outline"
          size="sm"
          onPress={onNewSession}
          disabled={newSessionDisabled}
          className="h-9 shrink-0 rounded-full px-3"
          accessibilityLabel="Iniciar nueva sesión"
        />
      </Row>
    </AppScreenSection>
  );
}
