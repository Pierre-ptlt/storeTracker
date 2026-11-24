import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { FavoritesScreen } from '@/screens/FavoritesScreen';
import { StoreDetailScreen } from '@/screens/StoreDetailScreen';
import { ApiError, createMockStoreApi, type StoreApi } from '@/services/api';
import { storeCache } from '@/services/storeCache';
import { makeStore } from '@/test/fixtures';
import { createMemoryStorage, renderWithProviders } from '@/test/renderWithProviders';

const mockNavigate = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), navigate: mockNavigate, replace: jest.fn() }),
  Stack: { Screen: () => null },
}));

const store = makeStore({ id: 'fav-1', name: 'Vélo Shop du Port' });

describe('FavoritesScreen', () => {
  it('shows an empty state that leads back to the list', async () => {
    await renderWithProviders(<FavoritesScreen />, { storage: createMemoryStorage([]) });
    expect(await screen.findByText("Aucun favori pour l'instant")).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Parcourir les magasins' }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('lists persisted favourites and removes one', async () => {
    const storage = createMemoryStorage([store]);
    await renderWithProviders(<FavoritesScreen />, { storage });

    expect(await screen.findByText('Vélo Shop du Port')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Retirer Vélo Shop du Port des favoris' }));

    expect(await screen.findByText("Aucun favori pour l'instant")).toBeOnTheScreen();
    await waitFor(() => expect(storage.saved.at(-1)).toEqual([]));
  });
});

describe('StoreDetailScreen', () => {
  beforeEach(() => storeCache.clear());

  it('loads and displays store details, map and opening hours', async () => {
    const api = createMockStoreApi({ data: [store], latencyMs: 500 });
    await renderWithProviders(<StoreDetailScreen id="fav-1" />, { api });

    expect(screen.getByLabelText('Chargement du magasin')).toBeOnTheScreen();
    expect(await screen.findByRole('header', { name: 'Vélo Shop du Port' })).toBeOnTheScreen();
    expect(screen.getByTestId('store-map')).toBeOnTheScreen();
    expect(screen.getByText('Lundi')).toBeOnTheScreen();
    expect(screen.getByText('12 rue de la République, 69001 Lyon')).toBeOnTheScreen();
  });

  it('adds the store to favourites from the detail screen', async () => {
    const storage = createMemoryStorage();
    await renderWithProviders(<StoreDetailScreen id="fav-1" />, {
      api: createMockStoreApi({ data: [store] }),
      storage,
    });

    await fireEvent.press(await screen.findByRole('button', { name: 'Ajouter Vélo Shop du Port aux favoris' }));
    expect(screen.getByText('Dans vos favoris')).toBeOnTheScreen();
    await waitFor(() => expect(storage.saved.at(-1)?.map((s) => s.id)).toEqual(['fav-1']));
  });

  it('shows a not-found error with retry', async () => {
    await renderWithProviders(<StoreDetailScreen id="missing" />, { api: createMockStoreApi({ data: [] }) });
    expect(await screen.findByText(/n'existe pas/)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeOnTheScreen();
  });

  it('keeps showing cached data when the refresh fails', async () => {
    storeCache.setMany([store]);
    const api: StoreApi = {
      fetchStores: jest.fn(),
      fetchStoreById: jest.fn().mockRejectedValue(new ApiError('network')),
    };
    await renderWithProviders(<StoreDetailScreen id="fav-1" />, { api });

    expect(screen.getByRole('header', { name: 'Vélo Shop du Port' })).toBeOnTheScreen();
    expect(await screen.findByText(/Données possiblement obsolètes/)).toBeOnTheScreen();
  });
});
