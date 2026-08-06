/** Calendar day key `YYYY-MM-DD` (local timezone). */
export function toDateKey(input: Date | string): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return '';

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Adds (or subtracts) calendar days. Noon-normalized to avoid DST edge cases. */
export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setHours(12, 0, 0, 0);
  next.setDate(next.getDate() + days);
  return next;
}

/** Parses a `YYYY-MM-DD` key into a local noon Date. */
export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y!, m! - 1, d!, 12, 0, 0, 0);
}

/**
 * Formats an ISO date as a relative Spanish day label
 * (`Hoy`, `Ayer`, `Hace N días`, or a short absolute date).
 */
export function formatRelativeDay(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const today = new Date();
  const dateKey = toDateKey(date);
  if (dateKey === toDateKey(today)) return 'Hoy';
  if (dateKey === toDateKey(addDays(today, -1))) return 'Ayer';

  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  const dateStart = new Date(date);
  dateStart.setHours(0, 0, 0, 0);
  const days = Math.round(
    (todayStart.getTime() - dateStart.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days > 1 && days < 7) return `Hace ${days} días`;

  return date.toLocaleDateString('es', { day: 'numeric', month: 'short' });
}

/** Formats an ISO datetime as `HH:mm` (24h, Spanish locale). */
export function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('es', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
