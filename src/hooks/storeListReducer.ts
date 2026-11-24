import type { Page, Store } from '@/types/store';

export type FetchMode = 'initial' | 'refresh' | 'more';

export type StoreListStatus = 'loading' | 'refreshing' | 'loadingMore' | 'idle' | 'error';

export interface StoreListState {
  readonly status: StoreListStatus;
  readonly stores: readonly Store[];
  readonly page: number;
  readonly total: number;
  readonly hasMore: boolean;
  readonly error: string | null;
  readonly inlineError: string | null;
}

export type StoreListAction =
  | { type: 'FETCH_START'; mode: FetchMode }
  | { type: 'FETCH_SUCCESS'; mode: FetchMode; page: Page<Store> }
  | { type: 'FETCH_FAILURE'; mode: FetchMode; message: string };

export const initialStoreListState: StoreListState = {
  status: 'loading',
  stores: [],
  page: 0,
  total: 0,
  hasMore: true,
  error: null,
  inlineError: null,
};

const STATUS_BY_MODE: Readonly<Record<FetchMode, StoreListStatus>> = {
  initial: 'loading',
  refresh: 'refreshing',
  more: 'loadingMore',
};

export const storeListReducer = (state: StoreListState, action: StoreListAction): StoreListState => {
  switch (action.type) {
    case 'FETCH_START':
      return action.mode === 'initial'
        ? { ...initialStoreListState, status: 'loading' }
        : { ...state, status: STATUS_BY_MODE[action.mode], inlineError: null };

    case 'FETCH_SUCCESS': {
      const { page } = action;
      const stores = action.mode === 'more' ? appendUnique(state.stores, page.items) : page.items;
      return {
        status: 'idle',
        stores,
        page: page.page,
        total: page.total,
        hasMore: page.hasMore,
        error: null,
        inlineError: null,
      };
    }

    case 'FETCH_FAILURE':
      if (action.mode === 'initial' || state.stores.length === 0) {
        return { ...state, status: 'error', error: action.message, inlineError: null };
      }
      return { ...state, status: 'idle', inlineError: action.message };
  }
};

const appendUnique = (current: readonly Store[], next: readonly Store[]): readonly Store[] => {
  const ids = new Set(current.map((s) => s.id));
  return [...current, ...next.filter((s) => !ids.has(s.id))];
};
