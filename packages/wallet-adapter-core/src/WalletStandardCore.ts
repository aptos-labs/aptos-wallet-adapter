import {
  Wallet as AptosWallet,
  AptosConnectOutput,
  UserResponse,
  AccountInfo,
  NetworkInfo,
  getWallets,
  isWalletWithRequiredFeatureSet,
  WalletWithRequiredFeatures,
  AptosSignMessageInput,
} from "@aptos-labs/wallet-standard";
import EventEmitter from "eventemitter3";
import {
  generalizedErrorMessage,
  isRedirectable,
  removeLocalStorage,
  setLocalStorage,
} from "./utils";
import { WalletConnectionError } from "./error";
import {
  Aptos,
  AptosConfig,
  Network,
  NetworkToNodeAPI,
} from "@aptos-labs/ts-sdk";

export declare interface WalletStandardCoreEvents {
  connect(account: AccountInfo | null): void;
  disconnect(): void;
  networkChange(network: NetworkInfo | null): void;
  accountChange(account: AccountInfo | null): void;
}

export class WaletStandardCore extends EventEmitter<WalletStandardCoreEvents> {
  private _wallets: WalletWithRequiredFeatures[] = [];
  private _wallet: WalletWithRequiredFeatures | null = null;
  private _account: AccountInfo | null = null;
  private _network: NetworkInfo | null = null;

  private _connecting: boolean = false;
  private _connected: boolean = false;

  constructor() {
    super();
    this.fetchStandardWallets();
  }

  get wallets() {
    return this._wallets;
  }

  get wallet() {
    return this._wallet;
  }

  get network() {
    return this._network;
  }

  get account() {
    return this._account;
  }

  setWallet(wallet: WalletWithRequiredFeatures | null) {
    this._wallet = wallet;
  }

  setAccount(account: AccountInfo | null) {
    this._account = account;
  }

  setNetwork(network: NetworkInfo | null) {
    this._network = network;
  }

  private fetchStandardWallets() {
    const { get } = getWallets();

    const wallets = get();

    wallets.map((wallet: AptosWallet) => {
      const isAptos = isWalletWithRequiredFeatureSet(wallet);
      if (isAptos) {
        this._wallets.push(wallet);
      }
    });
  }

  private clearData() {
    this._connected = false;
    this.setWallet(null);
    this.setAccount(null);
    this.setNetwork(null);
    removeLocalStorage();
  }

  async connect(
    selectedWallet: WalletWithRequiredFeatures
  ): Promise<UserResponse<AptosConnectOutput> | void> {
    // if (isRedirectable()) {
    //   // use wallet deep link
    //   if (selectedWallet.features["aptos:openInMobileApp"]) {
    //     const url = encodeURIComponent(window.location.href);
    //     await this.openInMobileApp(selectedWallet, url);
    //     return;
    //   }
    // }
    this.connectWallet(selectedWallet);
  }

  async connectWallet(selectedWallet: WalletWithRequiredFeatures) {
    try {
      this._connecting = true;
      this.setWallet(selectedWallet);
      const account = await selectedWallet.features["aptos:connect"].connect();
      //this.setAccount({ ...account });
      //const network = await selectedWallet.features["aptos:network"].network();
      //this.setNetwork({ ...network });
      setLocalStorage(selectedWallet.name);
      this._connected = true;
      //this.emit("connect", account);
    } catch (error: any) {
      this.clearData();

      const errMsg = generalizedErrorMessage(error);
      throw new WalletConnectionError(errMsg).message;
    } finally {
      this._connecting = false;
    }
  }

  // async openInMobileApp(
  //   selectedStandardWallets: AptosWallet,
  //   url: string
  // ): Promise<void> {
  //   await selectedStandardWallets.features[
  //     "aptos:openInMobileApp"
  //   ].openInMobileApp(url);
  // }

  async disconnect() {
    await this.wallet?.features["aptos:disconnect"].disconnect();
    this.clearData();
  }

  // async signAndSubmitTransaction(transactionInput: InputTransactionData) {
  //   if (!this.network) return;
  //   if (!this.account) return;
  //   const aptosConfig = new AptosConfig({
  //     network: this.convertNetwork[this.network],
  //   });
  //   const aptos = new Aptos(aptosConfig);
  //   const transaction = await aptos.build.simple({
  //     sender: this.account.account.accountAddress,
  //     data: transactionInput.data,
  //     options: transactionInput.options,
  //   });
  //   await await this.wallet?.features[
  //     "aptos:signAndSubmitTransaction"
  //   ].signAndSubmitTransaction(transaction);
  // }

  async signMessage(message: AptosSignMessageInput) {
    await this.wallet?.features["aptos:signMessage"].signMessage(message);
  }

  // old => new
  convertNetwork(networkInfo: NetworkInfo | null): Network {
    switch (networkInfo?.name.toLowerCase()) {
      case "mainnet" as Network:
        return Network.MAINNET;
      case "testnet" as Network:
        return Network.TESTNET;
      case "devnet" as Network:
        return Network.DEVNET;
      default:
        throw new Error("Invalid network name");
    }
  }
}
