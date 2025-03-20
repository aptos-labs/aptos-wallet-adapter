import {
  encodeStructuredMessage,
  isNullCallback,
  makeUserApproval,
  makeUserRejection,
  mapUserResponse,
} from '@aptos-labs/derived-wallet-base';
import {
  AccountAuthenticator,
  AccountAuthenticatorAbstraction,
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
import type { EIP6963ProviderDetail } from 'mipd';
import {
  Address as EthereumAddress,
  createWalletClient,
  custom,
  CustomTransport,
  EIP1193Provider,
  UserRejectedRequestError,
  WalletClient,
} from 'viem'
import {
  createSiweMessageFromAptosStructuredMessage,
  createSiweMessageFromAptosTransaction,
} from './createSiweMessageFromAptos';
import { EIP1193DerivedPublicKey } from './EIP1193DerivedPublicKey';
import { EIP1193DerivedSignature } from './EIP1193DerivedSignature';

const defaultAuthenticationFunction = '0x7::eip1193::authenticate';

/**
 * Adapt EIP1193 response into a UserResponse.
 * `UserRejectedRequestError` will be converted into a rejection.
 */
async function wrapEIP1193UserResponse<TResponse>(promise: Promise<TResponse>): Promise<UserResponse<TResponse>> {
  try {
    const response = await promise;
    return makeUserApproval(response);
  } catch (err) {
    if (err instanceof UserRejectedRequestError) {
      return makeUserRejection();
    }
    throw err;
  }
}

export interface EIP1193DerivedWalletOptions {
  authenticationFunction?: string;
  defaultNetwork?: Network;
}

export class EIP1193DerivedWallet implements AptosWallet {
  readonly eip1193Provider: EIP1193Provider;
  readonly eip1193Wallet: WalletClient<CustomTransport>;
  readonly domain: string;
  readonly authenticationFunction: string;
  defaultNetwork: Network;

  readonly version = "1.0.0";
  readonly name: string;
  readonly icon: WalletIcon;
  readonly url: string;
  readonly accounts = [];
  readonly chains = APTOS_CHAINS;

  constructor(providerDetail: EIP6963ProviderDetail, options: EIP1193DerivedWalletOptions = {}) {
    const { info, provider } = providerDetail;
    const {
      authenticationFunction = defaultAuthenticationFunction,
      defaultNetwork = Network.MAINNET,
    } = options;

    this.eip1193Provider = provider;
    this.eip1193Wallet = createWalletClient({
      transport: custom(this.eip1193Provider),
    })

    this.domain = window.location.origin;
    this.authenticationFunction = authenticationFunction;
    this.defaultNetwork = defaultNetwork;
    this.name = `${info.name} (Ethereum)`;
    // Phantom's icon is wrapped with new lines :shrug:
    this.icon = info.icon.trim() as WalletIcon;
    this.url = info.rdns;
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

  private derivePublicKey(ethereumAddress: EthereumAddress) {
    return new EIP1193DerivedPublicKey({
      domain: this.domain,
      ethereumAddress,
      authenticationFunction: this.authenticationFunction,
    });
  }

  // region Connection

  async connect(): Promise<UserResponse<AptosConnectOutput>> {
    const response = await wrapEIP1193UserResponse(this.eip1193Wallet.requestAddresses());

    return mapUserResponse(response, ([ethereumAddress]) => {
      const publicKey = this.derivePublicKey(ethereumAddress);
      const aptosAddress = publicKey.authKey().derivedAddress();
      return new AccountInfo({ publicKey, address: aptosAddress });
    });
  }

  async disconnect() {
    // TODO: Eip1193 doesn't provide a "disconnect" method, so we have to keep track locally
  }

  // endregion

  // region Accounts

  private async getActiveAccountAddress(): Promise<EthereumAddress> {
    const [activeAddress] = await this.eip1193Wallet.getAddresses();
    if (!activeAddress) {
      throw new Error('Account not connected');
    }
    return activeAddress;
  }

  async getActiveAccount() {
    const ethereumAddress = await this.getActiveAccountAddress();
    const publicKey = this.derivePublicKey(ethereumAddress);
    const aptosAddress = publicKey.authKey().derivedAddress();
    return new AccountInfo({ publicKey, address: aptosAddress });
  }

  private onAccountsChangedListeners: ((newAccounts: EthereumAddress[]) => void)[] = []

  onActiveAccountChange(callback: (newAccount: AccountInfo) => void) {
    if (isNullCallback(callback)) {
      for (const listener of this.onAccountsChangedListeners) {
        this.eip1193Provider.removeListener('accountsChanged', listener);
      }
      this.onAccountsChangedListeners = [];
    } else {
      const listener = ([ethereumAddress]: EthereumAddress[]) => {
        if (!ethereumAddress) {
          callback(undefined as any as AccountInfo);
          return;
        }
        const publicKey = this.derivePublicKey(ethereumAddress);
        const aptosAddress = publicKey.authKey().derivedAddress();
        const account = new AccountInfo({ publicKey, address: aptosAddress });
        callback(account);
      };
      this.onAccountsChangedListeners.push(listener);
      this.eip1193Provider.on('accountsChanged', listener);
    }
  }

  // endregion

  // region Networks

  private onActiveNetworkChangeListeners: ((newNetwork: NetworkInfo) => void)[] = [];

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
      this.onActiveNetworkChangeListeners = [];
    } else {
      this.onActiveNetworkChangeListeners.push(callback);
    }
  }

  // endregion

  // region Signatures

  async signMessage({
    message,
    nonce,
    ...flags
  }: AptosSignMessageInput): Promise<UserResponse<AptosSignMessageOutput>> {
    const ethereumAddress = await this.getActiveAccountAddress();
    const publicKey = this.derivePublicKey(ethereumAddress);

    const aptosAddress = flags.address ? publicKey.authKey().derivedAddress() : undefined;
    const application = flags.application ? this.domain : undefined;
    const chainId = flags.chainId ? NetworkToChainId[this.defaultNetwork] : undefined;
    const structuredMessage = {
      address: aptosAddress?.toString(),
      application,
      chainId,
      message,
      nonce,
    };

    // We need to provide `issuedAt` externally so that we can match it with the signature
    const issuedAt = new Date();
    const siweMessage = createSiweMessageFromAptosStructuredMessage({
      ethereumAddress,
      structuredMessage,
      issuedAt,
    });

    const response = await wrapEIP1193UserResponse(this.eip1193Wallet.signMessage({
      account: ethereumAddress,
      message: siweMessage,
    }));

    return mapUserResponse(response, (siweSignature) => {
      const signature = new EIP1193DerivedSignature(siweSignature, issuedAt);
      const fullMessageBytes = encodeStructuredMessage(structuredMessage);
      const fullMessage = new TextDecoder().decode(fullMessageBytes);
      return {
        prefix: 'APTOS',
        fullMessage,
        message,
        nonce,
        signature,
      };
    });
  }

  async signTransaction(rawTransaction: AnyRawTransaction, asFeePayer?: boolean): Promise<UserResponse<AccountAuthenticator>> {
    const ethereumAddress = await this.getActiveAccountAddress();
    const publicKey = this.derivePublicKey(ethereumAddress);
    const aptosAddress = publicKey.authKey().derivedAddress();

    // We need to provide `issuedAt` externally so that we can match it with the signature
    const issuedAt = new Date();
    const siweMessage = createSiweMessageFromAptosTransaction({
      aptosAddress,
      ethereumAddress,
      rawTransaction,
      issuedAt,
    });

    const response = await wrapEIP1193UserResponse(this.eip1193Wallet.signMessage({
      account: ethereumAddress,
      message: siweMessage,
    }));

    return mapUserResponse(response, (siweSignature) => {
      const utf8EncodedSiweMessage = new TextEncoder().encode(siweMessage);
      const signature = new EIP1193DerivedSignature(siweSignature, issuedAt);
      const authenticator: AccountAuthenticator = new AccountAuthenticatorAbstraction(
        this.authenticationFunction,
        // Not sure what the expected value is here
        utf8EncodedSiweMessage,
        signature.bcsToBytes(),
      );
      return authenticator;
    });
  }

  // endregion
}
