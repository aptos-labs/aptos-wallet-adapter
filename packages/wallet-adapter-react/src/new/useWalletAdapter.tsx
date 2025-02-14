import { WalletAdapter } from '@aptos-labs/wallet-adapter-core/new';
import { useContext } from 'react';
import { WalletAdapterContext } from './WalletAdapterContext';

let _defaultWalletAdapter: WalletAdapter | undefined;

// Initialize default wallet adapter only if needed
function getDefaultWalletAdapter() {
  if (!_defaultWalletAdapter) {
    _defaultWalletAdapter = new WalletAdapter();
  }
  return _defaultWalletAdapter;
}

export function useWalletAdapter() {
  const walletAdapter = useContext(WalletAdapterContext);

  // If no adapter context was provided, return the default wallet adapter
  return walletAdapter ?? getDefaultWalletAdapter();
}
