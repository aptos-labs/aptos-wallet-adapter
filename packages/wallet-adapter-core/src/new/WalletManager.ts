import { getWallets, Wallet } from '@aptos-labs/wallet-standard';
import { type AptosStandardWallet, isAptosStandardWallet } from './AptosStandardWallet';
import { DefaultRegistryConfig, DiscoverableWallet, makeDefaultRegistry, RegistryWallet } from './registry';
import { WalletAdapter, WalletAdapterConfig } from './WalletAdapter';

export type RegisteredWalletsChangeCallback = (wallet: WalletAdapter) => unknown;

export interface WalletManagerConfig {
  registry?: RegistryWallet[] | DefaultRegistryConfig
  whitelist?: Iterable<string>;
  blacklist?: Iterable<string>;
  disableTelemetry?: boolean;
}

export class WalletManager {
  readonly registry: RegistryWallet[];
  private readonly whitelist?: Set<string>;
  private readonly blacklist?: Set<string>;
  private readonly adapterConfig: WalletAdapterConfig;

  private readonly registeredAdapters: { [name: string]: WalletAdapter | undefined };
  private readonly onRegisterListeners = new Set<RegisteredWalletsChangeCallback>;
  private readonly onUnregisterListeners = new Set<RegisteredWalletsChangeCallback>;

  private cleanupCallback?: () => void;

  constructor(config: WalletManagerConfig = {}) {
    const {
      registry,
      whitelist,
      blacklist,
      disableTelemetry,
    } = config;
    this.registry = Array.isArray(registry) ? registry : makeDefaultRegistry(registry);
    this.whitelist = whitelist && new Set(whitelist);
    this.blacklist = blacklist && new Set(blacklist);
    this.adapterConfig = { disableTelemetry };

    this.registeredAdapters = {};
    for (const wallet of this.registry) {
      const isAdaptable = 'features' in wallet;
      this.registeredAdapters[wallet.name] = isAdaptable
        ? new WalletAdapter(wallet, this.adapterConfig)
        : undefined;
    }
  }

  // region API

  /**
   * Return the list of registered wallets.
   * They will be sorted in the order they appear in the registry first, then by order of registration.
   * @see registry
   */
  get registeredWallets(): WalletAdapter[] {
    if (!this.cleanupCallback) {
      this.syncAdapters();
    }

    const output: WalletAdapter[] = [];
    for (const adapter of Object.values(this.registeredAdapters)) {
      if (adapter) {
        output.push(adapter);
      }
    }
    return output;
  }

  get unregisteredWallets(): DiscoverableWallet[] {
    if (!this.cleanupCallback) {
      this.syncAdapters();
    }

    const output: DiscoverableWallet[] = [];
    for (const wallet of this.registry) {
      const isDiscoverable = !('features' in wallet);
      const isRegistered = this.registeredAdapters[wallet.name] !== undefined;
      if (isDiscoverable && !isRegistered) {
        output.push(wallet);
      }
    }
    return output;
  }

  on(eventName: 'register' | 'unregister', callback: RegisteredWalletsChangeCallback) {
    const listeners = eventName === 'register'
      ? this.onRegisterListeners
      : this.onUnregisterListeners;
    listeners.add(callback);
    this.ensureListeners();
    return () => this.off(eventName, callback);
  }

  off(eventName: 'register' | 'unregister', callback: RegisteredWalletsChangeCallback) {
    const listeners = eventName === 'register'
      ? this.onRegisterListeners
      : this.onUnregisterListeners;
    listeners.delete(callback);
    this.maybeRemoveListeners();
  }

  // endregion

  private isValidWallet(wallet: Wallet): wallet is AptosStandardWallet {
    const whitelisted = this.whitelist?.has(wallet.name) ?? true;
    const blacklisted = this.blacklist?.has(wallet.name) ?? false;
    return isAptosStandardWallet(wallet) && whitelisted && !blacklisted;
  }

  private syncAdapters() {
    const api = getWallets();

    const expectedRegisteredNames = new Set<string>();
    for (const wallet of this.registry) {
      const isAdaptable = 'features' in wallet;
      if (isAdaptable) {
        expectedRegisteredNames.add(wallet.name);
      }
    }

    for (const wallet of api.get()) {
      if (this.isValidWallet(wallet)) {
        expectedRegisteredNames.add(wallet.name);
        // Register adapter if the wallet was registered since the last sync
        if (!this.registeredAdapters[wallet.name]) {
          this.registeredAdapters[wallet.name] = new WalletAdapter(wallet, this.adapterConfig);
        }
      }
    }

    for (const adapter of Object.values(this.registeredAdapters)) {
      // Unregister adapter if the wallet was unregistered since the last sync
      if (adapter && !expectedRegisteredNames.has(adapter.name)) {
        this.registeredAdapters[adapter.name] = undefined;
      }
    }
  }

  /**
   * Handle generic wallet `register` event.
   * @param wallet generic wallet being registered
   */
  private handleRegister(wallet: Wallet) {
    if (this.isValidWallet(wallet)) {
      if (this.registeredAdapters[wallet.name]) {
        console.warn(`'${wallet.name}' is being registered more than once.`);
      }
      const adapter = new WalletAdapter(wallet, this.adapterConfig);
      this.registeredAdapters[wallet.name] = adapter;
      for (const callback of this.onRegisterListeners) {
        callback(adapter);
      }
    }
  }

  /**
   * Handle generic wallet `unregister` event.
   * @param wallet generic wallet being unregistered
   */
  private handleUnregister(wallet: Wallet) {
    if (this.isValidWallet(wallet)) {
      const adapter = this.registeredAdapters[wallet.name];
      if (!adapter) {
        console.warn(`Trying to unregister '${wallet.name}', which was not previously registered.`);
        return;
      }
      this.registeredAdapters[wallet.name] = undefined;
      for (const callback of this.onUnregisterListeners) {
        callback(adapter);
      }
    }
  }

  private ensureListeners() {
    if (!this.cleanupCallback) {
      const api = getWallets();

      const offRegister = api.on('register', (wallet) => this.handleRegister(wallet));
      const offUnregister = api.on('unregister', (wallet) => this.handleUnregister(wallet));

      this.cleanupCallback = () => {
        offRegister();
        offUnregister();
      };

      this.syncAdapters();
    }
  }

  private maybeRemoveListeners() {
    if (this.cleanupCallback && this.onRegisterListeners.size === 0 && this.onUnregisterListeners.size === 0) {
      this.cleanupCallback();
      this.cleanupCallback = undefined;
    }
  }
}
