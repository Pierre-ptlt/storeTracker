import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Store } from '@/types/store';
import { isStore } from '@/utils/guards';

export const FAVORITES_STORAGE_KEY = 'storetracker:favorites:v1';

export interface FavoritesStorage {
  load(): Promise<Store[]>;
  save(favorites: readonly Store[]): Promise<void>;
}

export const favoritesStorage: FavoritesStorage = {
  load: async () => {
    const raw = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    if (raw === null) return [];
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return [];
    }
    return Array.isArray(parsed) ? parsed.filter(isStore) : [];
  },

  save: async (favorites) => {
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  },
};
