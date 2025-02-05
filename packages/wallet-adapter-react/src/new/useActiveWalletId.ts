import { useEffect, useState } from 'react';

const activeWalletIdStorageKey = '@aptos-labs/wallet-adapter/active-wallet';

export function getActiveWalletId() {
  return window.localStorage.getItem(activeWalletIdStorageKey) ?? undefined;
}

export function setActiveWalletId(walletId: string | undefined) {
  if (walletId) {
    window.localStorage.setItem(activeWalletIdStorageKey, walletId);
  } else {
    window.localStorage.removeItem(activeWalletIdStorageKey);
  }
}

export function useActiveWalletId() {
  const [activeWalletId, setActiveWalletId] = useState<string>()
  useEffect(() => {
    setActiveWalletId(getActiveWalletId());
    const onStorageEvent = (event: StorageEvent) => {
      if (event.storageArea === window.localStorage && event.key === activeWalletIdStorageKey) {
        setActiveWalletId(event.newValue ?? undefined);
      }
    };
    window.addEventListener('storage', onStorageEvent);
    return () => window.removeEventListener('storage', onStorageEvent);
  }, []);
  return activeWalletId;
}
