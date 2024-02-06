import {
  AptosConnectOutput,
  UserResponse,
  AccountInfo,
  NetworkInfo,
  getAptosWallets,
  AptosSignTransactionOutput,
  AptosSignMessageOutput,
  AptosSignMessageInput,
  AptosWallet,
  UserResponseStatus,
} from "@aptos-labs/wallet-standard";
import {
  AnyRawTransaction,
  AptosConfig,
  InputSubmitTransactionData,
  PendingTransactionResponse,
  Aptos,
  MultiEd25519Signature,
  MultiEd25519PublicKey,
} from "@aptos-labs/ts-sdk";
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
  WalletSignMessageAndVerifyError,
  WalletSignMessageError,
  WalletSignTransactionError,
} from "./error";
import { WalletCoreEvents, InputTransactionData } from "./types";
import {
  removeLocalStorage,
  setLocalStorage,
  isRedirectable,
  generalizedErrorMessage,
} from "./utils";
import { getNameByAddress } from "./ans";
import { convertNetwork } from "./conversion";

export type IAptosWallet = AptosWallet & {
  readyState?: WalletReadyState;
};
export class WalletCore extends EventEmitter<WalletCoreEvents> {
  private _wallets: IAptosWallet[] = [];
  private _wallet: IAptosWallet | undefined = undefined;
  private _account: AccountInfo | undefined = undefined;
  private _network: NetworkInfo | undefined = undefined;

  private _connecting: boolean = false;
  private _connected: boolean = false;

  constructor() {
    super();
    this.fetchAptosWallets();
  }

  private fetchAptosWallets() {
    let { aptosWallets, on } = getAptosWallets();
    this.setWallets(aptosWallets);

    if (typeof window === "undefined") return;
    // Adds an event listener for new wallets that get registered after the dapp has been loaded,
    // receiving an unsubscribe function, which it can later use to remove the listener
    const that = this;
    const removeRegisterListener = on("register", function () {
      let { aptosWallets } = getAptosWallets();
      that.setWallets(aptosWallets);
    });

    const removeUnregisterListener = on("unregister", function () {
      let { aptosWallets } = getAptosWallets();
      that.setWallets(aptosWallets);
    });
  }

  private setWallets(wallets: readonly AptosWallet[]) {
    const aptosWallets: IAptosWallet[] = [];

    wallets.map((wallet: AptosWallet) => {
      (wallet as IAptosWallet).readyState = WalletReadyState.Installed;
      aptosWallets.push(wallet as IAptosWallet);
    });
    this._wallets = aptosWallets;
    this.emit("walletsAdded", this._wallets);
  }

  private ensureWalletExists(
    wallet: IAptosWallet | undefined
  ): asserts wallet is IAptosWallet {
    if (!wallet) {
      throw new WalletNotConnectedError().name;
    }
    if (!this._connected || this._connecting)
      throw new WalletNotConnectedError().name;
    if (
      !(
        wallet.readyState === WalletReadyState.Loadable ||
        wallet.readyState === WalletReadyState.Installed
      )
    )
      throw new WalletNotReadyError().name;
  }

  private ensureAccountExists(
    account: AccountInfo | undefined
  ): asserts account is AccountInfo {
    if (!account) {
      throw new WalletAccountError().name;
    }
  }

  private clearData() {
    this._connected = false;
    this.setWallet(undefined);
    this.setAccount(undefined);
    this.setNetwork(undefined);
    removeLocalStorage();
  }

  private async setAnsName() {
    if (this._account?.ansName) return;
    // If the wallet doesnt have the account ANS name
    // we try fetch it ourselves
    if (this._network?.chainId && this._account) {
      const name = await getNameByAddress(
        this._network.chainId.toString(),
        this._account.address.toString()
      );
      this._account.ansName = name;
    }
  }

  setWallet(wallet: IAptosWallet | undefined) {
    this._wallet = wallet;
  }

  setAccount(account: AccountInfo | undefined) {
    this._account = account;
  }

  setNetwork(network: NetworkInfo | undefined) {
    this._network = network;
  }

  isConnected(): boolean {
    return this._connected;
  }

  get wallets(): ReadonlyArray<IAptosWallet> {
    return this._wallets;
  }

  /**
   * Getter for the current connected wallet
   * @return wallet info
   * @throws WalletNotSelectedError
   */
  get wallet(): IAptosWallet | undefined {
    try {
      return this._wallet;
    } catch (error: any) {
      throw new WalletNotSelectedError(error).message;
    }
  }

