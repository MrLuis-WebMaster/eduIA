import { useCallback, useMemo, useRef, useState } from 'react';
import { Share, View } from 'react-native';
import { FlashList, type FlashListRef, type ListRenderItem } from '@shopify/flash-list';
import Markdown from 'react-native-marked';
import {
  CheckCheck,
  ChevronDown,
  Copy,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react-native';

import {
  AppAvatar,
  AppEmptyState,
  AppIconButton,
  AppSpinner,
  AppText,
  Box,
  Pressable,
  Row,
  layout,
  useTheme,
} from '@/design-system';

import type { ChatMessage, FollowUpSuggestion } from '../../domain';
import { FollowUpSuggestions } from './FollowUpSuggestions';
import {
  createTutorMarkdownRenderer,
  createTutorMarkdownStyles,
  createTutorMarkdownTheme,
} from './tutorMarkdown';

type ChatMessageListProps = {
  messages: ChatMessage[];
  isLoading?: boolean;
  isSending?: boolean;
  followUps?: FollowUpSuggestion[];
  onFollowUpSelect?: (prompt: string) => void;
  followUpsDisabled?: boolean;
};

type ListItem =
  | { type: 'separator'; id: string; label: string }
  | { type: 'message'; id: string; message: ChatMessage };

export function ChatMessageList({
  messages,
  isLoading,
  isSending,
  followUps = [],
  onFollowUpSelect,
  followUpsDisabled,
}: ChatMessageListProps) {
  const { colors, colorScheme } = useTheme();
  const [showJump, setShowJump] = useState(false);
  const listRef = useRef<FlashListRef<ListItem>>(null);

  const markdownPalette = useMemo(
    () => ({
      text: colors.foreground,
      link: colors.primary,
      code: colors.backgroundSecondary,
      border: colors.border,
      muted: colors.foregroundMuted,
    }),
    [colors],
  );

  const markdownTheme = useMemo(
    () => createTutorMarkdownTheme(markdownPalette),
    [markdownPalette],
  );

  const markdownStyles = useMemo(
    () => createTutorMarkdownStyles(markdownPalette),
    [markdownPalette],
  );

  const markdownRenderer = useMemo(
    () => createTutorMarkdownRenderer(markdownPalette.text),
    [markdownPalette.text],
  );

  const items = useMemo(() => buildListItems(messages), [messages]);

  const renderItem = useCallback<ListRenderItem<ListItem>>(
    ({ item }) => {
      if (item.type === 'separator') {
        return (
          <Row align="center" gap="sm" className="mb-4 mt-1">
            <Box className="h-px flex-1 bg-border/70" />
            <AppText variant="caption" tone="muted" className="px-1">
              {item.label}
            </AppText>
            <Box className="h-px flex-1 bg-border/70" />
          </Row>
        );
      }

      return (
        <View className="pb-3">
          <MessageBubble
            message={item.message}
            markdownTheme={markdownTheme}
            markdownStyles={markdownStyles}
            markdownRenderer={markdownRenderer}
          />
        </View>
      );
    },
    [markdownTheme, markdownStyles, markdownRenderer],
  );

  const keyExtractor = useCallback((item: ListItem) => item.id, []);

  const getItemType = useCallback(
    (item: ListItem) =>
      item.type === 'separator' ? 'separator' : item.message.role,
    [],
  );

  const lastMessage = messages[messages.length - 1];
  const showFollowUps =
    !isSending &&
    lastMessage?.role === 'assistant' &&
    followUps.length > 0 &&
    Boolean(onFollowUpSelect);

  const listFooter = useMemo(
    () => {
      if (isSending) {
        return (
          <Row gap="sm" align="end" className="mt-1 self-start pb-2">
            <AppAvatar size="sm" tone="surface" accessibilityLabel="Tutor EduIA" />
            <View className="rounded-2xl rounded-tl-md border border-border bg-surface px-4 py-3">
              <AppSpinner size="sm" label="El tutor está pensando…" />
            </View>
          </Row>
        );
      }

      if (showFollowUps && onFollowUpSelect) {
        return (
          <FollowUpSuggestions
            suggestions={followUps}
            onSelect={onFollowUpSelect}
            disabled={followUpsDisabled}
          />
        );
      }

      return null;
    },
    [
      isSending,
      showFollowUps,
      followUps,
      onFollowUpSelect,
      followUpsDisabled,
    ],
  );

  if (isLoading) {
    return <AppSpinner fill label="Cargando conversación…" />;
  }

  if (messages.length === 0 && !isSending) {
    return (
      <AppEmptyState
        fill
        placement="start"
        align="start"
        title="Empieza una conversación"
        description="Elige materia y dificultad, o toca una acción rápida para empezar."
      />
    );
  }

  return (
    <Box className="relative min-h-0 flex-1">
      <FlashList
        ref={listRef}
        data={items}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        renderItem={renderItem}
        extraData={colorScheme}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: layout.gutterX,
          paddingTop: 4,
          paddingBottom: 12,
        }}
        ListFooterComponent={listFooter}
        keyboardShouldPersistTaps="handled"
        onScroll={(e) => {
          const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
          const overflow = contentSize.height - layoutMeasurement.height;
          const distanceFromBottom = overflow - contentOffset.y;
          setShowJump(overflow > 48 && distanceFromBottom > 140);
        }}
        scrollEventThrottle={100}
      />

      {showJump ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ir al final del chat"
          onPress={() => {
            listRef.current?.scrollToEnd({ animated: true });
            setShowJump(false);
          }}
          className="absolute bottom-2 right-3 h-8 w-8 items-center justify-center rounded-full border border-border bg-surface/95 active:opacity-80">
          <ChevronDown size={16} color={colors.foregroundMuted} strokeWidth={2} />
        </Pressable>
      ) : null}
    </Box>
  );
}

