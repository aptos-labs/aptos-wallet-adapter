import { accountInfoFromPublicKey, fetchDevnetChainId, isNullCallback } from '@aptos-labs/derived-wallet-base';
import {
  AccountAuthenticator,
  AnyRawTransaction,
  Network,
  NetworkToChainId,
  NetworkToNodeAPI,
} from '@aptos-labs/ts-sdk';
import {
  AccountInfo,
  APTOS_CHAINS,
  AptosChangeNetworkOutput,
  AptosConnectOutput,
  AptosFeatures,
  AptosSignMessageInput,
  AptosSignMessageOutput,
  AptosWallet,
  NetworkInfo,
  UserResponse,
  UserResponseStatus,
  WalletIcon,
} from "@aptos-labs/wallet-standard";
import { StandardWalletAdapter as SolanaWalletAdapter } from "@solana/wallet-standard-wallet-adapter-base";
import { PublicKey as SolanaPublicKey } from '@solana/web3.js';
import { defaultAuthenticationFunction } from './shared';
import { signAptosMessageWithSolana } from './signAptosMessage';
import { signAptosTransactionWithSolana } from './signAptosTransaction';
import { SolanaDerivedPublicKey } from './SolanaDerivedPublicKey';

export type { SolanaPublicKey };
export interface SolanaDomainWalletOptions {
  authenticationFunction?: string;
  defaultNetwork?: Network;
}

export class SolanaDerivedWallet implements AptosWallet {
  readonly solanaWallet: SolanaWalletAdapter;
  readonly domain: string;
  readonly authenticationFunction: string;
  defaultNetwork: Network;

  readonly version = "1.0.0";
  readonly name: string;
  readonly icon: WalletIcon;
  readonly url: string;
  readonly accounts = [];
  readonly chains = APTOS_CHAINS;

  constructor(solanaWallet: SolanaWalletAdapter, options: SolanaDomainWalletOptions = {}) {
    const {
      authenticationFunction = defaultAuthenticationFunction,
      defaultNetwork = Network.MAINNET,
    } = options;

    this.solanaWallet = solanaWallet;
    this.domain = window.location.host;
    this.authenticationFunction = authenticationFunction;
    this.defaultNetwork = defaultNetwork;
    this.name = `${solanaWallet.name} (Solana)`;
    this.icon = solanaWallet.icon;
    this.url = solanaWallet.url;
  }

  readonly features: AptosFeatures = {
    'aptos:connect': {
      version: '1.0.0',
      connect: () => this.connect(),
    },
    'aptos:disconnect': {
      version: '1.0.0',
      disconnect: () => this.disconnect(),
    },
    'aptos:account': {
      version: '1.0.0',
      account: () => this.getActiveAccount(),
    },
    'aptos:onAccountChange': {
      version: '1.0.0',
      onAccountChange: async (callback) => this.onActiveAccountChange(callback),
    },
    'aptos:network': {
      version: '1.0.0',
      network: () => this.getActiveNetwork(),
    },
    'aptos:changeNetwork': {
      version: '1.0.0',
      changeNetwork: (newNetwork) => this.changeNetwork(newNetwork),
    },
    'aptos:onNetworkChange': {
      version: '1.0.0',
      onNetworkChange: async (callback) => this.onActiveNetworkChange(callback),
    },
    "aptos:signMessage": {
      version: '1.0.0',
      signMessage: (args) => this.signMessage(args),
    },
    "aptos:signTransaction": {
      version: '1.0.0',
      signTransaction: (...args) => this.signTransaction(...args),
    },
  }

  private derivePublicKey(solanaPublicKey: SolanaPublicKey) {
    return new SolanaDerivedPublicKey({
      domain: this.domain,
      solanaPublicKey,
      authenticationFunction: this.authenticationFunction,
    });
  }

  // region Connection

  async connect(): Promise<UserResponse<AptosConnectOutput>> {
    await this.solanaWallet.connect();
    if (!this.solanaWallet.publicKey) {
      return { status: UserResponseStatus.REJECTED };
    }

    const aptosPublicKey = this.derivePublicKey(this.solanaWallet.publicKey);
    return {
      args: accountInfoFromPublicKey(aptosPublicKey),
      status: UserResponseStatus.APPROVED,
    };
  }

  async disconnect() {
    await this.solanaWallet.disconnect();
  }

  // endregion

  // region Accounts

  private getActivePublicKey(): SolanaDerivedPublicKey {
    if (!this.solanaWallet.publicKey) {
      throw new Error('Account not connected');
    }
    return this.derivePublicKey(this.solanaWallet.publicKey);
  }

  async getActiveAccount() {
    const aptosPublicKey = this.getActivePublicKey();
    return accountInfoFromPublicKey(aptosPublicKey);
  }

  onActiveAccountChange(callback: (newAccount: AccountInfo) => void) {
    if (isNullCallback(callback)) {
      this.solanaWallet.off('connect')
    } else {
      this.solanaWallet.on('connect', (newSolanaPublicKey) => {
        const aptosPublicKey = this.derivePublicKey(newSolanaPublicKey);
        const newAptosAccount = accountInfoFromPublicKey(aptosPublicKey);
        callback(newAptosAccount);
      });
    }
  }

  // endregion

  // region Networks

  readonly onActiveNetworkChangeListeners = new Set<(newNetwork: NetworkInfo) => void>();

  async getActiveNetwork(): Promise<NetworkInfo> {
    const chainId = NetworkToChainId[this.defaultNetwork];
    const url = NetworkToNodeAPI[this.defaultNetwork];
    return {
      name: this.defaultNetwork,
      chainId,
      url,
    };
  }

  async changeNetwork(newNetwork: NetworkInfo): Promise<UserResponse<AptosChangeNetworkOutput>> {
    const { name, chainId, url } = newNetwork;
    if (name === Network.CUSTOM) {
      throw new Error('Custom network not currently supported');
    }
    this.defaultNetwork = name;
    for (const listener of this.onActiveNetworkChangeListeners) {
      listener({
        name,
        chainId: chainId ?? NetworkToChainId[name],
        url: url ?? NetworkToNodeAPI[name],
      });
    }
    return {
      status: UserResponseStatus.APPROVED,
      args: { success: true },
    };
  }

  onActiveNetworkChange(callback: (newNetwork: NetworkInfo) => void) {
    if (isNullCallback(callback)) {
      this.onActiveNetworkChangeListeners.clear();
    } else {
      this.onActiveNetworkChangeListeners.add(callback);
    }
  }

  // endregion

  // region Signatures

  async signMessage(input: AptosSignMessageInput): Promise<UserResponse<AptosSignMessageOutput>> {
    const chainId = input.chainId ? this.defaultNetwork === Network.DEVNET ? await fetchDevnetChainId() : NetworkToChainId[this.defaultNetwork] : undefined;
    return signAptosMessageWithSolana({
      solanaWallet: this.solanaWallet,
      authenticationFunction: this.authenticationFunction,
      messageInput: {
        ...input,
        chainId,
      },
      domain: this.domain,
    });
  }

  async signTransaction(
    rawTransaction: AnyRawTransaction,
    _asFeePayer?: boolean,
  ): Promise<UserResponse<AccountAuthenticator>> {
    return signAptosTransactionWithSolana({
      solanaWallet: this.solanaWallet,
      authenticationFunction: this.authenticationFunction,
      rawTransaction,
      domain: this.domain,
    });
  }

  // endregion
}
