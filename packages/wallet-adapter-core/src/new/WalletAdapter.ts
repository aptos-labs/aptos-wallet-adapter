import { Aptos, AptosConfig } from '@aptos-labs/ts-sdk';
import {
  AccountInfo,
  AptosFeatures,
  AptosSignAndSubmitTransactionInput,
  AptosSignAndSubmitTransactionOutput,
  AptosSignMessageInput,
  AptosSignTransactionInputV1_1,
  AptosSignTransactionOutput,
  AptosSignTransactionOutputV1_1,
  UserResponseStatus,
  WalletIcon,
} from '@aptos-labs/wallet-standard';
import { GA4 } from '../ga';
import { WALLET_ADAPTER_CORE_VERSION } from '../version';
import { AptosStandardWallet } from './AptosStandardWallet';
import { Network, StandardNetwork } from './network';
import {
  aptosChainIdentifierToNetworkMap,
  buildTransaction,
  chainIdToStandardNetwork,
  isFeatureMinorVersion,
  mapUserResponse,
  networkInfoToNetwork,
} from './utils';

// The standard doesn't currently allow removing event listeners, so instead
// we pass a special null callback that can be detected by wallets as "null"
const nullCallback = Object.assign(() => {
}, { _isNull: true });

type EventHandlers = {
  accountConnected: (account: AccountInfo) => void;
  accountDisconnected: (account?: AccountInfo) => void;
  activeAccountChanged: (account?: AccountInfo) => void;
  activeNetworkChanged: (network?: Network) => void;
}

export interface WalletAdapterConfig {
  disableTelemetry?: boolean;
}

/**
 * A wallet instance adapted from an Aptos standard wallet that supports
 * all required features with minimum version.
 */
export class WalletAdapter {
  readonly name: string;
  readonly url: string;
  readonly icon: WalletIcon;
  readonly features: AptosFeatures;

  readonly availableNetworks: Network[];

  // Google Analytics 4 module
  private readonly ga4?: GA4;

  private _activeNetwork?: Network;

  constructor(wallet: AptosStandardWallet, options: WalletAdapterConfig = {}) {
    this.name = wallet.name;
    this.url = wallet.url;
    this.icon = wallet.icon;
    this.features = wallet.features;

    if (!options.disableTelemetry) {
      this.ga4 = new GA4();
    }

    this.availableNetworks = [];
    for (const chain of wallet.chains) {
      const network = aptosChainIdentifierToNetworkMap[chain];
      if (network) {
        this.availableNetworks.push(network);
      }
    }
  }

  // TODO: revise event formats and names
  private recordEvent(eventName: string, additionalInfo?: object) {
    this.ga4?.gtag("event", `wallet_adapter_${eventName}`, {
      wallet: this.name,
      activeNetwork: this._activeNetwork,
      adapter_core_version: WALLET_ADAPTER_CORE_VERSION,
      send_to: process.env.GAID,
      ...additionalInfo,
    });
  }

  // region Connection

  async connect() {
    const feature = this.features['aptos:connect'];
    const response = await feature.connect();
    if (response.status === UserResponseStatus.APPROVED) {
      for (const callback of this.onAccountConnectedListeners) {
        callback(response.args);
      }
    }
    return response;
  }

  async disconnect() {
    // TODO: specify which account. defaults to active account
    const feature = this.features['aptos:disconnect'];
    await feature.disconnect();
    for (const callback of this.onAccountDisconnectedListeners) {
      callback();
    }
  }

  // endregion

  // region Accounts

  private readonly onAccountConnectedListeners = new Set<(account: AccountInfo) => void>();
  private readonly onAccountDisconnectedListeners = new Set<() => void>();

  async getConnectedAccounts(): Promise<AccountInfo[]> {
    // TODO: add explicit `getConnectedAccounts` feature
    const activeAccount = await this.getActiveAccount();
    return activeAccount ? [activeAccount] : [];
  }

  onAccountConnected(callback: (account: AccountInfo) => void) {
    this.onAccountConnectedListeners.add(callback);
    return () => this.onAccountConnectedListeners.delete(callback);
  }

