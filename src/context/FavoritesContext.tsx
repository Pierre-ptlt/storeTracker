import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type PropsWithChildren,
} from 'react';

import { favoritesStorage, type FavoritesStorage } from '@/services/storage/favoritesStorage';
import type { Store } from '@/types/store';

import { favoritesReducer, initialFavoritesState, type FavoritesStatus } from './favoritesReducer';

export interface FavoritesContextValue {
  readonly status: FavoritesStatus;
  readonly favorites: readonly Store[];
  readonly favoriteIds: ReadonlySet<string>;
  readonly isFavorite: (id: string) => boolean;
  readonly toggleFavorite: (store: Store) => void;
  readonly removeFavorite: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

interface FavoritesProviderProps {
  readonly storage?: FavoritesStorage;
}

export const FavoritesProvider = ({
  children,
  storage = favoritesStorage,
}: PropsWithChildren<FavoritesProviderProps>) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialFavoritesState);
  const hasHydrated = useRef(false);

  useEffect(() => {
    let cancelled = false;
    storage
      .load()
      .then((favorites) => {
        if (!cancelled) dispatch({ type: 'HYDRATED', favorites });
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: 'HYDRATION_FAILED' });
      });
    return () => {
      cancelled = true;
    };
  }, [storage]);

  useEffect(() => {
    if (state.status === 'loading') return;
    if (!hasHydrated.current) {
      hasHydrated.current = true;
      if (state.status === 'error') return;
    }
    storage.save(state.favorites).catch(() => undefined);
  }, [state.favorites, state.status, storage]);

  const toggleFavorite = useCallback((store: Store) => dispatch({ type: 'TOGGLE', store }), []);
  const removeFavorite = useCallback((id: string) => dispatch({ type: 'REMOVE', id }), []);

  const favoriteIds = useMemo(() => new Set(state.favorites.map((s) => s.id)), [state.favorites]);
  const isFavorite = useCallback((id: string) => favoriteIds.has(id), [favoriteIds]);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      status: state.status,
      favorites: state.favorites,
      favoriteIds,
      isFavorite,
      toggleFavorite,
      removeFavorite,
    }),
    [state.status, state.favorites, favoriteIds, isFavorite, toggleFavorite, removeFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = (): FavoritesContextValue => {
  const context = useContext(FavoritesContext);
  if (context === null) {
    throw new Error('useFavorites must be used within a <FavoritesProvider>');
  }
  return context;
};
