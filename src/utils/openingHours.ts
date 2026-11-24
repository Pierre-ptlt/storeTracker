import type { OpeningHours, TimeRange, Weekday } from '@/types/store';

export const WEEK_DISPLAY_ORDER: readonly Weekday[] = [1, 2, 3, 4, 5, 6, 0];

export const WEEKDAY_LABELS: Readonly<Record<Weekday, string>> = {
  0: 'Dimanche',
  1: 'Lundi',
  2: 'Mardi',
  3: 'Mercredi',
  4: 'Jeudi',
  5: 'Vendredi',
  6: 'Samedi',
};

export const toMinutes = (time: string): number => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) return Number.NaN;
  return Number(match[1]) * 60 + Number(match[2]);
};

export const toWeekday = (date: Date): Weekday => {
  return date.getDay() as Weekday;
};

export const isOpenAt = (hours: OpeningHours, date: Date): boolean => {
  const minutes = date.getHours() * 60 + date.getMinutes();
  return hours[toWeekday(date)].some(
    (range) => minutes >= toMinutes(range.open) && minutes < toMinutes(range.close),
  );
};

export const formatTime = (time: string): string => {
  const [h = '', m = ''] = time.split(':');
  return `${Number(h)}h${m === '00' ? '' : m}`;
};

export const formatRanges = (ranges: readonly TimeRange[]): string => {
  if (ranges.length === 0) return 'Fermé';
  return ranges.map((r) => `${formatTime(r.open)} – ${formatTime(r.close)}`).join(', ');
};

export const formatRangesForA11y = (ranges: readonly TimeRange[]): string => {
  if (ranges.length === 0) return 'fermé';
  return ranges.map((r) => `de ${formatTime(r.open)} à ${formatTime(r.close)}`).join(', puis ');
};
