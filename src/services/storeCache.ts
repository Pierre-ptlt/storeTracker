import type { Store } from '@/types/store';

const cache = new Map<string, Store>();

export const storeCache = {
  get: (id: string): Store | undefined => cache.get(id),
  setMany: (stores: readonly Store[]): void => {
    for (const store of stores) cache.set(store.id, store);
  },
  clear: (): void => cache.clear(),
};
