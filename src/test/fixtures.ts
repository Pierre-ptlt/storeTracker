import type { OpeningHours, Store } from '@/types/store';

export const WEEKDAY_HOURS: OpeningHours = {
  0: [],
  1: [{ open: '09:00', close: '19:00' }],
  2: [{ open: '09:00', close: '19:00' }],
  3: [
    { open: '09:00', close: '12:30' },
    { open: '14:00', close: '19:00' },
  ],
  4: [{ open: '09:00', close: '19:00' }],
  5: [{ open: '09:00', close: '19:00' }],
  6: [{ open: '10:00', close: '18:00' }],
};

export const makeStore = (overrides: Partial<Store> = {}): Store => {
  return {
    id: 'store-001',
    name: 'Librairie du Centre',
    category: 'books',
    address: '12 rue de la République',
    postalCode: '69001',
    city: 'Lyon',
    phone: '04 12 34 56 78',
    rating: 4.5,
    coordinates: { latitude: 45.76, longitude: 4.83 },
    openingHours: WEEKDAY_HOURS,
    ...overrides,
  };
};

export const wednesdayAt = (hours: number, minutes = 0): Date => {
  return new Date(2026, 10, 25, hours, minutes);
};
