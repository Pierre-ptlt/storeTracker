import { MOCK_STORES } from '@/data/mockStores';
import type { Page, Store, StoreQuery } from '@/types/store';
import { matchesSearch } from '@/utils/text';

import { ApiError, createAbortError } from './errors';
import type { StoreApi } from './types';

export interface MockStoreApiOptions {
  readonly data?: readonly Store[];
  readonly latencyMs?: number;
  readonly failureRate?: number;
  readonly random?: () => number;
}

const delay = (ms: number, signal?: AbortSignal): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(createAbortError());
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
};

export const createMockStoreApi = (options: MockStoreApiOptions = {}): StoreApi => {
  const { data = MOCK_STORES, latencyMs = 0, failureRate = 0, random = Math.random } = options;

  const simulateNetwork = async (signal?: AbortSignal): Promise<void> => {
    await delay(latencyMs, signal);
    if (failureRate > 0 && random() < failureRate) {
      throw new ApiError('network', 'Simulated network failure');
    }
  };

  return {
    fetchStores: async ({ search, page, pageSize }: StoreQuery, signal?: AbortSignal): Promise<Page<Store>> => {
      await simulateNetwork(signal);
      const filtered = data.filter((store) => matchesSearch(store.name, search));
      const start = (page - 1) * pageSize;
      const items = filtered.slice(start, start + pageSize);
      return {
        items,
        page,
        pageSize,
        total: filtered.length,
        hasMore: start + items.length < filtered.length,
      };
    },

    fetchStoreById: async (id: string, signal?: AbortSignal): Promise<Store> => {
      await simulateNetwork(signal);
      const store = data.find((s) => s.id === id);
      if (!store) throw new ApiError('not_found', `Store ${id} not found`);
      return store;
    },
  };
};
