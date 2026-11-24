import type { Page, Store, StoreQuery } from '@/types/store';
import { isPage, isStore } from '@/utils/guards';

import { ApiError, isAbortError } from './errors';
import type { StoreApi } from './types';

export const createHttpStoreApi = (baseUrl: string, fetchImpl: typeof fetch = fetch): StoreApi => {
  const getJson = async (path: string, signal?: AbortSignal): Promise<unknown> => {
    let response: Response;
    try {
      response = await fetchImpl(`${baseUrl}${path}`, {
        headers: { Accept: 'application/json' },
        signal,
      });
    } catch (error) {
      if (isAbortError(error)) throw error;
      throw new ApiError('network');
    }
    if (response.status === 404) throw new ApiError('not_found');
    if (!response.ok) throw new ApiError('server', `HTTP ${response.status}`);
    try {
      return await response.json();
    } catch {
      throw new ApiError('invalid_response');
    }
  };

  return {
    fetchStores: async ({ search, page, pageSize }: StoreQuery, signal?: AbortSignal): Promise<Page<Store>> => {
      const params = new URLSearchParams({ search, page: String(page), pageSize: String(pageSize) });
      const body = await getJson(`/stores?${params.toString()}`, signal);
      if (!isPage(body, isStore)) throw new ApiError('invalid_response');
      return body;
    },

    fetchStoreById: async (id: string, signal?: AbortSignal): Promise<Store> => {
      const body = await getJson(`/stores/${encodeURIComponent(id)}`, signal);
      if (!isStore(body)) throw new ApiError('invalid_response');
      return body;
    },
  };
};
