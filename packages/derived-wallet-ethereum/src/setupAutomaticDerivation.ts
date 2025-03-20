import { getWallets } from '@wallet-standard/app';
import { createStore } from 'mipd';
import { EIP6963ProviderDetail } from 'mipd/src/types';
import { EIP1193DerivedWallet, EIP1193DerivedWalletOptions } from './EIP1193DerivedWallet';

export function setupAutomaticEthereumWalletDerivation(options: EIP1193DerivedWalletOptions = {}) {
  const walletsApi = getWallets();
  const eip6963Store = createStore();

  type UnsubscribeCallback = () => void;
  let registrations: { [name: string]: UnsubscribeCallback } = {};

  const deriveAndRegisterWallet = (detail: EIP6963ProviderDetail) => {
    const derivedWallet = new EIP1193DerivedWallet(detail, options);
    registrations[detail.info.rdns] = walletsApi.register(derivedWallet);
  };

  const initialProviders = eip6963Store.getProviders();
  for (const detail of initialProviders) {
    deriveAndRegisterWallet(detail);
  }

  eip6963Store.subscribe((details) => {
    for (const detail of details) {
      deriveAndRegisterWallet(detail);
    }
  });

  return () => {
    eip6963Store.destroy();
    for (const unregisterWallet of Object.values(registrations)) {
      unregisterWallet();
    }
  };
}
