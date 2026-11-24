import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';

import { StoreApiProvider } from '@/context/StoreApiContext';
import { generateMockStores } from '@/data/mockStores';
import { useStoreList } from '@/hooks/useStoreList';
import { ApiError, createMockStoreApi, type StoreApi } from '@/services/api';
import { makeStore } from '@/test/fixtures';
import type { Page, Store } from '@/types/store';

const wrapperFor = (api: StoreApi) => {
  const Wrapper = ({ children }: PropsWithChildren) => <StoreApiProvider api={api}>{children}</StoreApiProvider>;
  return Wrapper;
};

describe('useStoreList', () => {
  const data = generateMockStores(25);

  it('loads the first page then more pages until the end', async () => {
    const api = createMockStoreApi({ data });
    const { result } = await renderHook(() => useStoreList('', 10), { wrapper: wrapperFor(api) });

    await waitFor(() => expect(result.current.status).toBe('idle'));
    expect(result.current.stores).toHaveLength(10);

    await act(async () => result.current.loadMore());
    await waitFor(() => expect(result.current.stores).toHaveLength(20));

    await act(async () => result.current.loadMore());
    await waitFor(() => expect(result.current.stores).toHaveLength(25));
    expect(result.current.hasMore).toBe(false);
  });

  it('ignores loadMore calls while a request is in flight', async () => {
    const api = createMockStoreApi({ data });
    const spy = jest.spyOn(api, 'fetchStores');
    const { result } = await renderHook(() => useStoreList('', 10), { wrapper: wrapperFor(api) });
    await waitFor(() => expect(result.current.status).toBe('idle'));

    await act(async () => {
      result.current.loadMore();
      result.current.loadMore();
      result.current.loadMore();
    });
    await waitFor(() => expect(result.current.stores).toHaveLength(20));
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('drops a stale response that resolves after a newer search (race condition)', async () => {
    const pending: Record<string, (page: Page<Store>) => void> = {};
    const api: StoreApi = {
      fetchStores: ({ search }) => new Promise((resolve) => (pending[search] = resolve)),
      fetchStoreById: jest.fn(),
    };
    const pageOf = (name: string): Page<Store> => ({
      items: [makeStore({ id: name, name })],
      page: 1,
      pageSize: 10,
      total: 1,
      hasMore: false,
    });

    const { result, rerender } = await renderHook(({ q }: { q: string }) => useStoreList(q, 10), {
      wrapper: wrapperFor(api),
      initialProps: { q: 'ab' },
    });
    await rerender({ q: 'abc' });

    await act(async () => pending.abc?.(pageOf('abc')));
    await act(async () => pending.ab?.(pageOf('ab')));

    expect(result.current.stores.map((s) => s.name)).toEqual(['abc']);
  });

  it('exposes a user-facing error and recovers on retry', async () => {
    const real = createMockStoreApi({ data });
    const api: StoreApi = {
      ...real,
      fetchStores: jest
        .fn()
        .mockRejectedValueOnce(new ApiError('network'))
        .mockImplementation((q, s) => real.fetchStores(q, s)),
    };
    const { result } = await renderHook(() => useStoreList('', 10), { wrapper: wrapperFor(api) });

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error).toMatch(/connexion/);

    await act(async () => result.current.retry());
    await waitFor(() => expect(result.current.stores).toHaveLength(10));
    expect(result.current.error).toBeNull();
  });
});