function MessageBubble({
  message,
  markdownTheme,
  markdownStyles,
  markdownRenderer,
}: {
  message: ChatMessage;
  markdownTheme: ReturnType<typeof createTutorMarkdownTheme>;
  markdownStyles: ReturnType<typeof createTutorMarkdownStyles>;
  markdownRenderer: ReturnType<typeof createTutorMarkdownRenderer>;
}) {
  const { colors } = useTheme();
  const isUser = message.role === 'user';
  const timeLabel = formatTime(message.createdAt);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  if (isUser) {
    return (
      <View className="max-w-[85%] self-end">
        <View className="rounded-2xl rounded-br-md bg-chat-user px-3.5 py-2.5">
          <AppText className="text-[15px] leading-[22px] text-chat-user-foreground">
            {message.content}
          </AppText>
          <Row justify="end" align="center" gap="xs" className="mt-1.5">
            <AppText
              variant="caption"
              className="text-[11px] text-chat-user-foreground/70">
              {timeLabel}
            </AppText>
            <CheckCheck size={13} color="rgba(255,255,255,0.75)" strokeWidth={2} />
          </Row>
        </View>
      </View>
    );
  }

  return (
    <Row gap="sm" align="start" className="max-w-[92%] self-start">
      <AppAvatar
        size="sm"
        tone="surface"
        className="mt-0.5"
        accessibilityLabel="Tutor EduIA"
      />
      <View className="min-w-0 flex-1">
        <View className="overflow-hidden rounded-2xl rounded-tl-md border border-border bg-surface">
          <View className="px-4 pb-1.5 pt-3.5">
            <Markdown
              value={message.content}
              theme={markdownTheme}
              styles={markdownStyles}
              renderer={markdownRenderer}
              flatListProps={{
                style: { backgroundColor: 'transparent' },
                contentContainerStyle: { paddingBottom: 2 },
                scrollEnabled: false,
              }}
            />
          </View>
          {timeLabel ? (
            <AppText variant="caption" tone="muted" className="px-4 pb-2.5 text-[11px]">
              {timeLabel}
            </AppText>
          ) : null}
        </View>
        <Row gap="none" align="center" className="-ml-1.5 mt-1">
          <AppIconButton
            icon={Copy}
            size="xs"
            variant="ghost"
            accessibilityLabel="Copiar respuesta"
            iconColor={colors.foregroundMuted}
            onPress={() => {
              void Share.share({ message: message.content });
            }}
          />
          <AppIconButton
            icon={ThumbsUp}
            size="xs"
            variant="ghost"
            accessibilityLabel="Respuesta útil"
            iconColor={feedback === 'up' ? colors.primary : colors.foregroundMuted}
            onPress={() => setFeedback((v) => (v === 'up' ? null : 'up'))}
          />
          <AppIconButton
            icon={ThumbsDown}
            size="xs"
            variant="ghost"
            accessibilityLabel="Respuesta no útil"
            iconColor={feedback === 'down' ? colors.danger : colors.foregroundMuted}
            onPress={() => setFeedback((v) => (v === 'down' ? null : 'down'))}
          />
        </Row>
      </View>
    </Row>
  );
}

function buildListItems(messages: ChatMessage[]): ListItem[] {
  const items: ListItem[] = [];
  let lastDayKey: string | null = null;

  for (const message of messages) {
    if (message.role === 'system') continue;
    const dayKey = toDayKey(message.createdAt);
    if (dayKey !== lastDayKey) {
      items.push({
        type: 'separator',
        id: `sep-${dayKey}`,
        label: formatDayLabel(message.createdAt),
      });
      lastDayKey = dayKey;
    }
    items.push({ type: 'message', id: message.id, message });
  }

  return items;
}

function toDayKey(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'unknown';
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function formatDayLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Conversación';

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (toDayKey(iso) === toDayKey(today.toISOString())) return 'Hoy';
  if (toDayKey(iso) === toDayKey(yesterday.toISOString())) return 'Ayer';

  return d.toLocaleDateString('es', {
    day: 'numeric',
    month: 'short',
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('es', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
