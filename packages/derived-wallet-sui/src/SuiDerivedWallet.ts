import {
  accountInfoFromPublicKey,
  fetchDevnetChainId,
  isNullCallback,
} from "@aptos-labs/derived-wallet-base";
import {
  AccountAuthenticator,
  AnyRawTransaction,
  Network,
  NetworkToChainId,
  NetworkToNodeAPI,
} from "@aptos-labs/ts-sdk";
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
import type {
  Wallet,
  StandardConnectMethod,
  StandardDisconnectMethod,
  WalletAccount,
} from "@mysten/wallet-standard";
import { SuiDerivedPublicKey } from "./SuiDerivedPublicKey";
import { signAptosMessageWithSui } from "./signAptosMessage";
import { signAptosTransactionWithSui } from "./signAptosTransaction";

export interface SuiDomainWalletOptions {
  authenticationFunction?: string;
  defaultNetwork?: Network;
}

export class SuiDerivedWallet implements AptosWallet {
  readonly suiWallet: Wallet;
  readonly domain: string;
  readonly authenticationFunction: string;
  defaultNetwork: Network;
  private _activeAccount: WalletAccount;

  readonly version = "1.0.0";
  readonly name: string;
  readonly icon: WalletIcon;
  readonly url: string;
  readonly accounts = [];
  readonly chains = APTOS_CHAINS;

  constructor(suiWallet: Wallet, options: SuiDomainWalletOptions = {}) {
    const {
      authenticationFunction = "0x1::sui_derivable_account::authenticate",
      defaultNetwork = Network.MAINNET,
    } = options;

    this._activeAccount = suiWallet.accounts[0];
    this.suiWallet = suiWallet;
    this.domain = window.location.host;
    this.authenticationFunction = authenticationFunction;
    this.defaultNetwork = defaultNetwork;
    this.name = `${suiWallet.name} (Sui)`;
    this.icon = suiWallet.icon;
    this.url = ""; // sui wallet standard does not have a url
  }

  readonly features: AptosFeatures = {
    "aptos:connect": {
      version: "1.0.0",
      connect: () => this.connect(),
    },
    "aptos:disconnect": {
      version: "1.0.0",
      disconnect: () => this.disconnect(),
    },
    "aptos:account": {
      version: "1.0.0",
      account: () => this.getActiveAccount(),
    },
    "aptos:onAccountChange": {
      version: "1.0.0",
      onAccountChange: async (callback) => this.onActiveAccountChange(callback),
    },
    "aptos:network": {
      version: "1.0.0",
      network: () => this.getActiveNetwork(),
    },
    "aptos:changeNetwork": {
      version: "1.0.0",
      changeNetwork: (newNetwork) => this.changeNetwork(newNetwork),
    },
    "aptos:onNetworkChange": {
      version: "1.0.0",
      onNetworkChange: async (callback) => this.onActiveNetworkChange(callback),
    },
    "aptos:signMessage": {
      version: "1.0.0",
      signMessage: (args) => this.signMessage(args),
    },
    "aptos:signTransaction": {
      version: "1.0.0",
      signTransaction: (...args) => this.signTransaction(...args),
    },
  };

  private derivePublicKey(suiAccountAddress: string) {
    return new SuiDerivedPublicKey({
      domain: this.domain,
      suiAccountAddress,
      authenticationFunction: this.authenticationFunction,
    });
  }

  // region Connection

  async connect(): Promise<UserResponse<AptosConnectOutput>> {
    const feature = this.suiWallet.features["standard:connect"] as {
      connect: StandardConnectMethod;
    };
    const { accounts } = await feature.connect();
    if (!accounts) {
      return { status: UserResponseStatus.REJECTED };
    }

    this._activeAccount = accounts[0];
    const accountAddress = this._activeAccount.address;
    const aptosPublicKey = this.derivePublicKey(accountAddress);
    return {
      args: accountInfoFromPublicKey(aptosPublicKey),
      status: UserResponseStatus.APPROVED,
    };
  }

  async disconnect() {
    const feature = this.suiWallet.features["standard:disconnect"] as {
      disconnect: StandardDisconnectMethod;
    };
    await feature.disconnect();
  }

  // endregion

  // region Accounts

  private getActivePublicKey() {
    if (!this._activeAccount) {
      throw new Error("Account not connected");
    }
    const accountAddress = this._activeAccount.address;
    return this.derivePublicKey(accountAddress);
  }

  async getActiveAccount(): Promise<AccountInfo> {
    const aptosPublicKey = this.getActivePublicKey();
    return accountInfoFromPublicKey(aptosPublicKey);
  }

  onActiveAccountChange(callback: (newAccount: AccountInfo) => void) {
    throw new Error("Not implemented");
  }

  // endregion

  // region Networks

  readonly onActiveNetworkChangeListeners = new Set<
    (newNetwork: NetworkInfo) => void
  >();

  async getActiveNetwork(): Promise<NetworkInfo> {
    const chainId = NetworkToChainId[this.defaultNetwork];
    const url = NetworkToNodeAPI[this.defaultNetwork];
    return {
      name: this.defaultNetwork,
      chainId,
      url,
    };
  }

  async changeNetwork(
    newNetwork: NetworkInfo,
  ): Promise<UserResponse<AptosChangeNetworkOutput>> {
    const { name, chainId, url } = newNetwork;
    if (name === Network.CUSTOM) {
      throw new Error("Custom network not currently supported");
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

  async signMessage(
    input: AptosSignMessageInput,
  ): Promise<UserResponse<AptosSignMessageOutput>> {
    const chainId = input.chainId
      ? this.defaultNetwork === Network.DEVNET
        ? await fetchDevnetChainId()
        : NetworkToChainId[this.defaultNetwork]
      : undefined;
    return signAptosMessageWithSui({
      suiWallet: this.suiWallet,
      suiAccount: this._activeAccount,
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
    return signAptosTransactionWithSui({
      suiWallet: this.suiWallet,
      suiAccount: this._activeAccount,
      authenticationFunction: this.authenticationFunction,
      rawTransaction,
      domain: this.domain,
    });
  }

  // endregion
}
