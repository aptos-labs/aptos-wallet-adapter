import { getWallets } from '@aptos-labs/wallet-standard';
import { type AptosStandardWallet, isAptosStandardWallet } from './AptosStandardWallet';
import { AdaptedWallet } from './AdaptedWallet';

export type WalletChangeCallback = (wallet: AdaptedWallet) => unknown;

export interface AptosWallets {
  get: () => AdaptedWallet[];
  on: (eventName: 'register' | 'unregister', callback: WalletChangeCallback) => () => void;
}

/**
 * Cached Aptos Wallets API
 */
let aptosWallets: AptosWallets | undefined;

/**
 * Get the Aptos Wallets API for retrieving registered Aptos wallets, and listening to registration changes.
 *
 * The design of this interface follows the generic Wallets API from the Wallet Standard.
 * The API is lazily loaded and cached to prevent unnecessary extra listeners.
 */
export function getAptosWallets(): AptosWallets {
  if (aptosWallets) {
    return aptosWallets;
  }

  // API state
  const registered = new Map<AptosStandardWallet, AdaptedWallet>;
  const onRegisterCallbacks = new Set<WalletChangeCallback>;
  const onUnregisterCallbacks = new Set<WalletChangeCallback>;

  const genericApi = getWallets();

  // Initialize registered wallets
  for (const wallet of genericApi.get()) {
    if (isAptosStandardWallet(wallet)) {
      const adaptedWallet = new AdaptedWallet(wallet);
      registered.set(wallet, adaptedWallet);
    }
  }

  // Listen to registration changes and keep the registered wallets up to date
  genericApi.on('register', (...wallets) => {
    for (const wallet of wallets) {
      if (isAptosStandardWallet(wallet)) {
        const adaptedWallet = new AdaptedWallet(wallet);
        registered.set(wallet, adaptedWallet);
        onRegisterCallbacks.forEach((listener) => listener(adaptedWallet));
      }
    }
  });
  genericApi.on('unregister', (...wallets) => {
    for (const wallet of wallets) {
      if (isAptosStandardWallet(wallet)) {
        const adaptedWallet = registered.get(wallet);
        if (adaptedWallet) {
          registered.delete(wallet);
          onUnregisterCallbacks.forEach((listener) => listener(adaptedWallet));
        }
      }
    }
  });

  const get = () => [...registered.values()];

  const on = (
    eventName: 'register' | 'unregister',
    callback: WalletChangeCallback,
  ) => {
    const callbacks = eventName === 'register'
      ? onRegisterCallbacks
      : onUnregisterCallbacks;
    callbacks.add(callback);
    return () => void callbacks.delete(callback);
  }

  aptosWallets = { get, on };
  return aptosWallets;
}
