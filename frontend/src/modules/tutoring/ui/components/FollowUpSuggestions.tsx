import { ScrollView, View } from 'react-native';

import { AppText, Pressable, layout } from '@/design-system';

import type { FollowUpSuggestion } from '../../domain';

type FollowUpSuggestionsProps = {
  suggestions: FollowUpSuggestion[];
  onSelect: (prompt: string) => void;
  disabled?: boolean;
};

/** Compact chips under the latest assistant message. */
export function FollowUpSuggestions({
  suggestions,
  onSelect,
  disabled,
}: FollowUpSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <View className="mt-1 pb-2">
      <AppText variant="caption" tone="muted" className="mb-2 px-0.5">
        Continuar con…
      </AppText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingRight: layout.gutterX }}>
        {suggestions.map((suggestion) => (
          <Pressable
            key={suggestion.id}
            accessibilityRole="button"
            accessibilityLabel={suggestion.label}
            disabled={disabled}
            onPress={() => onSelect(suggestion.prompt)}
            className="rounded-full border border-border bg-surface px-3.5 py-2 active:opacity-80">
            <AppText variant="caption" className="text-[13px]">
              {suggestion.label}
            </AppText>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
