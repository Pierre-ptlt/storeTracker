import { initialStoreListState, storeListReducer, type StoreListState } from '@/hooks/storeListReducer';
import { makeStore } from '@/test/fixtures';
import type { Page, Store } from '@/types/store';

const page = (items: Store[], n: number, hasMore: boolean): Page<Store> => ({
  items,
  page: n,
  pageSize: items.length,
  total: 99,
  hasMore,
});

const a = makeStore({ id: 'a' });
const b = makeStore({ id: 'b' });
const c = makeStore({ id: 'c' });

describe('storeListReducer', () => {
  const loaded: StoreListState = storeListReducer(initialStoreListState, {
    type: 'FETCH_SUCCESS',
    mode: 'initial',
    page: page([a, b], 1, true),
  });

  it('stores the first page', () => {
    expect(loaded).toMatchObject({ status: 'idle', page: 1, hasMore: true, total: 99 });
    expect(loaded.stores).toEqual([a, b]);
  });

  it('resets everything when a new search starts', () => {
    const next = storeListReducer(loaded, { type: 'FETCH_START', mode: 'initial' });
    expect(next.status).toBe('loading');
    expect(next.stores).toEqual([]);
  });

  it('keeps items while loading more and appends without duplicates', () => {
    const loading = storeListReducer(loaded, { type: 'FETCH_START', mode: 'more' });
    expect(loading.status).toBe('loadingMore');
    expect(loading.stores).toHaveLength(2);

    const next = storeListReducer(loading, { type: 'FETCH_SUCCESS', mode: 'more', page: page([b, c], 2, false) });
    expect(next.stores.map((s) => s.id)).toEqual(['a', 'b', 'c']);
    expect(next.hasMore).toBe(false);
  });

  it('replaces items on refresh', () => {
    const next = storeListReducer(loaded, { type: 'FETCH_SUCCESS', mode: 'refresh', page: page([c], 1, true) });
    expect(next.stores).toEqual([c]);
  });

  it('uses a blocking error when nothing is displayed', () => {
    const next = storeListReducer(initialStoreListState, { type: 'FETCH_FAILURE', mode: 'initial', message: 'KO' });
    expect(next).toMatchObject({ status: 'error', error: 'KO', inlineError: null });
  });

  it('uses an inline error (and keeps the list) when a next page fails', () => {
    const next = storeListReducer(loaded, { type: 'FETCH_FAILURE', mode: 'more', message: 'KO' });
    expect(next).toMatchObject({ status: 'idle', error: null, inlineError: 'KO' });
    expect(next.stores).toHaveLength(2);
  });
});
