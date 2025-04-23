import {
  isWalletAdapterCompatibleStandardWallet,
  WalletAdapterCompatibleStandardWallet,
} from "@solana/wallet-adapter-base";
import { StandardWalletAdapter } from "@solana/wallet-standard-wallet-adapter-base";
import { getWallets } from '@wallet-standard/app';
import { SolanaDerivedWallet, SolanaDomainWalletOptions } from './SolanaDerivedWallet';

export function setupAutomaticSolanaWalletDerivation(options: SolanaDomainWalletOptions = {}) {
  const api = getWallets();

  type UnsubscribeCallback = () => void;
  let registrations: { [name: string]: UnsubscribeCallback } = {};

  const isWhitelisted = (wallet: WalletAdapterCompatibleStandardWallet) => {
    // For now, we whitelist all wallets
    return true;
  };

  const deriveAndRegisterWallet = (wallet: WalletAdapterCompatibleStandardWallet) => {
    const adapter = new StandardWalletAdapter({ wallet });
    const derivedWallet = new SolanaDerivedWallet(adapter, options);
    registrations[wallet.name] = api.register(derivedWallet);
  };

  for (const wallet of api.get()) {
    if (isWalletAdapterCompatibleStandardWallet(wallet) && isWhitelisted(wallet)) {
      deriveAndRegisterWallet(wallet);
    }
  }

  const offRegister = api.on('register', (wallet) => {
    if (isWalletAdapterCompatibleStandardWallet(wallet) && isWhitelisted(wallet)) {
      deriveAndRegisterWallet(wallet);
    }
  });

  const offUnregister = api.on('unregister', (wallet) => {
    if (isWalletAdapterCompatibleStandardWallet(wallet)) {
      const unregisterWallet = registrations[wallet.name];
      if (unregisterWallet) {
        unregisterWallet();
        delete registrations[wallet.name];
      }
    }
  });

  return () => {
    offRegister();
    offUnregister();
    for (const unregisterWallet of Object.values(registrations)) {
      unregisterWallet();
    }
  };
}
