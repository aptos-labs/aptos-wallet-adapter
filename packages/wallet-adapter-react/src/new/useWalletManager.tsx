import { WalletManager } from '@aptos-labs/wallet-adapter-core/new';
import { useContext, useEffect, useState } from 'react';
import { WalletManagerContext } from './WalletManagerContext';

let _defaultWalletManager: WalletManager | undefined;

// Initialize default wallet adapter only if needed
function getDefaultWalletManager() {
  if (!_defaultWalletManager) {
    _defaultWalletManager = new WalletManager();
  }
  return _defaultWalletManager;
}

export function useWalletManager() {
  // If no manager context was provided, return the default wallet manager
  const walletManager = useContext(WalletManagerContext) ?? getDefaultWalletManager();
  const registry = walletManager.registry;

  const [registeredWallets, setRegisteredWallets] = useState(walletManager.registeredWallets);
  const [unregisteredWallets, setUnregisteredWallets] = useState(walletManager.unregisteredWallets);

  useEffect(() => {
    const refreshWallets = () => {
      setRegisteredWallets(walletManager.registeredWallets)
      setUnregisteredWallets(walletManager.unregisteredWallets)
    };
    walletManager.on('register', refreshWallets);
    walletManager.on('unregister', refreshWallets);
    return () => {
      walletManager.off('register', refreshWallets);
      walletManager.off('unregister', refreshWallets);
    };
  }, [walletManager]);

  return {
    unregisteredWallets,
    registeredWallets,
    registry,
  };
}
