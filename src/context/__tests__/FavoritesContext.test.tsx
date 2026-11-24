import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';

import { FavoritesProvider, useFavorites } from '@/context/FavoritesContext';
import { favoritesReducer, initialFavoritesState } from '@/context/favoritesReducer';
import { createMemoryStorage } from '@/test/renderWithProviders';
import { makeStore } from '@/test/fixtures';
import type { FavoritesStorage } from '@/services/storage/favoritesStorage';

const a = makeStore({ id: 'a', name: 'A' });
const b = makeStore({ id: 'b', name: 'B' });

const wrapperFor = (storage: FavoritesStorage) => {
  const Wrapper = ({ children }: PropsWithChildren) => <FavoritesProvider storage={storage}>{children}</FavoritesProvider>;
  return Wrapper;
};

describe('FavoritesContext', () => {
  it('hydrates from storage', async () => {
    const storage = createMemoryStorage([a]);
    const { result } = await renderHook(() => useFavorites(), { wrapper: wrapperFor(storage) });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.favorites).toEqual([a]);
    expect(result.current.isFavorite('a')).toBe(true);
  });

  it('toggles and persists favourites (newest first)', async () => {
    const storage = createMemoryStorage([a]);
    const { result } = await renderHook(() => useFavorites(), { wrapper: wrapperFor(storage) });
    await waitFor(() => expect(result.current.status).toBe('ready'));

    await act(async () => result.current.toggleFavorite(b));
    expect(result.current.favorites.map((s) => s.id)).toEqual(['b', 'a']);
    await waitFor(() => expect(storage.saved.at(-1)?.map((s) => s.id)).toEqual(['b', 'a']));

    await act(async () => result.current.toggleFavorite(a));
    await waitFor(() => expect(storage.saved.at(-1)?.map((s) => s.id)).toEqual(['b']));
  });

  it('never overwrites storage with the empty initial state before hydration', async () => {
    let resolveLoad: (value: never[]) => void = () => undefined;
    const storage: FavoritesStorage = {
      load: jest.fn(() => new Promise((resolve) => (resolveLoad = resolve))),
      save: jest.fn(async () => undefined),
    };
    await renderHook(() => useFavorites(), { wrapper: wrapperFor(storage) });
    expect(storage.save).not.toHaveBeenCalled();
    await act(async () => resolveLoad([]));
  });

  it('throws a helpful error outside the provider', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    await expect(renderHook(() => useFavorites())).rejects.toThrow(/FavoritesProvider/);
  });
});

describe('favoritesReducer', () => {
  it('keeps favourites toggled during hydration', () => {
    const toggled = favoritesReducer(initialFavoritesState, { type: 'TOGGLE', store: b });
    const hydrated = favoritesReducer(toggled, { type: 'HYDRATED', favorites: [a, b] });
    expect(hydrated.favorites.map((s) => s.id)).toEqual(['b', 'a']);
  });

  it('stays usable when hydration fails', () => {
    const state = favoritesReducer(initialFavoritesState, { type: 'HYDRATION_FAILED' });
    expect(state.status).toBe('error');
    expect(favoritesReducer(state, { type: 'TOGGLE', store: a }).favorites).toEqual([a]);
  });

  it('removes by id', () => {
    const state = favoritesReducer({ status: 'ready', favorites: [a, b] }, { type: 'REMOVE', id: 'a' });
    expect(state.favorites).toEqual([b]);
  });
});
