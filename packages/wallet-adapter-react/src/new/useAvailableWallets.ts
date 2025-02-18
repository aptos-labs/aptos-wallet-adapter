import { useEffect, useState } from 'react';
import { useWalletAdapter } from './useWalletAdapter';

export function useAvailableWallets() {
  const adapter = useWalletAdapter();

  const [availableWallets, setAvailableWallets] = useState(adapter.availableWallets);
  useEffect(() => {
    const refreshAvailableWallets = () => {
      setAvailableWallets(adapter.availableWallets);
    };

    adapter.on('register', refreshAvailableWallets);
    adapter.on('unregister', refreshAvailableWallets);

    return () => {
      adapter.off('register', refreshAvailableWallets);
      adapter.off('unregister', refreshAvailableWallets);
    };
  }, [adapter]);

  return availableWallets;
}
