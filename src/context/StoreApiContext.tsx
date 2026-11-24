import { createContext, useContext, type PropsWithChildren } from 'react';

import { defaultStoreApi, type StoreApi } from '@/services/api';

const StoreApiContext = createContext<StoreApi>(defaultStoreApi);

export const StoreApiProvider = ({ api, children }: PropsWithChildren<{ api: StoreApi }>) => {
  return <StoreApiContext.Provider value={api}>{children}</StoreApiContext.Provider>;
};

export const useStoreApi = (): StoreApi => {
  return useContext(StoreApiContext);
};
