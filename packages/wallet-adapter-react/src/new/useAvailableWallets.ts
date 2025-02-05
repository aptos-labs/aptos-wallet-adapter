import { getAptosWallets } from '@aptos-labs/wallet-adapter-core';
import { useEffect, useState } from 'react';

export function useAvailableWallets() {
  const aptosWallets = getAptosWallets();

  const [availableWallets, setAvailableWallets] = useState(aptosWallets.get());
  useEffect(() => {
    const refreshAvailableWallets = () => {
      setAvailableWallets(aptosWallets.get());
    };
    const unsubscribeOnRegister = aptosWallets.on('register', refreshAvailableWallets);
    const unsubscribeOnUnregister = aptosWallets.on('unregister', refreshAvailableWallets);
    return () => {
      unsubscribeOnRegister();
      unsubscribeOnUnregister();
    };
  }, [aptosWallets]);

  return availableWallets;
}
