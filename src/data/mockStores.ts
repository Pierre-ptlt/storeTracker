import type { OpeningHours, Store, StoreCategory, TimeRange } from '@/types/store';
import { STORE_CATEGORIES } from '@/types/store';

export const MOCK_STORE_COUNT = 120;

const createRandom = (seed: number): () => number => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

interface City {
  readonly name: string;
  readonly postalCode: string;
  readonly latitude: number;
  readonly longitude: number;
}

const CITIES: readonly City[] = [
  { name: 'Paris', postalCode: '75001', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Lyon', postalCode: '69001', latitude: 45.764, longitude: 4.8357 },
  { name: 'Marseille', postalCode: '13001', latitude: 43.2965, longitude: 5.3698 },
  { name: 'Toulouse', postalCode: '31000', latitude: 43.6047, longitude: 1.4442 },
  { name: 'Bordeaux', postalCode: '33000', latitude: 44.8378, longitude: -0.5792 },
  { name: 'Lille', postalCode: '59000', latitude: 50.6292, longitude: 3.0573 },
  { name: 'Nantes', postalCode: '44000', latitude: 47.2184, longitude: -1.5536 },
  { name: 'Strasbourg', postalCode: '67000', latitude: 48.5734, longitude: 7.7521 },
  { name: 'Montpellier', postalCode: '34000', latitude: 43.6108, longitude: 3.8767 },
  { name: 'Rennes', postalCode: '35000', latitude: 48.1173, longitude: -1.6778 },
];

const NAME_PREFIXES: Readonly<Record<StoreCategory, readonly string[]>> = {
  grocery: ['Épicerie', 'Marché', 'Primeur', 'Fromagerie'],
  electronics: ['Tech Hub', 'Pixel Store', 'Électro', 'Gadget Lab'],
  fashion: ['Boutique', 'Atelier Mode', 'Le Dressing', 'Concept Store'],
  books: ['Librairie', 'Bouquinerie', 'Page & Plume', 'Le Comptoir des Livres'],
  sports: ['Sport Center', 'Vélo Shop', 'Outdoor Pro', 'Running Lab'],
  home: ['Maison', 'Déco & Co', 'Le Bricoleur', 'Art de Vivre'],
};

const NAME_SUFFIXES = [
  'du Centre',
  'des Halles',
  'Saint-Michel',
  'de la Gare',
  'République',
  'du Port',
  'Bellecour',
  'des Arts',
  'Victor Hugo',
  'du Marché',
  'Lumière',
  'Jean Jaurès',
] as const;

const STREETS = [
  'rue de la République',
  'avenue Victor Hugo',
  'boulevard Gambetta',
  'rue Nationale',
  'place du Marché',
  'rue Pasteur',
  'avenue Jean Jaurès',
  'rue des Écoles',
  'quai des Arts',
  'rue Voltaire',
] as const;

const pick = <T>(items: readonly T[], random: () => number): T => {
  const item = items[Math.floor(random() * items.length)];
  if (item === undefined) throw new Error('pick() called with an empty list');
  return item;
};

const pad = (n: number): string => n.toString().padStart(2, '0');

const buildOpeningHours = (random: () => number): OpeningHours => {
  const openHour = 8 + Math.floor(random() * 3);
  const closeHour = 18 + Math.floor(random() * 4);
  const hasLunchBreak = random() < 0.35;
  const weekday: readonly TimeRange[] = hasLunchBreak
    ? [
        { open: `${pad(openHour)}:00`, close: '12:30' },
        { open: '14:00', close: `${pad(closeHour)}:00` },
      ]
    : [{ open: `${pad(openHour)}:00`, close: `${pad(closeHour)}:00` }];
  const saturday: readonly TimeRange[] = [{ open: `${pad(openHour + 1)}:00`, close: '19:00' }];
  const sunday: readonly TimeRange[] = random() < 0.3 ? [{ open: '10:00', close: '13:00' }] : [];
  const monday: readonly TimeRange[] = random() < 0.2 ? [] : weekday;

  return { 0: sunday, 1: monday, 2: weekday, 3: weekday, 4: weekday, 5: weekday, 6: saturday };
};

export const generateMockStores = (count: number = MOCK_STORE_COUNT, seed = 42): Store[] => {
  const random = createRandom(seed);
  const stores: Store[] = [];

  for (let i = 0; i < count; i += 1) {
    const category = pick(STORE_CATEGORIES, random);
    const city = pick(CITIES, random);
    const name = `${pick(NAME_PREFIXES[category], random)} ${pick(NAME_SUFFIXES, random)}`;
    const streetNumber = 1 + Math.floor(random() * 150);

    stores.push({
      id: `store-${(i + 1).toString().padStart(3, '0')}`,
      name,
      category,
      address: `${streetNumber} ${pick(STREETS, random)}`,
      postalCode: city.postalCode,
      city: city.name,
      phone: `0${1 + Math.floor(random() * 5)} ${Array.from({ length: 4 }, () => pad(Math.floor(random() * 100))).join(' ')}`,
      rating: Math.round((3 + random() * 2) * 10) / 10,
      coordinates: {
        latitude: city.latitude + (random() - 0.5) * 0.05,
        longitude: city.longitude + (random() - 0.5) * 0.07,
      },
      openingHours: buildOpeningHours(random),
    });
  }

  return stores.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
};

export const MOCK_STORES: readonly Store[] = generateMockStores();
