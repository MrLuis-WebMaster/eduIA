import { spacing } from './spacing';

/**
 * Shared screen layout contract — use via AppScreen / AppScreenSection
 * instead of repeating px/pt/gap per view.
 */
export const layout = {
  /** Horizontal content gutter (Tailwind `px-4` = 16). */
  gutterX: spacing.lg,
  gutterClassName: 'px-4',
  /** Top inset below safe area for standard screens. */
  contentTopClassName: 'pt-4',
  /** Default vertical rhythm between screen blocks. */
  gap: 'md' as const,
  /** Compact rhythm (chat chrome). */
  gapCompact: 'sm' as const,
  /** Extra space at end of scrollable screens. */
  scrollBottom: spacing['3xl'],
} as const;
