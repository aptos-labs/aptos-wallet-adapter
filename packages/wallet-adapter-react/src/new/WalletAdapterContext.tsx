import { WalletAdapter, WalletAdapterConfig } from '@aptos-labs/wallet-adapter-core';
import { createContext, PropsWithChildren, useMemo } from 'react';

export const WalletAdapterContext = createContext<WalletAdapter | null>(null);

export interface WalletAdapterProviderProps extends PropsWithChildren {
  config?: WalletAdapterConfig;
}

export function WalletAdapterProvider({ children, config }: WalletAdapterProviderProps) {
  const adapter = useMemo(() => {
    return new WalletAdapter(config);
  }, [config]);

  return <WalletAdapterContext.Provider value={adapter}>{children}</WalletAdapterContext.Provider>
}
