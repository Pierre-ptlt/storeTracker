export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface TimeRange {
  readonly open: string;
  readonly close: string;
}

export type OpeningHours = Readonly<Record<Weekday, readonly TimeRange[]>>;

export const STORE_CATEGORIES = [
  'grocery',
  'electronics',
  'fashion',
  'books',
  'sports',
  'home',
] as const;

export type StoreCategory = (typeof STORE_CATEGORIES)[number];

export interface Coordinates {
  readonly latitude: number;
  readonly longitude: number;
}

export interface Store {
  readonly id: string;
  readonly name: string;
  readonly category: StoreCategory;
  readonly address: string;
  readonly postalCode: string;
  readonly city: string;
  readonly phone: string;
  readonly rating: number;
  readonly coordinates: Coordinates;
  readonly openingHours: OpeningHours;
}

export interface StoreQuery {
  readonly search: string;
  readonly page: number;
  readonly pageSize: number;
}

export interface Page<T> {
  readonly items: readonly T[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
  readonly hasMore: boolean;
}
