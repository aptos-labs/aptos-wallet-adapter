import {
  AdapterWallet,
  WalletReadyState,
} from "@aptos-labs/wallet-adapter-aggregator-core";
import {
  AccountInfo,
  NetworkInfo,
  WalletCore,
  AdapterWallet as AptosBaseWallet,
  AnyRawTransaction,
  InputTransactionData,
  AccountAuthenticator,
  AdapterNotDetectedWallet,
} from "@aptos-labs/wallet-adapter-core";
import {
  APTOS_CHAINS,
  AptosSignInInput,
  AptosSignInOutput,
  AptosSignMessageInput,
  AptosSignMessageOutput,
  WalletAccount,
} from "@aptos-labs/wallet-standard";

export const getAptosWallets = (): AdapterWallet[] => {
  const walletCore = new WalletCore();
  const wallets = walletCore.wallets.map(
    (wallet) => new AptosWallet(wallet, walletCore)
  );
  return wallets;
};

export const getAptosNotDetectedWallets = (): AptosNotDetectedWallet[] => {
  const walletCore = new WalletCore();
  const wallets = walletCore.notDetectedWallets.map(
    (wallet) => new AptosNotDetectedWallet(wallet, walletCore)
  );
  return wallets;
};

export class AptosNotDetectedWallet {
  readonly originChain = "Aptos";
  readonly version = "1.0.0";
  readonly aptosWallet: AdapterNotDetectedWallet;
  readonly walletCore: WalletCore;

  constructor(aptosWallet: AdapterNotDetectedWallet, walletCore: WalletCore) {
    this.aptosWallet = aptosWallet;
    this.walletCore = walletCore;
  }

  get icon() {
    return this.aptosWallet.icon;
  }
  get name() {
    return this.aptosWallet.name;
  }
  get url() {
    return this.aptosWallet.url;
  }

  get readyState() {
    return WalletReadyState.NotDetected;
  }
}
export class AptosWallet extends AdapterWallet<
  AccountInfo,
  NetworkInfo,
  AccountInfo | null,
  AptosSignMessageInput,
  AptosSignMessageOutput,
  {
    transactionOrPayload: AnyRawTransaction | InputTransactionData;
    asFeePayer?: boolean;
  },
  {
    authenticator: AccountAuthenticator;
    rawTransaction: Uint8Array;
  },
  AccountInfo,
  NetworkInfo,
  AptosSignInOutput
> {
  readonly originChain = "Aptos";
  readonly aptosWallet: AptosBaseWallet;
  readonly walletCore: WalletCore;
  readonly version = "1.0.0";

  accounts: WalletAccount[] = [];

  connected: boolean = false;

  constructor(aptosWallet: AptosBaseWallet, walletCore: WalletCore) {
    super();
    this.aptosWallet = aptosWallet;
    this.walletCore = walletCore;
  }

  get icon() {
    return this.aptosWallet.icon;
  }
  get name() {
    return this.aptosWallet.name;
  }
  get url() {
    return this.aptosWallet.url;
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
    const account = await this.walletCore.account;
    if (!account) {
      throw new Error("Account not found");
    }
    return account;
  }

  async getConnectedNetwork(): Promise<NetworkInfo> {
    const network = await this.walletCore.network;
    if (!network) {
      throw new Error("Network not found");
    }
    return network;
  }

  async connect(): Promise<AccountInfo | null> {
    await this.walletCore.connect(this.name);
    this.onAccountChange();
    this.connected = true;
    return this.walletCore.account;
  }

  async disconnect() {
    if (!this.connected) {
      return;
    }
    this.walletCore.off("accountChange");
    await this.walletCore.disconnect();
    this.connected = false;
  }

  async signMessage(message: AptosSignMessageInput) {
    const result = await this.walletCore.signMessage(message);
    return result;
  }

  async signTransaction(args: {
    transactionOrPayload: AnyRawTransaction | InputTransactionData;
    asFeePayer?: boolean;
  }): Promise<{
    authenticator: AccountAuthenticator;
    rawTransaction: Uint8Array;
  }> {
    const result = await this.walletCore.signTransaction(args);
    return result;
  }

  async signIn(input: AptosSignInInput): Promise<AptosSignInOutput> {
    const result = await this.walletCore.signIn({
      input: {
        nonce: input.nonce ?? Math.random().toString(16),
        uri: input.uri ?? window.location.origin,
        version: input.version ?? "0.1.0",
        chainId: input.chainId ?? "1",
        issuedAt: input.issuedAt ?? new Date().toISOString(),
        expirationTime:
          input.expirationTime ??
          new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        notBefore: input.notBefore ?? new Date().toISOString(),
        requestId: input.requestId ?? Math.random().toString(16),
        resources: input.resources ?? [],
      },
      walletName: this.name,
    });
    return result;
  }

  onAccountChange() {
    this.walletCore.onAccountChange();
    this.walletCore.on(
      "accountChange",
      async (accountInfo: AccountInfo | null) => {
        this.emit("accountChange", accountInfo);
      }
    );
  }

  async onNetworkChange(
    callback: (network: NetworkInfo) => void
  ): Promise<void> {
    await this.walletCore.onNetworkChange();
  }
}
