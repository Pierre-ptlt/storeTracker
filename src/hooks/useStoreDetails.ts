import { useCallback, useEffect, useState } from 'react';

import { useStoreApi } from '@/context/StoreApiContext';
import { isAbortError, toUserMessage } from '@/services/api';
import type { Store } from '@/types/store';

export type StoreDetailsState =
  | { readonly status: 'loading'; readonly store: Store | null }
  | { readonly status: 'success'; readonly store: Store }
  | { readonly status: 'error'; readonly store: Store | null; readonly error: string };

export const useStoreDetails = (id: string, fallback: Store | null = null) => {
  const api = useStoreApi();
  const [state, setState] = useState<StoreDetailsState>({ status: 'loading', store: fallback });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    api
      .fetchStoreById(id, controller.signal)
      .then((store) => setState({ status: 'success', store }))
      .catch((error: unknown) => {
        if (controller.signal.aborted || isAbortError(error)) return;
        setState((prev) => ({ status: 'error', store: prev.store, error: toUserMessage(error) }));
      });

    return () => controller.abort();
  }, [api, id, attempt]);

  const retry = useCallback(() => {
    setState((prev) => ({ status: 'loading', store: prev.store }));
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
};
