import type { OpeningHours, Page, Store, StoreCategory, TimeRange } from '@/types/store';
import { STORE_CATEGORIES } from '@/types/store';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === 'string';
const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isCategory = (value: unknown): value is StoreCategory =>
  (STORE_CATEGORIES as readonly unknown[]).includes(value);

const isTimeRange = (value: unknown): value is TimeRange => {
  return isRecord(value) && isString(value.open) && isString(value.close);
};

const isOpeningHours = (value: unknown): value is OpeningHours => {
  if (!isRecord(value)) return false;
  return [0, 1, 2, 3, 4, 5, 6].every((day) => {
    const ranges = value[String(day)];
    return Array.isArray(ranges) && ranges.every(isTimeRange);
  });
};

export const isStore = (value: unknown): value is Store => {
  if (!isRecord(value)) return false;
  const { coordinates } = value;
  return (
    isString(value.id) &&
    isString(value.name) &&
    isCategory(value.category) &&
    isString(value.address) &&
    isString(value.postalCode) &&
    isString(value.city) &&
    isString(value.phone) &&
    isFiniteNumber(value.rating) &&
    isRecord(coordinates) &&
    isFiniteNumber(coordinates.latitude) &&
    isFiniteNumber(coordinates.longitude) &&
    isOpeningHours(value.openingHours)
  );
};

export const isPage = <T>(value: unknown, isItem: (item: unknown) => item is T): value is Page<T> => {
  return (
    isRecord(value) &&
    Array.isArray(value.items) &&
    value.items.every(isItem) &&
    isFiniteNumber(value.page) &&
    isFiniteNumber(value.pageSize) &&
    isFiniteNumber(value.total) &&
    typeof value.hasMore === 'boolean'
  );
};
