import { WEEKDAY_HOURS, wednesdayAt } from '@/test/fixtures';
import {
  formatRanges,
  formatRangesForA11y,
  formatTime,
  isOpenAt,
  toMinutes,
} from '@/utils/openingHours';

describe('openingHours utils', () => {
  it('parses HH:mm into minutes', () => {
    expect(toMinutes('09:30')).toBe(570);
    expect(toMinutes('bad')).toBeNaN();
  });

  it.each([
    [8, 59, false],
    [9, 0, true],
    [12, 29, true],
    [12, 30, false],
    [13, 0, false],
    [14, 0, true],
    [19, 0, false],
  ])('Wednesday %i:%i → open=%s', (h, m, expected) => {
    expect(isOpenAt(WEEKDAY_HOURS, wednesdayAt(h, m))).toBe(expected);
  });

  it('is closed all day on a day without ranges', () => {
    expect(isOpenAt(WEEKDAY_HOURS, new Date(2026, 10, 29, 11, 0))).toBe(false);
  });

  it('formats times and ranges in French', () => {
    expect(formatTime('09:00')).toBe('9h');
    expect(formatTime('12:30')).toBe('12h30');
    expect(formatRanges(WEEKDAY_HOURS[3])).toBe('9h – 12h30, 14h – 19h');
    expect(formatRanges([])).toBe('Fermé');
    expect(formatRangesForA11y(WEEKDAY_HOURS[1])).toBe('de 9h à 19h');
  });
});
