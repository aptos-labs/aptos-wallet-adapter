import { HexString, TxnBuilderTypes, Types, BCS } from "aptos";
import {
  AnyRawTransaction,
  AccountAuthenticator,
  AccountAuthenticatorEd25519,
  Ed25519PublicKey,
  InputGenerateTransactionOptions,
  Ed25519Signature,
  AptosConfig,
  generateTransactionPayload,
  InputSubmitTransactionData,
  PendingTransactionResponse,
  InputEntryFunctionDataWithRemoteABI,
} from "@aptos-labs/ts-sdk";
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
  SignMessagePayload,
  Wallet,
  WalletInfo,
  WalletCoreEvents,
  SignMessageResponse,
  InputTransactionData,
} from "./types";
import {
  removeLocalStorage,
  setLocalStorage,
  scopePollingDetectionStrategy,
  isRedirectable,
  generalizedErrorMessage,
} from "./utils";
import { getNameByAddress } from "./ans";
import {
  convertNetwork,
  convertV2TransactionPayloadToV1BCSPayload,
  convertV2PayloadToV1JSONPayload,
} from "./conversion";
import { WalletCoreV1 } from "./WalletCoreV1";

export class WalletCore extends EventEmitter<WalletCoreEvents> {
  private _wallets: ReadonlyArray<Wallet> = [];
  private _wallet: Wallet | null = null;
  private _account: AccountInfo | null = null;
  private _network: NetworkInfo | null = null;
  private readonly waletCoreV1: WalletCoreV1 = new WalletCoreV1();

  private _connecting: boolean = false;
  private _connected: boolean = false;

