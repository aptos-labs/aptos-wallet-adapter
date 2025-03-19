import {
  APTOS_CHAINS,
  AptosSignInInput,
  AptosSignInOutput,
  AptosSignMessageInput,
  AptosSignMessageOutput,
  AptosWallet,
  NetworkInfo,
  UserResponse,
  UserResponseStatus,
  WalletAccount,
} from "@aptos-labs/wallet-standard";
import { ethers, TransactionRequest } from "ethers";
import {
  AdapterWallet,
  WalletReadyState,
  UsdcBalance,
} from "@aptos-labs/wallet-adapter-aggregator-core";
import { convertEip6963WalletToAptosWallet } from "./utils";

export type EIP6963ProviderInfo = {
  info: {
    uuid: string;
    name: string;
    icon: `data:image/svg+xml;base64,${string}`;
    rdns: string;
  };
  provider: any;
};

export enum Eip6963Wallets {
  PhantomWallet = "Phantom",
  MetaMaskWallet = "MetaMask",
  BackpackWallet = "Backpack",
  CoinbaseWallet = "Coinbase Wallet",
  NightlyWallet = "Nightly",
  RabbyWallet = "Rabby Wallet",
}

export const Eip6963WalletUrls: Record<Eip6963Wallets, string> = {
  [Eip6963Wallets.PhantomWallet]: "https://phantom.app/",
  [Eip6963Wallets.MetaMaskWallet]: "https://metamask.io/",
  [Eip6963Wallets.BackpackWallet]: "https://www.backpack.app/",
  [Eip6963Wallets.CoinbaseWallet]: "https://www.coinbase.com/wallet",
  [Eip6963Wallets.NightlyWallet]: "https://nightly.app/",
  [Eip6963Wallets.RabbyWallet]: "https://rabby.io/",
};

export function fetchEthereumWallets(): AdapterWallet[] {
  const wallets: EIP6963ProviderInfo[] = [];
  const convertedWallets: AdapterWallet[] = [];

  const handleWalletDiscovery = (event: CustomEvent) => {
    const wallet = event.detail as EIP6963ProviderInfo;

    // Avoid duplicates
    if (!wallets.some((w) => w.info.uuid === wallet.info.uuid)) {
      wallets.push(wallet);
      convertedWallets.push(
        new Eip6963Wallet(convertEip6963WalletToAptosWallet(wallet), wallet)
      );
    }
  };

  window.addEventListener("eip6963:announceProvider", (event) => {
    handleWalletDiscovery(event as CustomEvent);
  });
  // Request wallets to announce themselves
  window.dispatchEvent(new Event("eip6963:requestProvider"));

  return convertedWallets;
}

export type Eip6963AccountInfo = {
  address: string;
  publicKey: Uint8Array<ArrayBufferLike>;
};

export type Eip6963Features = {
  "eip6963:connect": {
    connect: () => Promise<UserResponse<Eip6963AccountInfo>>;
    version: string;
  };
  "eip6963:account": {
    account: () => Promise<Eip6963AccountInfo>;
    version: string;
  };
  "eip6963:sendTransaction": {
    sendTransaction: (
      transaction: TransactionRequest,
      provider: ethers.BrowserProvider
    ) => Promise<UserResponse<string>>;
    version: string;
  };
  "eip6963:onAccountChange": {
    onAccountChange: (
      callback: (newAccount: Eip6963AccountInfo) => void
    ) => void;
    version: string;
  };
};

export type Eip6963BaseWallet = AptosWallet & {
  features: Eip6963Features;
};

export class Eip6963Wallet extends AdapterWallet<
  Eip6963AccountInfo,
  NetworkInfo,
  Eip6963AccountInfo,
  AptosSignMessageInput,
  AptosSignMessageOutput,
  TransactionRequest,
  TransactionRequest,
  Eip6963AccountInfo,
  NetworkInfo,
  TransactionRequest,
  string
> {
  readonly originChain = "Ethereum";
  readonly eip6963Wallet: Eip6963BaseWallet;
  readonly eip6963WalletProvider: EIP6963ProviderInfo;
  readonly version = "1.0.0";
  private provider?: ethers.BrowserProvider;

  accounts: WalletAccount[] = [];

  connected: boolean = false;

  constructor(
    eip6963Wallet: Eip6963BaseWallet,
    eip6963WalletProvider: EIP6963ProviderInfo
  ) {
    super();
    this.eip6963Wallet = eip6963Wallet;
    this.eip6963WalletProvider = eip6963WalletProvider;
  }

  get icon() {
    return this.eip6963Wallet.icon;
  }
  get name() {
    return this.eip6963Wallet.name;
  }
  get url() {
    return Eip6963WalletUrls[this.eip6963Wallet.name as Eip6963Wallets];
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

  async getAccount() {
    return await this.eip6963Wallet.features["eip6963:account"].account();
  }

  async getConnectedNetwork() {
    return await this.eip6963Wallet.features["aptos:network"].network();
  }

  async connect() {
    const result =
      await this.eip6963Wallet.features["eip6963:connect"].connect();
    if (result.status === UserResponseStatus.REJECTED) {
      throw new Error("User rejected the request").message;
    }
    await this.onAccountChange();
    await this.onNetworkChange();
    this.provider = new ethers.BrowserProvider(
      (await this.eip6963WalletProvider.provider) as ethers.Eip1193Provider,
      "any"
    );
    this.connected = true;
    return result.args;
  }

  async disconnect() {
    try {
      if (!this.connected) {
        return;
      }
      await this.eip6963Wallet.features["aptos:disconnect"].disconnect();
      this.connected = false;
    } catch (error: any) {
      throw new Error(error).message;
    }
  }

  async signMessage(message: AptosSignMessageInput) {
    const result =
      await this.eip6963Wallet.features["aptos:signMessage"].signMessage(
        message
      );
    if (result.status === UserResponseStatus.REJECTED) {
      throw new Error("User rejected the request").message;
    }
    return result.args;
  }

  async signTransaction(
    transaction: TransactionRequest
  ): Promise<TransactionRequest> {
    throw new Error("Not implemented");
  }

  async sendTransaction(transaction: TransactionRequest): Promise<string> {
    if (!this.provider) {
      throw new Error("Provider not connected");
    }
    const result = await this.eip6963Wallet.features[
      "eip6963:sendTransaction"
    ].sendTransaction(transaction, this.provider);
    if (result.status === UserResponseStatus.REJECTED) {
      throw new Error("User rejected the request").message;
    }
    return result.args;
  }

  async signIn(input: AptosSignInInput): Promise<AptosSignInOutput> {
    const result =
      await this.eip6963Wallet.features["aptos:signIn"]!.signIn(input);

    if (result.status === UserResponseStatus.REJECTED) {
      throw new Error("User rejected the request").message;
    }
    await this.onAccountChange();
    await this.onNetworkChange();

    this.provider = new ethers.BrowserProvider(
      (await this.eip6963WalletProvider.provider) as ethers.Eip1193Provider,
      "any"
    );
    this.connected = true;
    return result.args;
  }

  async onAccountChange() {
    await this.eip6963Wallet.features[
      "eip6963:onAccountChange"
    ].onAccountChange((account) => {
      // @ts-ignore-next-line
      this.emit("accountChange", account);
    });
  }

  async onNetworkChange() {
    await this.eip6963Wallet.features["aptos:onNetworkChange"].onNetworkChange(
      (newNetwork) => {
        this.emit("networkChange", newNetwork);
      }
    );
  }
}
