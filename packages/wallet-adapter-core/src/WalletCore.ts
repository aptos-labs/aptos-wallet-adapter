import { HexString, TxnBuilderTypes, Types } from "aptos";
import EventEmitter from "eventemitter3";
import nacl from "tweetnacl";
import { Buffer } from "buffer";

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
  WalletNotSupportedMethod,
  WalletSignAndSubmitMessageError,
  WalletSignMessageAndVerifyError,
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
  isRedirectable,
} from "./utils";
import { getNameByAddress } from "./ans";

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
      if (!wallet.readyState) {
        wallet.readyState =
          typeof window === "undefined" || typeof document === "undefined"
            ? WalletReadyState.Unsupported
            : WalletReadyState.NotDetected;
      }
      if (typeof window !== "undefined") {
        scopePollingDetectionStrategy(() => {
          const providerName = wallet.providerName || wallet.name.toLowerCase();
          if (Object.keys(window).includes(providerName)) {
            wallet.readyState = WalletReadyState.Installed;
            wallet.provider = window[providerName as any];
            this.emit("readyStateChange", wallet);
            return true;
          }
          return false;
        });
      }
    });
  }

  private doesWalletExist(): boolean | WalletNotConnectedError {
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

  private async setAnsName() {
    if (this._network?.chainId && this._account) {
      const name = await getNameByAddress(
        this._network.chainId,
        this._account.address
      );
      this._account.ansName = name;
    }
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

      if (
        !selectedWallet ||
        (selectedWallet.readyState !== WalletReadyState.Installed &&
          selectedWallet.readyState !== WalletReadyState.Loadable)
      ) {
        return;
      }

      if (this._connected) {
        // if the selected wallet is already connected, we don't need to connect again
        if (this.wallet?.name === walletName) return;

        await this.disconnect();
      }
      if (isRedirectable()) {
        // use wallet deep link
        if (selectedWallet.deeplinkProvider) {
          const url = encodeURIComponent(window.location.href);
          const location = selectedWallet.deeplinkProvider({ url });
          window.location.href = location;
        } else {
          return;
        }
      }
      this._connecting = true;
      this.setWallet(selectedWallet);
      const account = await selectedWallet.connect();
      this.setAccount({ ...account });
      const network = await selectedWallet.network();
      this.setNetwork({ ...network });
      await this.setAnsName();
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
      this.doesWalletExist();
      await this._wallet?.disconnect();
      this.clearData();
      this.emit("disconnect");
    } catch (error: any) {
      throw new WalletDisconnectionError(error).message;
    }
  }

  /** 
  Sign and submit an entry (not bcs serialized) transaction type to chain.
  @param transaction a non-bcs serialized transaction
  @return response from the wallet's signAndSubmitTransaction function
  @throws WalletSignAndSubmitMessageError
  */
  async signAndSubmitTransaction(
    transaction: Types.TransactionPayload
  ): Promise<any> {
    try {
      this.doesWalletExist();
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
  Sign and submit a bsc serialized transaction type to chain.
  @param transaction a bcs serialized transaction
  @return response from the wallet's signAndSubmitBCSTransaction function
  @throws WalletSignAndSubmitMessageError
  */
  async signAndSubmitBCSTransaction(
    transaction: TxnBuilderTypes.TransactionPayload
  ): Promise<any> {
    if (this._wallet && !("signAndSubmitBCSTransaction" in this._wallet)) {
      throw new WalletNotSupportedMethod(
        `Submit a BCS Transaction is not supported by ${this.wallet?.name}`
      ).message;
    }

    try {
      this.doesWalletExist();
      const response = await (this._wallet as any).signAndSubmitBCSTransaction(
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
    if (this._wallet && !("signTransaction" in this._wallet)) {
      throw new WalletNotSupportedMethod(
        `Sign Transaction is not supported by ${this.wallet?.name}`
      ).message;
    }

    try {
      this.doesWalletExist();
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
      this.doesWalletExist();
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
      this.doesWalletExist();
      await this._wallet?.onAccountChange(async (data: AccountInfo) => {
        this.setAccount({ ...data });
        await this.setAnsName();
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
      this.doesWalletExist();
      await this._wallet?.onNetworkChange(async (data: NetworkInfo) => {
        this.setNetwork({ ...data });
        await this.setAnsName();
        this.emit("networkChange", this._network);
      });
    } catch (error: any) {
      const errMsg =
        typeof error == "object" && "message" in error ? error.message : error;
      throw new WalletNetworkChangeError(errMsg).message;
    }
  }

  async signMessageAndVerify(message: SignMessagePayload): Promise<boolean> {
    try {
      this.doesWalletExist();
      if (!this._account) throw new Error("No account found!");
      const response = await this._wallet?.signMessage(message);
      if (!response)
        throw new WalletSignMessageAndVerifyError("Failed to sign a message")
          .message;
      // Verify that the bytes were signed using the private key that matches the known public key
      let verified = false;
      if (Array.isArray(response.signature)) {
        // multi sig wallets
        const { fullMessage, signature, bitmap } = response;
        if (bitmap) {
          const minKeysRequired = this._account.minKeysRequired as number;
          if (signature.length < minKeysRequired) {
            verified = false;
          } else {
            // Getting an array which marks the keys signing the message with 1, while marking 0 for the keys not being used.
            const bits = Array.from(bitmap).flatMap((n) =>
              Array.from({ length: 8 }).map((_, i) => (n >> i) & 1)
            );
            // Filter out indexes of the keys we need
            const index = bits.map((_, i) => i).filter((i) => bits[i]);

            const publicKeys = this._account.publicKey as string[];
            const matchedPublicKeys = publicKeys.filter(
              (_: string, i: number) => index.includes(i)
            );

            verified = true;
            for (let i = 0; i < signature.length; i++) {
              const isSigVerified = nacl.sign.detached.verify(
                Buffer.from(fullMessage),
                Buffer.from(signature[i], "hex"),
                Buffer.from(matchedPublicKeys[i], "hex")
              ); // `isSigVerified` should be `true` for every signature

              if (!isSigVerified) {
                verified = false;
                break;
              }
            }
          }
        } else {
          throw new WalletSignMessageAndVerifyError("Failed to get a bitmap")
            .message;
        }
      } else {
        // single sig wallets
        // support for when address doesnt have hex prefix (0x)
        const currentAccountPublicKey = new HexString(
          this._account.publicKey as string
        );
        // support for when address doesnt have hex prefix (0x)
        const signature = new HexString(response.signature);
        verified = nacl.sign.detached.verify(
          Buffer.from(response.fullMessage),
          Buffer.from(signature.noPrefix(), "hex"),
          Buffer.from(currentAccountPublicKey.noPrefix(), "hex")
        );
      }
      return verified;
    } catch (error: any) {
      const errMsg =
        typeof error == "object" && "message" in error ? error.message : error;
      throw new WalletSignMessageAndVerifyError(errMsg).message;
    }
  }
}