  constructor(plugins: ReadonlyArray<Wallet>) {
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

  get wallets(): ReadonlyArray<Wallet> {
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
   * We first make sure we can connect a dapp to a wallet.
   * If all good, we connect the wallet by calling `this.connectWallet`
   * @param walletName. The wallet name we want to connect.
   */
  async connect(walletName: string): Promise<void | string> {
    const selectedWallet = this._wallets?.find(
      (wallet: Wallet) => wallet.name === walletName
    );

    if (!selectedWallet) return;

    if (this._connected) {
      // if the selected wallet is already connected, we don't need to connect again
      if (selectedWallet.name === walletName)
        throw new WalletConnectionError(
          `${walletName} wallet is already connected`
        ).message;
    }

    // check if we are in a redirectable view (i.e on mobile AND not in an in-app browser) and
    // since wallet readyState can be NotDetected, we check it before the next check
    if (isRedirectable()) {
      // use wallet deep link
      if (selectedWallet.deeplinkProvider) {
        const url = encodeURIComponent(window.location.href);
        const location = selectedWallet.deeplinkProvider({ url });
        window.location.href = location;
      }
    }
    if (
      selectedWallet.readyState !== WalletReadyState.Installed &&
      selectedWallet.readyState !== WalletReadyState.Loadable
    ) {
      return;
    }

    // Now we can connect to the wallet
    await this.connectWallet(selectedWallet);
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
  async connectWallet(selectedWallet: Wallet) {
    try {
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

      const errMsg = generalizedErrorMessage(error);
      throw new WalletConnectionError(errMsg).message;
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
      const errMsg = generalizedErrorMessage(error);
      throw new WalletDisconnectionError(errMsg).message;
    }
  }

  /**
   * Signs and submits a transaction to chain
   *
   * @param transactionInput InputTransactionData
   * @param options optional. A configuration object to generate a transaction by
   * @returns The pending transaction hash (V1 output) | PendingTransactionResponse (V2 output)
   */
  async signAndSubmitTransaction(
    transactionInput: InputTransactionData
  ): Promise<
    { hash: Types.HexEncodedBytes; output?: any } | PendingTransactionResponse
  > {
    try {
      this.doesWalletExist();

      // wallet supports sdk v2
      if (this._wallet?.version === "v2") {
        const response = await this._wallet.signAndSubmitTransaction({
          ...transactionInput,
          sender: transactionInput.sender ?? this._account!.address,
        });
        // response should be PendingTransactionResponse
        return response;
      }

      // get the payload piece from the input
      const payloadData = transactionInput.data;

      // if first function arguments is an object (i.e a bcs serialized argument)
      // we assume the transaction should be a bcs serialized transaction
      if (typeof payloadData.functionArguments[0] === "object") {
        const aptosConfig = new AptosConfig({
          network: convertNetwork(this._network),
        });
        const newPayload = await generateTransactionPayload({
          ...(payloadData as InputEntryFunctionDataWithRemoteABI),
          aptosConfig: aptosConfig,
        });
        const oldTransactionPayload =
          convertV2TransactionPayloadToV1BCSPayload(newPayload);
        const response = await this.waletCoreV1.signAndSubmitBCSTransaction(
          oldTransactionPayload,
          this._wallet!,
          {
            max_gas_amount: transactionInput.options?.maxGasAmount
              ? BigInt(transactionInput.options?.maxGasAmount)
              : undefined,
            gas_unit_price: transactionInput.options?.gasUnitPrice
              ? BigInt(transactionInput.options?.gasUnitPrice)
              : undefined,
          }
        );
        const { hash, ...output } = response;
        return { hash, output };
      }

      // if it is not a bcs serialized arguments transaction, convert to the old
      // json format
      const oldTransactionPayload =
        convertV2PayloadToV1JSONPayload(payloadData);
      const response = await this.waletCoreV1.signAndSubmitTransaction(
        oldTransactionPayload,
        this._wallet!,
        {
          max_gas_amount: transactionInput.options?.maxGasAmount
            ? BigInt(transactionInput.options?.maxGasAmount)
            : undefined,
          gas_unit_price: transactionInput.options?.gasUnitPrice
            ? BigInt(transactionInput.options?.gasUnitPrice)
            : undefined,
        }
      );
      const { hash, ...output } = response;
      return { hash, output };
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
   * @param transactionOrPayload AnyRawTransaction - V2 input | Types.TransactionPayload - V1 input
   * @param options optional. V1 input
   *
   * @returns AccountAuthenticator
   */
  async signTransaction(
    transactionOrPayload: AnyRawTransaction | Types.TransactionPayload,
    asFeePayer?: boolean,
    options?: InputGenerateTransactionOptions
  ): Promise<AccountAuthenticator> {
    try {
      this.doesWalletExist();
      // if input is AnyRawTransaction, i.e V2
      if ("rawTransaction" in transactionOrPayload) {
        if (this._wallet?.version !== "v2") {
          throw new WalletNotSupportedMethod(
            `Sign Transaction V2 is not supported by ${this.wallet?.name}`
          ).message;
        }
        const accountAuthenticator = (this._wallet as any).signTransaction(
          transactionOrPayload,
          asFeePayer
        );

        return accountAuthenticator;
      }

      // check current signTransaction function exists
      if (this._wallet && !("signTransaction" in this._wallet)) {
        throw new WalletNotSupportedMethod(
          `Sign Transaction is not supported by ${this.wallet?.name}`
        ).message;
      }

      const response = await this.waletCoreV1.signTransaction(
        transactionOrPayload as Types.TransactionPayload,
        this._wallet!,
        {
          max_gas_amount: options?.maxGasAmount
            ? BigInt(options?.maxGasAmount)
            : undefined,
          gas_unit_price: options?.gasUnitPrice
            ? BigInt(options?.gasUnitPrice)
            : undefined,
        }
      );
      if (!response) {
        throw new Error("error");
      }

      // Convert retuned bcs serialized SignedTransaction into V2 AccountAuthenticator
      const deserializer1 = new BCS.Deserializer(response);
      const deserializedSignature =
        TxnBuilderTypes.SignedTransaction.deserialize(deserializer1);
      const transactionAuthenticator =
        deserializedSignature.authenticator as TxnBuilderTypes.TransactionAuthenticatorEd25519;

      const publicKey = transactionAuthenticator.public_key.value;
      const signature = transactionAuthenticator.signature.value;

      const accountAuthenticator = new AccountAuthenticatorEd25519(
        new Ed25519PublicKey(publicKey),
        new Ed25519Signature(signature)
      );
      return accountAuthenticator;
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignTransactionError(errMsg).message;
    }
  }

  /**
   Sign message (doesnt submit to chain).
   @param message
   @return response from the wallet's signMessage function
   @throws WalletSignMessageError
   */
  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    try {
      this.doesWalletExist();
      const response = await this._wallet!.signMessage(message);
      return response;
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignMessageError(errMsg).message;
    }
  }

  async submitTransaction(
    transaction: InputSubmitTransactionData
  ): Promise<PendingTransactionResponse> {
    if (this._wallet && !("submitTransaction" in this._wallet)) {
      throw new WalletNotSupportedMethod(
        `Submit Transaction is not supported by ${this.wallet?.name}`
      ).message;
    }
    try {
      this.doesWalletExist();
      const pendingTransaction = (this._wallet as any).submitTransaction(
        transaction
      );

      return pendingTransaction;
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
      this.doesWalletExist();
      await this._wallet?.onAccountChange(async (data: AccountInfo) => {
        this.setAccount({ ...data });
        await this.setAnsName();
        this.emit("accountChange", this._account);
      });
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
      this.doesWalletExist();
      await this._wallet?.onNetworkChange(async (data: NetworkInfo) => {
        this.setNetwork({ ...data });
        await this.setAnsName();
        this.emit("networkChange", this._network);
      });
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletNetworkChangeError(errMsg).message;
    }
  }

  /**
   * Signs a message and verifies the signer
   * @param message SignMessagePayload
   * @returns boolean
   */
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
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignMessageAndVerifyError(errMsg).message;
    }
  }
}
