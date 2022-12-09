import { Types } from "aptos";
import EventEmitter from "eventemitter3";

import { WalletReadyState } from "./constants";
import {
  WalletAccountChangeError,
  WalletAccountError,
  WalletConnectionError,
  WalletDisconnectionError,
  WalletGetNetworkError,
  WalletNetworkChangeError,
  WalletNotConnectedError,
  WalletNotReadyError,
  WalletNotSelectedError,
  WalletSignAndSubmitMessageError,
  WalletSignMessageError,
  WalletSignTransactionError,
} from "./error";
import {
  AccountInfo,
  NetworkInfo,
  WalletName,
  SignMessagePayload,
  SignMessageResponse,
  Wallet,
  WalletInfo,
  WalletCoreEvents,
} from "./types";
import {
  removeLocalStorage,
  setLocalStorage,
  scopePollingDetectionStrategy,
} from "./utils";

export class WalletCore extends EventEmitter<WalletCoreEvents> {
  private _wallets: Wallet[] = [];
  private _wallet: Wallet | null = null;
  private _account: AccountInfo | null = null;
  private _network: NetworkInfo | null = null;

  private _connecting: boolean = false;
  private _connected: boolean = false;

  constructor(plugins: Wallet[]) {
    super();
    this._wallets = plugins;
    this.scopePollingDetectionStrategy();
  }

  private scopePollingDetectionStrategy() {
    this._wallets?.forEach((wallet: Wallet) => {
      wallet.readyState =
        typeof window === "undefined" || typeof document === "undefined"
          ? WalletReadyState.Unsupported
          : WalletReadyState.NotDetected;
      if (typeof window !== "undefined") {
        scopePollingDetectionStrategy(() => {
          if (Object.keys(window).includes(wallet.name.toLowerCase())) {
            wallet.readyState = WalletReadyState.Installed;
            wallet.provider = window[wallet.name.toLowerCase() as any];
            this.emit("readyStateChange", wallet);
            return true;
          }
          return false;
        });
      }
    });
  }

  private isWalletExists(): boolean | WalletNotConnectedError {
    if (!this._connected || this._connecting || !this._wallet)
      throw new WalletNotConnectedError().name;
    if (
      !(
        this._wallet.readyState === WalletReadyState.Loadable ||
        this._wallet.readyState === WalletReadyState.Installed
      )
    )
      throw new WalletNotReadyError().name;
    return true;
  }

  private clearData() {
    this._connected = false;
    this.setWallet(null);
    this.setAccount(null);
    this.setNetwork(null);
    removeLocalStorage();
  }

  setWallet(wallet: Wallet | null) {
    this._wallet = wallet;
  }

  setAccount(account: AccountInfo | null) {
    this._account = account;
  }

  setNetwork(network: NetworkInfo | null) {
    this._network = network;
  }

  isConnected(): boolean {
    return this._connected;
  }

  get wallets(): Wallet[] {
    return this._wallets;
  }

  /**
   * Getter for the current connected wallet
   * @return wallet info
   * @throws WalletNotSelectedError
   */
  get wallet(): WalletInfo | null {
    try {
      if (!this._wallet) return null;
      return {
        name: this._wallet.name,
        icon: this._wallet.icon,
        url: this._wallet.url,
      };
    } catch (error: any) {
      throw new WalletNotSelectedError(error).message;
    }
  }

  /**
   * Getter for the current connected account
   * @return account info
   * @throws WalletAccountError
   */
  get account(): AccountInfo | null {
    try {
      return this._account;
    } catch (error: any) {
      throw new WalletAccountError(error).message;
    }
  }

  /**
   * Getter for the current wallet network
   * @return network info
   * @throws WalletGetNetworkError
   */
  get network(): NetworkInfo | null {
    try {
      return this._network;
    } catch (error: any) {
      throw new WalletGetNetworkError(error).message;
    }
  }

