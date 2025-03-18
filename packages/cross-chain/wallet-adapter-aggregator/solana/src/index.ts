import {
  AccountInfo,
  APTOS_CHAINS,
  AptosSignInInput,
  AptosSignMessageInput,
  AptosSignMessageOutput,
  AptosWallet,
  NetworkInfo,
  UserResponse,
  UserResponseStatus,
  WalletAccount,
} from "@aptos-labs/wallet-standard";
import { isWalletAdapterCompatibleStandardWallet } from "@solana/wallet-adapter-base";
import { getWallets } from "@wallet-standard/app";
import { Transaction } from "@solana/web3.js";
import { StandardWalletAdapter } from "@solana/wallet-standard-wallet-adapter-base";
import {
  AdapterWallet,
  WalletReadyState,
} from "@aptos-labs/wallet-adapter-aggregator-core";
import { convertSolanaWalletToAptosWallet } from "./utils";

export type SolanaUnsignedTransaction = Transaction | Transaction[];
export type SolanaSignedTransaction = Transaction | Transaction[];

export function getSolanaStandardWallets(): AdapterWallet[] {
  // from https://github.com/solana-labs/wallet-standard/blob/c68c26604e0b9624e924292e243df44c742d1c00/packages/wallet-adapter/react/src/useStandardWalletAdapters.ts#L78
  return getWallets()
    .get()
    .filter(isWalletAdapterCompatibleStandardWallet)
    .map(
      (wallet) =>
        new SolanaWallet(
          convertSolanaWalletToAptosWallet(
            new StandardWalletAdapter({ wallet })
          )
        )
    );
}

export type SolanaFeatures = {
  "solana:signTransaction": {
    signTransaction: (
      transaction: Transaction
    ) => Promise<UserResponse<Transaction>>;
    version: string;
  };
};

export type SolanaBaseWallet = AptosWallet & {
  features: SolanaFeatures;
};

export class SolanaWallet extends AdapterWallet<
  AccountInfo,
  NetworkInfo,
  AccountInfo,
  AptosSignMessageInput,
  AptosSignMessageOutput,
  Transaction,
  Transaction,
  AccountInfo,
  NetworkInfo
> {
  readonly originChain = "Solana";
  readonly solanaWallet: SolanaBaseWallet;
  readonly version = "1.0.0";

  accounts: WalletAccount[] = [];

  connected: boolean = false;

  constructor(solanaWallet: SolanaBaseWallet) {
    super();
    this.solanaWallet = solanaWallet;
  }

  get icon() {
    return this.solanaWallet.icon;
  }
  get name() {
    return this.solanaWallet.name;
  }
  get url() {
    return this.solanaWallet.url;
  }

  get readyState() {
    return WalletReadyState.Installed;
  }

  get chains() {
    return APTOS_CHAINS;
  }

  get isConnected() {
    return this.connected;
  }

  async getAccount(): Promise<AccountInfo> {
    return await this.solanaWallet.features["aptos:account"].account();
  }

  async getConnectedNetwork() {
    return await this.solanaWallet.features["aptos:network"].network();
  }

  async connect(): Promise<AccountInfo> {
    const result = await this.solanaWallet.features["aptos:connect"].connect();
    if (result.status === UserResponseStatus.REJECTED) {
      throw new Error("User rejected the request").message;
    }
    await this.onAccountChange();
    this.connected = true;
    return result.args;
  }

  async disconnect() {
    if (!this.connected) {
      return;
    }
    await this.solanaWallet.features["aptos:disconnect"].disconnect();
    this.connected = false;
  }

  async signMessage(message: AptosSignMessageInput) {
    const result =
      await this.solanaWallet.features["aptos:signMessage"].signMessage(
        message
      );
    if (result.status === UserResponseStatus.REJECTED) {
      throw new Error("User rejected the request").message;
    }
    return result.args;
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    const result =
      await this.solanaWallet.features[
        "solana:signTransaction"
      ].signTransaction(transaction);
    if (result.status === UserResponseStatus.REJECTED) {
      throw new Error("User rejected the request").message;
    }
    return result.args;
  }

  async signIn(input: AptosSignInInput) {
    const result =
      await this.solanaWallet.features["aptos:signIn"]!.signIn(input);
    if (result.status === UserResponseStatus.REJECTED) {
      throw new Error("User rejected the request").message;
    }
    return result.args;
  }

  async onAccountChange() {
    await this.solanaWallet.features["aptos:onAccountChange"].onAccountChange(
      async (account: AccountInfo) => {
        this.emit("accountChange", account);
      }
    );
  }

  async onNetworkChange(
    callback: (network: NetworkInfo) => void
  ): Promise<void> {
    await this.solanaWallet.features["aptos:onNetworkChange"].onNetworkChange(
      callback
    );
  }
}
