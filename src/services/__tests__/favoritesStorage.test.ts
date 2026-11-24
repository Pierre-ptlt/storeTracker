import AsyncStorage from '@react-native-async-storage/async-storage';

import { FAVORITES_STORAGE_KEY, favoritesStorage } from '@/services/storage/favoritesStorage';
import { makeStore } from '@/test/fixtures';

describe('favoritesStorage (AsyncStorage)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('returns an empty list when nothing is stored', async () => {
    await expect(favoritesStorage.load()).resolves.toEqual([]);
  });

  it('round-trips favourites', async () => {
    const stores = [makeStore({ id: 'a' }), makeStore({ id: 'b' })];
    await favoritesStorage.save(stores);
    await expect(favoritesStorage.load()).resolves.toEqual(stores);
  });

  it('survives corrupted JSON', async () => {
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, '{not json');
    await expect(favoritesStorage.load()).resolves.toEqual([]);
  });

  it('drops entries that do not match the Store schema', async () => {
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([makeStore(), { id: 'broken' }]));
    const loaded = await favoritesStorage.load();
    expect(loaded).toHaveLength(1);
  });
});
