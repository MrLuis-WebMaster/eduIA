import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  BookOpenText,
  CircleHelp,
  Ellipsis,
  Lightbulb,
  ListChecks,
  MessageCircleQuestion,
  Presentation,
  TriangleAlert,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import {
  AppBottomSheet,
  AppCard,
  AppSelectableOption,
  AppText,
  Pressable,
  Stack,
  layout,
  useTheme,
} from '@/design-system';

import {
  QUICK_ACTIONS,
  type QuickAction,
  type QuickActionId,
  type UserRole,
} from '../../domain';

const ACTION_ICONS: Record<QuickActionId, LucideIcon> = {
  explain: BookOpenText,
  example: Lightbulb,
  question: MessageCircleQuestion,
  steps: ListChecks,
  'class-ideas': Presentation,
  'common-errors': TriangleAlert,
  formative: CircleHelp,
};

const ACCENT_COLORS: Record<QuickActionId, string> = {
  explain: '#A78BFA',
  example: '#F472B6',
  question: '#FB923C',
  steps: '#4ADE80',
  'class-ideas': '#A78BFA',
  'common-errors': '#FB923C',
  formative: '#2DD4BF',
};

const CARD_CLASS = 'h-[84px] w-[100px] justify-between rounded-xl';

const VISIBLE_COUNT = 4;

type QuickActionsSheetProps = {
  role: UserRole;
  visible: boolean;
  onClose: () => void;
  onSelect: (prompt: string) => void;
};

/** Full catalog of quick actions in a bottom sheet (composer "+" / empty "Más"). */
export function QuickActionsSheet({
  role,
  visible,
  onClose,
  onSelect,
}: QuickActionsSheetProps) {
  const actions = QUICK_ACTIONS[role];

  return (
    <AppBottomSheet
      visible={visible}
      title="Acciones rápidas"
      onClose={onClose}
      maxHeightClassName="max-h-[70%]"
      accessibilityLabel="Acciones rápidas">
      <Stack gap="sm">
        {actions.map((action) => (
          <AppSelectableOption
            key={action.id}
            label={action.label}
            icon={ACTION_ICONS[action.id]}
            selected={false}
            hideIndicator
            onPress={() => {
              onSelect(action.prompt);
              onClose();
            }}
          />
        ))}
      </Stack>
    </AppBottomSheet>
  );
}

type QuickActionsProps = {
  role: UserRole;
  onSelect: (prompt: string) => void;
  disabled?: boolean;
};

/** Horizontal strip for the empty conversation state only. */
export function QuickActions({ role, onSelect, disabled }: QuickActionsProps) {
  const actions = QUICK_ACTIONS[role];
  const [moreOpen, setMoreOpen] = useState(false);
  const visible = useMemo(() => actions.slice(0, VISIBLE_COUNT), [actions]);
  const { colors } = useTheme();

  return (
    <>
      <View className="max-h-fit">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: layout.gutterX,
            gap: 8,
            alignItems: 'stretch',
          }}>
          {visible.map((action) => (
            <QuickActionCard
              key={action.id}
              action={action}
              disabled={disabled}
              onPress={() => onSelect(action.prompt)}
            />
          ))}
          {actions.length > VISIBLE_COUNT ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Más acciones rápidas"
              disabled={disabled}
              onPress={() => setMoreOpen(true)}
              className="active:opacity-80">
              <AppCard
                variant="elevated"
                padding="sm"
                className={`${CARD_CLASS} items-center justify-center`}>
                <Ellipsis size={20} color={colors.primary} strokeWidth={2} />
                <AppText variant="caption" className="mt-2 text-center">
                  Más
                </AppText>
              </AppCard>
            </Pressable>
          ) : null}
        </ScrollView>
      </View>

      <QuickActionsSheet
        role={role}
        visible={moreOpen}
        onClose={() => setMoreOpen(false)}
        onSelect={onSelect}
      />
    </>
  );
}

function QuickActionCard({
  action,
  onPress,
  disabled,
}: {
  action: QuickAction;
  onPress: () => void;
  disabled?: boolean;
}) {
  const Icon = ACTION_ICONS[action.id];
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={action.label}
      disabled={disabled}
      onPress={onPress}
      className="active:opacity-80">
      <AppCard variant="elevated" padding="sm" className={CARD_CLASS}>
        <Icon
          size={18}
          color={ACCENT_COLORS[action.id] ?? colors.primary}
          strokeWidth={2}
        />
        <AppText variant="caption" numberOfLines={3}>
          {action.label}
        </AppText>
      </AppCard>
    </Pressable>
  );
}
