const DIACRITICS = new RegExp('[\\u0300-\\u036f]', 'g');

export const normalizeForSearch = (value: string): string => {
  return value.normalize('NFD').replace(DIACRITICS, '').toLowerCase().trim();
};

export const matchesSearch = (haystack: string, needle: string): boolean => {
  const normalizedNeedle = normalizeForSearch(needle);
  if (normalizedNeedle === '') return true;
  return normalizeForSearch(haystack).includes(normalizedNeedle);
};
