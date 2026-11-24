import type { Store } from '@/types/store';

export type FavoritesStatus = 'loading' | 'ready' | 'error';

export interface FavoritesState {
  readonly status: FavoritesStatus;
  readonly favorites: readonly Store[];
}

export type FavoritesAction =
  | { type: 'HYDRATED'; favorites: readonly Store[] }
  | { type: 'HYDRATION_FAILED' }
  | { type: 'TOGGLE'; store: Store }
  | { type: 'REMOVE'; id: string };

export const initialFavoritesState: FavoritesState = { status: 'loading', favorites: [] };

export const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case 'HYDRATED':
      return { status: 'ready', favorites: mergeById(state.favorites, action.favorites) };
    case 'HYDRATION_FAILED':
      return { ...state, status: 'error' };
    case 'TOGGLE': {
      const exists = state.favorites.some((s) => s.id === action.store.id);
      return {
        ...state,
        favorites: exists
          ? state.favorites.filter((s) => s.id !== action.store.id)
          : [action.store, ...state.favorites],
      };
    }
    case 'REMOVE':
      return { ...state, favorites: state.favorites.filter((s) => s.id !== action.id) };
  }
};

const mergeById = (current: readonly Store[], persisted: readonly Store[]): readonly Store[] => {
  if (current.length === 0) return persisted;
  const ids = new Set(current.map((s) => s.id));
  return [...current, ...persisted.filter((s) => !ids.has(s.id))];
};
