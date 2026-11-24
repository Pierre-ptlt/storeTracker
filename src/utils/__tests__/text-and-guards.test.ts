import { __testing } from '@/config/env';
import { MOCK_STORES, generateMockStores } from '@/data/mockStores';
import { makeStore } from '@/test/fixtures';
import { isPage, isStore } from '@/utils/guards';
import { matchesSearch, normalizeForSearch } from '@/utils/text';

describe('text utils', () => {
  it('normalises accents and case', () => {
    expect(normalizeForSearch('  Épicerie ')).toBe('epicerie');
  });

  it('matches regardless of accents, case, and treats empty search as a match', () => {
    expect(matchesSearch('Épicerie du Port', 'EPIC')).toBe(true);
    expect(matchesSearch('Tech Hub', 'libr')).toBe(false);
    expect(matchesSearch('Tech Hub', '   ')).toBe(true);
  });
});

describe('type guards', () => {
  it('accepts a valid store, including after a JSON round-trip', () => {
    const store = makeStore();
    expect(isStore(store)).toBe(true);
    expect(isStore(JSON.parse(JSON.stringify(store)))).toBe(true);
  });

  it.each([
    ['null', null],
    ['missing name', { ...makeStore(), name: undefined }],
    ['unknown category', { ...makeStore(), category: 'cars' }],
    ['bad coordinates', { ...makeStore(), coordinates: { latitude: 'x', longitude: 1 } }],
    ['bad hours', { ...makeStore(), openingHours: { 0: 'closed' } }],
  ])('rejects %s', (_, value) => {
    expect(isStore(value)).toBe(false);
  });

  it('validates pages', () => {
    const page = { items: [makeStore()], page: 1, pageSize: 10, total: 1, hasMore: false };
    expect(isPage(page, isStore)).toBe(true);
    expect(isPage({ ...page, items: [{}] }, isStore)).toBe(false);
  });
});

describe('mock data', () => {
  it('provides at least 50 valid, uniquely-identified stores', () => {
    expect(MOCK_STORES.length).toBeGreaterThanOrEqual(50);
    expect(MOCK_STORES.every(isStore)).toBe(true);
    expect(new Set(MOCK_STORES.map((s) => s.id)).size).toBe(MOCK_STORES.length);
  });

  it('is deterministic for a given seed', () => {
    expect(generateMockStores(10, 7)).toEqual(generateMockStores(10, 7));
  });
});

describe('env parsing', () => {
  const { parseNumber, parseUrl } = __testing;

  it('falls back on missing/invalid numbers and clamps the range', () => {
    expect(parseNumber(undefined, 15, 5, 100)).toBe(15);
    expect(parseNumber('abc', 15, 5, 100)).toBe(15);
    expect(parseNumber('1000', 15, 5, 100)).toBe(100);
    expect(parseNumber('20', 15, 5, 100)).toBe(20);
  });

  it('normalises the API url', () => {
    expect(parseUrl('')).toBeNull();
    expect(parseUrl(' https://api.test/v1/ ')).toBe('https://api.test/v1');
  });
});
