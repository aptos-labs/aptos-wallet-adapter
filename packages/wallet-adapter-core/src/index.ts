import { Types } from "aptos";
import { EventEmitter } from "eventemitter3";

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
  private _wallets: Wallet[] | null = null;
  private _wallet: Wallet | null = null;
  private _account: AccountInfo | null = null;
  private _network: NetworkInfo | null = null;

  private _connecting: boolean = false;
  private _connected: boolean = false;

  constructor(plugins: Wallet[]) {
    super();
    this._wallets = plugins;
    this._wallets.forEach((wallet: Wallet) => {
      wallet.readyState =
        typeof window === "undefined" || typeof document === "undefined"
          ? WalletReadyState.Unsupported
          : WalletReadyState.NotDetected;
      if (
        typeof window !== "undefined" &&
        wallet.readyState !== WalletReadyState.Unsupported
      ) {
        scopePollingDetectionStrategy(() => {
          if ("provider" in wallet && wallet.provider) {
            wallet.readyState = WalletReadyState.Installed;
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

  get account(): AccountInfo | null {
    try {
      return this._account;
    } catch (error: any) {
      throw new WalletAccountError(error).message;
    }
  }

  get network(): NetworkInfo | null {
    try {
      return this._network;
    } catch (error: any) {
      throw new WalletGetNetworkError(error).message;
    }
  }

  async connect(walletName: WalletName): Promise<void> {
    try {
      this._connecting = true;
      const selectedWallet = this._wallets?.find(
        (wallet: Wallet) => wallet.name === walletName
      );
      if (!selectedWallet) return;
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

  async disconnect(): Promise<void> {
    try {
      await this._wallet?.disconnect();
      this._connected = false;
      this.clearData();
      this.emit("disconnect");
    } catch (error: any) {
      throw new WalletDisconnectionError(error).message;
    }
  }

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
