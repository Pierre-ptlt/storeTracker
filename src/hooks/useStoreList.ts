import { useCallback, useEffect, useReducer, useRef } from 'react';

import { env } from '@/config/env';
import { useStoreApi } from '@/context/StoreApiContext';
import { isAbortError, toUserMessage } from '@/services/api';
import { storeCache } from '@/services/storeCache';

import {
  initialStoreListState,
  storeListReducer,
  type FetchMode,
  type StoreListState,
} from './storeListReducer';

export interface UseStoreListResult extends StoreListState {
  readonly loadMore: () => void;
  readonly refresh: () => void;
  readonly retry: () => void;
}

export const useStoreList = (search: string, pageSize: number = env.pageSize): UseStoreListResult => {
  const api = useStoreApi();
  const [state, dispatch] = useReducer(storeListReducer, initialStoreListState);
  const controllerRef = useRef<AbortController | null>(null);
  const inFlightRef = useRef(false);
  const lastFailedRef = useRef<{ mode: FetchMode; page: number }>({ mode: 'initial', page: 1 });

  const run = useCallback(
    async (mode: FetchMode, page: number) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      inFlightRef.current = true;
      dispatch({ type: 'FETCH_START', mode });

      try {
        const result = await api.fetchStores({ search, page, pageSize }, controller.signal);
        if (controller.signal.aborted) return;
        storeCache.setMany(result.items);
        dispatch({ type: 'FETCH_SUCCESS', mode, page: result });
      } catch (error) {
        if (controller.signal.aborted || isAbortError(error)) return;
        lastFailedRef.current = { mode, page };
        dispatch({ type: 'FETCH_FAILURE', mode, message: toUserMessage(error) });
      } finally {
        if (controllerRef.current === controller) inFlightRef.current = false;
      }
    },
    [api, search, pageSize],
  );

  useEffect(() => {
    void run('initial', 1);
    return () => controllerRef.current?.abort();
  }, [run]);

  const { hasMore, page, stores, inlineError } = state;

  const loadMore = useCallback(() => {
    if (inFlightRef.current || !hasMore || stores.length === 0 || inlineError !== null) return;
    void run('more', page + 1);
  }, [run, hasMore, page, stores.length, inlineError]);

  const refresh = useCallback(() => {
    void run('refresh', 1);
  }, [run]);

  const retry = useCallback(() => {
    const { mode, page: failedPage } = lastFailedRef.current;
    void run(mode, failedPage);
  }, [run]);

  return { ...state, loadMore, refresh, retry };
};
