import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { generateMockStores } from '@/data/mockStores';
import { StoreListScreen } from '@/screens/StoreListScreen';
import { ApiError, createMockStoreApi, type StoreApi } from '@/services/api';
import { makeStore } from '@/test/fixtures';
import { createMemoryStorage, renderWithProviders } from '@/test/renderWithProviders';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, navigate: jest.fn(), replace: jest.fn() }),
}));

describe('StoreListScreen', () => {
  const data = [
    makeStore({ id: 's1', name: 'Épicerie du Port' }),
    makeStore({ id: 's2', name: 'Tech Hub République' }),
    ...generateMockStores(38),
  ];

  beforeEach(() => mockPush.mockClear());

  it('shows a loader, then the first page with the total count', async () => {
    await renderWithProviders(<StoreListScreen />, { api: createMockStoreApi({ data, latencyMs: 500 }) });

    expect(screen.getByLabelText('Chargement des magasins')).toBeOnTheScreen();
    expect(await screen.findByText('40 magasins')).toBeOnTheScreen();
    expect(screen.getByText('Épicerie du Port')).toBeOnTheScreen();
  });

  it('filters by name (accent-insensitive, debounced)', async () => {
    await renderWithProviders(<StoreListScreen />, { api: createMockStoreApi({ data }) });
    await screen.findByText('40 magasins');

    await fireEvent.changeText(screen.getByLabelText('Rechercher un magasin par nom'), 'epicerie du p');

    expect(await screen.findByText('1 magasin pour « epicerie du p »')).toBeOnTheScreen();
    expect(screen.getByText('Épicerie du Port')).toBeOnTheScreen();
    expect(screen.queryByText('Tech Hub République')).toBeNull();
  });

  it('shows an empty state that can clear the search', async () => {
    await renderWithProviders(<StoreListScreen />, { api: createMockStoreApi({ data }) });
    await screen.findByText('40 magasins');

    await fireEvent.changeText(screen.getByLabelText('Rechercher un magasin par nom'), 'zzzz');
    expect(await screen.findByText('Aucun magasin trouvé')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Voir tous les magasins' }));
    expect(await screen.findByText('40 magasins')).toBeOnTheScreen();
  });

  it('loads the next page when the end of the list is reached', async () => {
    const api = createMockStoreApi({ data });
    const spy = jest.spyOn(api, 'fetchStores');
    await renderWithProviders(<StoreListScreen />, { api });
    await screen.findByText('40 magasins');

    await fireEvent(screen.getByTestId('store-list'), 'endReached');

    await waitFor(() => expect(spy).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }), expect.anything()));
  });

  it('displays an error with a working retry button', async () => {
    const real = createMockStoreApi({ data });
    const api: StoreApi = {
      ...real,
      fetchStores: jest
        .fn()
        .mockRejectedValueOnce(new ApiError('network'))
        .mockImplementation((q, s) => real.fetchStores(q, s)),
    };
    await renderWithProviders(<StoreListScreen />, { api });

    expect(await screen.findByText(/Vérifiez votre connexion/)).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Réessayer' }));
    expect(await screen.findByText('40 magasins')).toBeOnTheScreen();
  });

  it('navigates to the detail screen and toggles favourites', async () => {
    const storage = createMemoryStorage();
    await renderWithProviders(<StoreListScreen />, { api: createMockStoreApi({ data }), storage });
    await screen.findByText('40 magasins');

    await fireEvent.press(screen.getByRole('button', { name: /^Épicerie du Port,/ }));
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/store/[id]', params: { id: 's1' } });

    await fireEvent.press(screen.getByRole('button', { name: 'Ajouter Épicerie du Port aux favoris' }));
    expect(screen.getByRole('button', { name: 'Retirer Épicerie du Port des favoris' })).toBeSelected();
    await waitFor(() => expect(storage.saved.at(-1)?.map((s) => s.id)).toEqual(['s1']));
  });
});
