import { render, type RenderOptions } from '@testing-library/react-native';
import type { ReactElement } from 'react';

import { FavoritesProvider } from '@/context/FavoritesContext';
import { StoreApiProvider } from '@/context/StoreApiContext';
import { createMockStoreApi, type StoreApi } from '@/services/api';
import type { FavoritesStorage } from '@/services/storage/favoritesStorage';
import type { Store } from '@/types/store';

export const createMemoryStorage = (initial: Store[] = []): FavoritesStorage & { saved: Store[][] } => {
  const saved: Store[][] = [];
  return {
    saved,
    load: jest.fn(async () => initial),
    save: jest.fn(async (favorites: readonly Store[]) => {
      saved.push([...favorites]);
    }),
  };
};

interface ProviderOptions extends Omit<RenderOptions, 'wrapper'> {
  api?: StoreApi;
  storage?: FavoritesStorage;
}

export const renderWithProviders = (
  ui: ReactElement,
  { api = createMockStoreApi(), storage = createMemoryStorage(), ...options }: ProviderOptions = {},
) => {
  return render(
    <StoreApiProvider api={api}>
      <FavoritesProvider storage={storage}>{ui}</FavoritesProvider>
    </StoreApiProvider>,
    options,
  );
};
