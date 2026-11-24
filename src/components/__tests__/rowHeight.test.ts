import { STORE_ROW_HEIGHT, rowHeightForFontScale } from '@/components/StoreCard';

describe('rowHeightForFontScale', () => {
  it('uses the base height at default font size (and never shrinks below it)', () => {
    expect(rowHeightForFontScale(1)).toBe(STORE_ROW_HEIGHT);
    expect(rowHeightForFontScale(0.85)).toBe(STORE_ROW_HEIGHT);
  });

  it('grows with larger system font sizes, capped at 200 %', () => {
    const medium = rowHeightForFontScale(1.5);
    const double = rowHeightForFontScale(2);
    expect(medium).toBeGreaterThan(STORE_ROW_HEIGHT);
    expect(double).toBeGreaterThan(medium);
    expect(rowHeightForFontScale(3)).toBe(double);
  });
});
