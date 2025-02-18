import { getWallets } from '@aptos-labs/wallet-standard';
import { type AptosStandardWallet, isAptosStandardWallet } from './AptosStandardWallet';
import { AdaptedWallet } from './AdaptedWallet';

// Use a finalization registry to enable cleanup callbacks (closest things to destructors).
type CleanupCallback = () => void;
const supportsFinalizationRegistry = typeof FinalizationRegistry !== 'undefined';
const finalizationRegistry = supportsFinalizationRegistry
  ? new FinalizationRegistry<CleanupCallback>((cleanup) => cleanup())
  : undefined;

export type AdaptedWalletEventCallback = (wallet: AdaptedWallet) => unknown;
export type UnsubscribeCallback = () => void;

export interface WalletAdapterConfig {
  disableTelemetry?: boolean;
  whitelist?: string[];
  blacklist?: string[];
}

export class WalletAdapter {
  private readonly registeredWallets = new Map<AptosStandardWallet, AdaptedWallet>;
  private readonly onRegisterListeners = new Set<AdaptedWalletEventCallback>;
  private readonly onUnregisterListeners = new Set<AdaptedWalletEventCallback>;

  constructor(config: WalletAdapterConfig = {}) {
    const api = getWallets();

    const { disableTelemetry, whitelist, blacklist } = config;
    const adaptedWalletConfig = { disableTelemetry };

    // Use local references so that cleanup callback doesn't bind to `this`
    const registeredWallets = this.registeredWallets;
    const onRegisterListeners = this.onRegisterListeners;
    const onUnregisterListeners = this.onUnregisterListeners;

    for (const wallet of api.get()) {
      if (isAptosStandardWallet(wallet)) {
        registeredWallets.set(wallet, new AdaptedWallet(wallet, adaptedWalletConfig));
      }
    }

    const offRegister = api.on('register', (...wallets) => {
      for (const wallet of wallets) {
        const whitelisted = whitelist?.includes(wallet.name) ?? true;
        const blacklisted = blacklist?.includes(wallet.name) ?? false;
        if (isAptosStandardWallet(wallet) && whitelisted && !blacklisted) {
          const adaptedWallet = new AdaptedWallet(wallet, adaptedWalletConfig);
          registeredWallets.set(wallet, adaptedWallet);
          for (const callback of onRegisterListeners) {
            callback(adaptedWallet);
          }
        }
      }
    });

    const offUnregister = api.on('unregister', (...wallets) => {
      for (const wallet of wallets) {
        if (isAptosStandardWallet(wallet)) {
          const adaptedWallet = registeredWallets.get(wallet);
          if (adaptedWallet) {
            registeredWallets.delete(wallet);
            for (const callback of onUnregisterListeners) {
              callback(adaptedWallet);
            }
          }
        }
      }
    });

    const cleanupCallback: CleanupCallback = () => {
      offRegister();
      offUnregister();
    };

    // Remove event listeners when this instance is garbage collected
    finalizationRegistry?.register(this, cleanupCallback);
  }

  get availableWallets() {
    return [...this.registeredWallets.values()];
  }

  // region Event handlers

  private onRegister(callback: AdaptedWalletEventCallback): UnsubscribeCallback {
    this.onRegisterListeners.add(callback);
    return () => this.offRegister(callback);
  }

  private offRegister(callback: AdaptedWalletEventCallback) {
    this.onRegisterListeners.delete(callback);
  }

  private onUnregister(callback: AdaptedWalletEventCallback): UnsubscribeCallback {
    this.onUnregisterListeners.add(callback);
    return () => this.offUnregister(callback);
  }

  private offUnregister(callback: AdaptedWalletEventCallback) {
    this.onUnregisterListeners.delete(callback);
  }

  on(eventName: 'register' | 'unregister', callback: (wallet: AdaptedWallet) => unknown) {
    return eventName === 'register'
      ? this.onRegister(callback)
      : this.onUnregister(callback);
  }

  off(eventName: 'register' | 'unregister', callback: (wallet: AdaptedWallet) => unknown) {
    return eventName === 'register'
      ? this.offRegister(callback)
      : this.offUnregister(callback);
  }

  // endregion
}
