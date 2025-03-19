import { WalletManager, WalletManagerConfig } from '@aptos-labs/wallet-adapter-core/new';
import { createContext, PropsWithChildren, useEffect, useMemo } from 'react';

export const WalletManagerContext = createContext<WalletManager | null>(null);

export interface WalletManagerProviderProps extends PropsWithChildren {
  config?: WalletManagerConfig;
}

export function WalletManagerProvider({ children, config }: WalletManagerProviderProps) {
  const manager = useMemo(() => {
    return new WalletManager(config);
  }, [config]);

  return <WalletManagerContext.Provider value={manager}>{children}</WalletManagerContext.Provider>
}