  onAccountDisconnected(callback: () => void) {
    this.onAccountDisconnectedListeners.add(callback);
    return () => this.onAccountDisconnectedListeners.delete(callback);
  }

  async getActiveAccount(): Promise<AccountInfo | undefined> {
    return this.features['aptos:account'].account()
      .catch(() => undefined);
  }

  onActiveAccountChanged(callback: (account?: AccountInfo) => void) {
    const feature = this.features['aptos:onAccountChange'];
    void feature.onAccountChange((newAccount) => {
      callback(newAccount);
    });
    return () => {
      void feature.onAccountChange(nullCallback);
    }
  }

  // endregion

  // region Networks

  async getAvailableNetworks(): Promise<Network[]> {
    // TODO: maybe add explicit `getAvailableNetworks` feature
    return this.availableNetworks;
  }

  async getActiveNetwork(): Promise<Network> {
    const feature = this.features['aptos:network'];
    try {
      const networkInfo = await feature.network();
      const network = networkInfoToNetwork(networkInfo);
      this._activeNetwork = network;
      return network;
    } catch {
      this._activeNetwork = StandardNetwork.MAINNET;
      return StandardNetwork.MAINNET;
    }
  }

  onActiveNetworkChanged(callback: (network?: Network) => void) {
    const feature = this.features['aptos:onNetworkChange'];

    void feature.onNetworkChange((networkInfo) => {
      const network = networkInfo && networkInfoToNetwork(networkInfo);
      this._activeNetwork = network;
      callback(network);
    });
    return () => {
      void feature.onNetworkChange(nullCallback);
    }
  }

  // endregion

  // region Signature

  // TODO: improve message signature standard
  async signMessage(input: AptosSignMessageInput) {
    const feature = this.features['aptos:signMessage'];
    return feature.signMessage(input);
  }

  async signTransaction(input: AptosSignTransactionInputV1_1) {
    const feature = this.features['aptos:signTransaction']

    if (isFeatureMinorVersion(feature, "1.0")) {
      const { signerAddress, feePayer } = input;
      // This will throw an error if it requires an async call
      const transaction = buildTransaction(input);
      const asFeePayer = signerAddress?.toString() === feePayer?.address.toString();
      const response = await feature.signTransaction(transaction, asFeePayer);

      return mapUserResponse<AptosSignTransactionOutput, AptosSignTransactionOutputV1_1>(
        response, (authenticator) => ({
          authenticator,
          rawTransaction: transaction,
        }));
    }

    return feature.signTransaction(input);
  }

  async signAndSubmitTransaction(input: AptosSignAndSubmitTransactionInput) {
    const feature = this.features['aptos:signAndSubmitTransaction']
    if (feature) {
      return feature.signAndSubmitTransaction(input);
    }

    const response = await this.signTransaction(input);
    return mapUserResponse<AptosSignTransactionOutputV1_1, AptosSignAndSubmitTransactionOutput>(
      response, async ({ rawTransaction: transaction, authenticator }) => {
        const { chainId } = transaction.rawTransaction.chain_id;
        const network = chainIdToStandardNetwork(chainId);
        const aptosConfig = new AptosConfig({ network });
        const aptosClient = new Aptos(aptosConfig);

        const { hash } = await aptosClient.transaction.submit.simple({
          transaction,
          senderAuthenticator: authenticator,
        });
        return { hash };
      });
  }

  // endregion

  // region Event handling

  on<EventName extends keyof EventHandlers>(eventName: EventName, callback: EventHandlers[EventName]) {
    const handlers: {
      [K in keyof EventHandlers]: (cb: EventHandlers[K]) => () => void;
    } = {
      accountConnected: (cb) => this.onAccountConnected(cb),
      accountDisconnected: (cb) => this.onAccountDisconnected(cb),
      activeAccountChanged: (cb) => this.onActiveAccountChanged(cb),
      activeNetworkChanged: (cb) => this.onActiveNetworkChanged(cb),
    };

    const handler = handlers[eventName];
    if (!handler) {
      throw new Error('Unsupported event name');
    }
    return handler(callback);
  }

  // endregion
}
