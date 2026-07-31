import { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

import {
  AppEmptyState,
  AppSpinner,
  AppText,
  Box,
  useTheme,
} from '@/design-system';

import type { ChatMessage } from '../../domain';

type ChatMessageListProps = {
  messages: ChatMessage[];
  isLoading?: boolean;
  isSending?: boolean;
};

export function ChatMessageList({
  messages,
  isLoading,
  isSending,
}: ChatMessageListProps) {
  const { colors, colorScheme } = useTheme();

  const markdownStyles = useMemo(
    () => ({
      body: {
        color: colors.foreground,
        fontSize: 15,
        lineHeight: 22,
      },
      heading1: { color: colors.foreground, fontSize: 20, marginBottom: 6 },
      heading2: { color: colors.foreground, fontSize: 18, marginBottom: 4 },
      heading3: { color: colors.foreground, fontSize: 16, marginBottom: 4 },
      bullet_list: { marginVertical: 4 },
      ordered_list: { marginVertical: 4 },
      code_inline: {
        backgroundColor: colors.backgroundSecondary,
        color: colors.primary,
        borderRadius: 4,
        paddingHorizontal: 4,
      },
      fence: {
        backgroundColor: colors.backgroundSecondary,
        color: colors.foreground,
        borderRadius: 8,
        padding: 10,
        marginVertical: 6,
      },
      blockquote: {
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.border,
        borderLeftWidth: 3,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginVertical: 6,
      },
      link: { color: colors.primary },
      strong: { color: colors.foreground, fontWeight: '700' as const },
    }),
    [colors],
  );

  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center">
        <AppSpinner label="Cargando conversación…" />
      </Box>
    );
  }

  if (messages.length === 0 && !isSending) {
    return (
      <AppEmptyState
        compact
        title="Empieza una conversación"
        description="Elige materia y dificultad, o usa una acción rápida."
      />
    );
  }

  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 10 }}
      className="flex-1"
      renderItem={({ item }) => (
        <MessageBubble
          message={item}
          markdownStyles={markdownStyles}
          isDark={colorScheme === 'dark'}
        />
      )}
      ListFooterComponent={
        isSending ? (
          <View className="mt-2 self-start rounded-2xl bg-background-secondary px-4 py-3 dark:bg-background-dark-secondary">
            <AppSpinner size="sm" label="El tutor está pensando…" />
          </View>
        ) : null
      }
    />
  );
}

function MessageBubble({
  message,
  markdownStyles,
  isDark,
}: {
  message: ChatMessage;
  markdownStyles: Record<string, object>;
  isDark: boolean;
}) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <View className="max-w-[88%] self-end rounded-2xl bg-primary px-4 py-3 dark:bg-primary-dark">
        <AppText className="text-primary-foreground dark:text-primary-dark-foreground">
          {message.content}
        </AppText>
      </View>
    );
  }

  return (
    <View
      className={`max-w-[92%] self-start rounded-2xl border px-3 py-2 ${
        isDark
          ? 'border-border-dark bg-surface-dark'
          : 'border-border bg-surface'
      }`}>
      <Markdown style={markdownStyles}>{message.content}</Markdown>
    </View>
  );
}
