import { useEffect, useState } from 'react';

const activeWalletIdStorageKey = '@aptos-labs/wallet-adapter/active-wallet';

// Storage events are only triggered when a change occurs in a different window,
// so we need to keep track of local changes too.
const localChangeListeners = new Set<(newValue: string | undefined) => unknown>;

export function getActiveWalletId() {
  return window.localStorage.getItem(activeWalletIdStorageKey) ?? undefined;
}

export function setActiveWalletId(walletId: string | undefined) {
  if (walletId) {
    window.localStorage.setItem(activeWalletIdStorageKey, walletId);
  } else {
    window.localStorage.removeItem(activeWalletIdStorageKey);
  }
  for (const listener of localChangeListeners) {
    listener(walletId);
  }
}

export function useActiveWalletId() {
  const [activeWalletId, setActiveWalletId] = useState<string>()
  useEffect(() => {
    setActiveWalletId(getActiveWalletId());

    // Listen for changes that are external from the current window
    const onStorageExternalChange = (event: StorageEvent) => {
      if (event.storageArea === window.localStorage && event.key === activeWalletIdStorageKey) {
        setActiveWalletId(event.newValue ?? undefined);
      }
    };
    window.addEventListener('storage', onStorageExternalChange);

    // Listen for changes within the current window
    const onLocalChange = (newValue: string | undefined) => {
      setActiveWalletId(newValue);
    };
    localChangeListeners.add(onLocalChange);

    return () => {
      window.removeEventListener('storage', onStorageExternalChange);
      localChangeListeners.delete(onLocalChange)
    };
  }, []);
  return activeWalletId;
}