  /**
   * Getter for the current connected account
   * @return account info
   * @throws WalletAccountError
   */
  get account(): AccountInfo | undefined {
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
  get network(): NetworkInfo | undefined {
    try {
      return this._network;
    } catch (error: any) {
      throw new WalletGetNetworkError(error).message;
    }
  }

  /**
   * We first make sure we can connect a dapp to a wallet.
   * If all good, we connect the wallet by calling `this.connectWallet`
   * @param walletName. The wallet name we want to connect.
   */
  async connect(
    walletName: string,
    silent?: boolean,
    networkInfo?: NetworkInfo
  ): Promise<void | UserResponse<AptosConnectOutput>> {
    // if the selected wallet is already connected, if it does we don't need to connect again
    if (this._connected) {
      if (this._wallet?.name === walletName)
        throw new WalletConnectionError(
          `${walletName} wallet is already connected`
        ).message;
    }

    const selectedWallet = this._wallets?.find(
      (wallet: IAptosWallet) => wallet.name === walletName
    );

    if (!selectedWallet) return;

    // check if we are in a redirectable view (i.e on mobile AND not in an in-app browser) and
    // since wallet readyState can be NotDetected, we check it before the next check
    if (isRedirectable()) {
      // use wallet deep link
      if (selectedWallet.features["aptos:openInMobileApp"]) {
        await selectedWallet.features[
          "aptos:openInMobileApp"
        ].openInMobileApp();
        return;
      }
    }
    if (
      selectedWallet.readyState !== WalletReadyState.Installed &&
      selectedWallet.readyState !== WalletReadyState.Loadable
    ) {
      return;
    }

    // Now we can connect to the wallet
    await this.connectWallet(selectedWallet, silent, networkInfo);
  }

  /**
   * Connects a wallet to the dapp.
   * On connect success, we set the current account and the network, and keeping the selected wallet
   * name in LocalStorage to support autoConnect function.
   *
   * @param selectedWallet. The wallet we want to connect.
   * @emit emits "connect" event
   * @throws WalletConnectionError
   */
  async connectWallet(
    selectedWallet: IAptosWallet,
    silent?: boolean,
    networkInfo?: NetworkInfo
  ) {
    try {
      this._connecting = true;
      const account = await selectedWallet.features["aptos:connect"].connect(
        silent,
        networkInfo
      );
      if (account.status === UserResponseStatus.REJECTED) {
        this._connecting = false;
        throw new WalletConnectionError("User has rejected the request")
          .message;
      }
      this.setWallet(selectedWallet);
      this.setAccount(account.args);
      const network = await this._wallet?.features["aptos:network"].network();
      this.setNetwork(network);

      await this.setAnsName();
      setLocalStorage(selectedWallet.name);
      this._connected = true;
      this.emit("connect", account.args);
    } catch (error: any) {
      this.clearData();
      const errMsg = generalizedErrorMessage(error);
      throw new WalletConnectionError(errMsg, error);
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
      this.ensureWalletExists(this._wallet);
      await this._wallet.features["aptos:disconnect"].disconnect();
      this.clearData();
      this.emit("disconnect");
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletDisconnectionError(errMsg).message;
    }
  }

  /**
   * Signs and submits a transaction to chain
   *
   * @param transactionInput InputTransactionData
   * @returns PendingTransactionResponse
   */
  async signAndSubmitTransaction(
    transactionInput: InputTransactionData
  ): Promise<PendingTransactionResponse> {
    try {
      this.ensureWalletExists(this._wallet);
      this.ensureAccountExists(this._account);

      const aptosConfig = new AptosConfig({
        network: convertNetwork(this._network!.name),
      });

      const aptos = new Aptos(aptosConfig);

      const transaction = await aptos.transaction.build.simple({
        sender: this._account.address.toString(),
        data: transactionInput.data,
        options: transactionInput.options,
      });

      if (this._wallet.features["aptos:signAndSubmitTransaction"]) {
        const response =
          await this._wallet.features[
            "aptos:signAndSubmitTransaction"
          ].signAndSubmitTransaction(transaction);

        if (response.status === UserResponseStatus.REJECTED) {
          throw new WalletConnectionError("User has rejected the request")
            .message;
        }
        return response.args;
      }

      const senderAuthenticator = await this.signTransaction(transaction);
      const response = await this.submitTransaction({
        transaction,
        senderAuthenticator,
      });
      return response;
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignAndSubmitMessageError(errMsg).message;
    }
  }

  /**
   * Signs a transaction
   *
   * To support both existing wallet adapter V1 and V2, we support 2 input types
   *
   * @param transactionOrPayload AnyRawTransaction
   * @param options asFeePayer. To sign a transaction as the fee payer sponsor
   *
   * @returns AptosSignTransactionOutput
   */
  async signTransaction(
    transaction: AnyRawTransaction,
    asFeePayer?: boolean
  ): Promise<AptosSignTransactionOutput> {
    this.ensureWalletExists(this._wallet);
    const response = await this._wallet.features[
      "aptos:signTransaction"
    ].signTransaction(transaction, asFeePayer);
    if (response.status === UserResponseStatus.REJECTED) {
      throw new WalletConnectionError("User has rejected the request").message;
    }
    return response.args;
  }

  /**
   Sign message (doesnt submit to chain).

   @param message AptosSignMessageInput
   @return AptosSignMessageOutput
   @throws WalletSignMessageError
   */
  async signMessage(
    message: AptosSignMessageInput
  ): Promise<AptosSignMessageOutput> {
    try {
      this.ensureWalletExists(this._wallet);
      const response =
        await this._wallet.features["aptos:signMessage"].signMessage(message);
      if (response.status === UserResponseStatus.REJECTED) {
        throw new WalletConnectionError("User has rejected the request")
          .message;
      }
      return response.args;
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignMessageError(errMsg).message;
    }
  }

  async submitTransaction(
    transaction: InputSubmitTransactionData
  ): Promise<PendingTransactionResponse> {
    try {
      this.ensureWalletExists(this._wallet);
      const { additionalSignersAuthenticators } = transaction;
      const aptosConfig = new AptosConfig({
        network: convertNetwork(
          (await this._wallet.features["aptos:network"].network()).name
        ),
      });
      const aptos = new Aptos(aptosConfig);
      if (additionalSignersAuthenticators !== undefined) {
        const multiAgentTxn = {
          ...transaction,
          additionalSignersAuthenticators,
        };
        return aptos.transaction.submit.multiAgent(multiAgentTxn);
      } else {
        return aptos.transaction.submit.simple(transaction);
      }
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignTransactionError(errMsg).message;
    }
  }

  /**
  Event for when account has changed on the wallet
  @return the new account info
  @throws WalletAccountChangeError
  */
  async onAccountChange(): Promise<void> {
    try {
      this.ensureWalletExists(this._wallet);
      await this._wallet.features["aptos:onAccountChange"].onAccountChange(
        async (data: AccountInfo) => {
          this.setAccount({ ...data });
          await this.setAnsName();
          this.emit("accountChange", data);
        }
      );
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
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
      this.ensureWalletExists(this._wallet);
      await this._wallet.features["aptos:onNetworkChange"].onNetworkChange(
        async (data: NetworkInfo) => {
          this.setNetwork({ ...data });
          await this.setAnsName();
          this.emit("networkChange", data);
        }
      );
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletNetworkChangeError(errMsg).message;
    }
  }

  /**
   * Signs a message and verifies the signer
   * @param message AptosSignMessageInput
   * @returns boolean
   */
  async signMessageAndVerify(message: AptosSignMessageInput): Promise<boolean> {
    try {
      this.ensureWalletExists(this._wallet);
      if (!this._account) throw new Error("No account found!");

      // sign the message
      const response = await this.signMessage(message);
      if (!response)
        throw new WalletSignMessageAndVerifyError("Failed to sign a message")
          .message;

      let verified = false;
      // if is a multi sig wallet with a MultiEd25519Signature type
      // TODO support MultiKey
      if (response.signature instanceof MultiEd25519Signature) {
        if (!(this._account.publicKey instanceof MultiEd25519PublicKey)) {
          throw new WalletSignMessageAndVerifyError(
            "Public key and Signature type mismatch"
          ).message;
        }
        const { fullMessage, signature } = response;
        const bitmap = signature.bitmap;
        if (bitmap) {
          const minKeysRequired = this._account.publicKey.threshold;
          if (signature.signatures.length < minKeysRequired) {
            verified = false;
          } else {
            verified = this._account.publicKey.verifySignature({
              message: fullMessage,
              signature,
            });
          }
        }
      } else {
        // TODO support secp256k1 and SingleKey
        verified = this._account.publicKey.verifySignature({
          message: response.fullMessage,
          signature: response.signature,
        });
      }
      return verified;
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignMessageAndVerifyError(errMsg).message;
    }
  }
}