  /** 
  Connects a wallet to the app. If a wallet is already connected,
  we first disconnect the current connected wallet and then connect the selected wallet.
  On connect success, we set the current account and the network, and keeping the selected wallet
  name in LocalStorage to support autoConnect function.

  @param walletName. The wallet name we want to connect as a WalletName type.
  @emit emits "connect" event
  @throws WalletConnectionError
  */
  async connect(walletName: WalletName): Promise<void> {
    try {
      const selectedWallet = this._wallets?.find(
        (wallet: Wallet) => wallet.name === walletName
      );
      if (!selectedWallet) return;
      if (selectedWallet.readyState !== WalletReadyState.Installed) return;
      if (this._connected) {
        await this.disconnect();
      }
      this._connecting = true;
      this.setWallet(selectedWallet);
      const account = await selectedWallet.connect();
      this.setAccount({ ...account });
      const network = await selectedWallet.network();
      this.setNetwork({ ...network });
      setLocalStorage(selectedWallet.name);
      this._connected = true;
      this.emit("connect", account);
    } catch (error: any) {
      this.clearData();
      throw new WalletConnectionError(error).message;
    } finally {
      this._connecting = false;
    }
  }

  /** 
  Disconnect the exisitng wallet. On success, we clear the 
  current account, current network and LocalStorage data.
  @emit emits "disconnect" event
  @throws WalletDisconnectionError
  */
  async disconnect(): Promise<void> {
    try {
      this.isWalletExists();
      await this._wallet?.disconnect();
      this.clearData();
      this.emit("disconnect");
    } catch (error: any) {
      throw new WalletDisconnectionError(error).message;
    }
  }

  /** 
  Sign and submit transaction to chain.
  @param transaction
  @return response from the wallet's signAndSubmitTransaction function
  @throws WalletSignAndSubmitMessageError
  */
  async signAndSubmitTransaction(
    transaction: Types.TransactionPayload
  ): Promise<any> {
    try {
      this.isWalletExists();
      const response = await this._wallet?.signAndSubmitTransaction(
        transaction
      );
      return response;
    } catch (error: any) {
      const errMsg =
        typeof error == "object" && "message" in error ? error.message : error;
      throw new WalletSignAndSubmitMessageError(errMsg).message;
    }
  }

  /** 
  Sign transaction (doesnt submit to chain).
  @param transaction
  @return response from the wallet's signTransaction function
  @throws WalletSignTransactionError
  */
  async signTransaction(
    transaction: Types.TransactionPayload
  ): Promise<Uint8Array | null> {
    try {
      if (this._wallet && !("signTransaction" in this._wallet)) return null;
      this.isWalletExists();
      const response = await (this._wallet as any).signTransaction(transaction);
      return response;
    } catch (error: any) {
      const errMsg =
        typeof error == "object" && "message" in error ? error.message : error;
      throw new WalletSignTransactionError(errMsg).message;
    }
  }

  /** 
  Sign message (doesnt submit to chain).
  @param message
  @return response from the wallet's signMessage function
  @throws WalletSignMessageError
  */
  async signMessage(
    message: SignMessagePayload
  ): Promise<SignMessageResponse | null> {
    try {
      this.isWalletExists();
      if (!this._wallet) return null;
      const response = await this._wallet?.signMessage(message);
      return response;
    } catch (error: any) {
      const errMsg =
        typeof error == "object" && "message" in error ? error.message : error;
      throw new WalletSignMessageError(errMsg).message;
    }
  }

  /** 
  Event for when account has changed on the wallet
  @return the new account info
  @throws WalletAccountChangeError
  */
  async onAccountChange(): Promise<void> {
    try {
      this.isWalletExists();
      await this._wallet?.onAccountChange((data: AccountInfo) => {
        this.setAccount({ ...data });
        this.emit("accountChange", this._account);
      });
    } catch (error: any) {
      const errMsg =
        typeof error == "object" && "message" in error ? error.message : error;
      throw new WalletAccountChangeError(errMsg).message;
    }
  }

  /** 
  Event for when network has changed on the wallet
  @return the new network info
  @throws WalletNetworkChangeError
  */
  async onNetworkChange(): Promise<void> {
    try {
      this.isWalletExists();
      await this._wallet?.onNetworkChange((data: NetworkInfo) => {
        this.setNetwork({ ...data });
        this.emit("networkChange", this._network);
      });
    } catch (error: any) {
      const errMsg =
        typeof error == "object" && "message" in error ? error.message : error;
      throw new WalletNetworkChangeError(errMsg).message;
    }
  }
}
