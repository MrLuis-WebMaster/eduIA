/**
 * Derives avatar initials from a display name.
 * Empty input returns `fallback` (default `''`).
 */
export function initialsFromName(name: string, fallback = ''): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
}

/** First whitespace-separated token of a display name. */
export function firstNameFromDisplayName(
  displayName: string,
  fallback = 'estudiante',
): string {
  const part = displayName.trim().split(/\s+/).filter(Boolean)[0];
  return part || fallback;
}

/** Truncates to `max` chars, appending an ellipsis when shortened. */
export function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}
