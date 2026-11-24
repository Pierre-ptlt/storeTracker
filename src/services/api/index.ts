import { env } from '@/config/env';

import { createHttpStoreApi } from './httpStoreApi';
import { createMockStoreApi } from './mockStoreApi';
import type { StoreApi } from './types';

export { ApiError, isAbortError, toUserMessage } from './errors';
export { createHttpStoreApi } from './httpStoreApi';
export { createMockStoreApi } from './mockStoreApi';
export type { StoreApi } from './types';

export const defaultStoreApi: StoreApi = env.apiUrl
  ? createHttpStoreApi(env.apiUrl)
  : createMockStoreApi({ latencyMs: env.mockLatencyMs, failureRate: env.mockFailureRate });
