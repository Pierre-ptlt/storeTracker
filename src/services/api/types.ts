import type { Page, Store, StoreQuery } from '@/types/store';

export interface StoreApi {
  fetchStores(query: StoreQuery, signal?: AbortSignal): Promise<Page<Store>>;
  fetchStoreById(id: string, signal?: AbortSignal): Promise<Store>;
}
