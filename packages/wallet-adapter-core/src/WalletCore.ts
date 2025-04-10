import EventEmitter from "eventemitter3";
import {
  AccountAddress,
  AccountAuthenticator,
  AnyPublicKey,
  AnyPublicKeyVariant,
  AnyRawTransaction,
  Aptos,
  Ed25519PublicKey,
  InputSubmitTransactionData,
  MultiEd25519PublicKey,
  MultiEd25519Signature,
  Network,
  NetworkToChainId,
  PendingTransactionResponse,
} from "@aptos-labs/ts-sdk";
import {
  AptosWallet,
  getAptosWallets,
  isWalletWithRequiredFeatureSet,
  UserResponseStatus,
  AptosSignAndSubmitTransactionOutput,
  UserResponse,
  AptosSignTransactionOutputV1_1,
  AptosSignTransactionInputV1_1,
  AptosSignTransactionMethod,
  AptosSignTransactionMethodV1_1,
  NetworkInfo,
  AccountInfo,
  AptosSignMessageInput,
  AptosSignMessageOutput,
  AptosChangeNetworkOutput,
  AptosSignInInput,
  AptosSignInOutput,
} from "@aptos-labs/wallet-standard";
import { AptosConnectWalletConfig } from "@aptos-connect/wallet-adapter-plugin";

export type {
  NetworkInfo,
  AccountInfo,
  AptosSignAndSubmitTransactionOutput,
  AptosSignTransactionOutputV1_1,
  AptosSignMessageInput,
  AptosSignMessageOutput,
  AptosChangeNetworkOutput,
} from "@aptos-labs/wallet-standard";
export type {
  AccountAuthenticator,
  AnyRawTransaction,
  InputGenerateTransactionOptions,
  PendingTransactionResponse,
  InputSubmitTransactionData,
  Network,
  AnyPublicKey,
  AccountAddress,
} from "@aptos-labs/ts-sdk";

import { GA4 } from "./ga";
import {
  WalletChangeNetworkError,
  WalletAccountChangeError,
  WalletAccountError,
  WalletConnectionError,
  WalletGetNetworkError,
  WalletNetworkChangeError,
  WalletNotConnectedError,
  WalletNotReadyError,
  WalletNotSelectedError,
  WalletSignAndSubmitMessageError,
  WalletSignMessageError,
  WalletSignTransactionError,
  WalletSignMessageAndVerifyError,
  WalletDisconnectionError,
  WalletSubmitTransactionError,
  WalletNotSupportedMethod,
  WalletNotFoundError,
} from "./error";
import { ChainIdToAnsSupportedNetworkMap, WalletReadyState } from "./constants";
import { WALLET_ADAPTER_CORE_VERSION } from "./version";
import {
  fetchDevnetChainId,
  generalizedErrorMessage,
  getAptosConfig,
  handlePublishPackageTransaction,
  isAptosNetwork,
  isRedirectable,
  removeLocalStorage,
  setLocalStorage,
} from "./utils";
import { aptosStandardSupportedWalletList } from "./registry";
import { getSDKWallets } from "./sdkWallets";
import {
  AvailableWallets,
  AptosStandardSupportedWallet,
  InputTransactionData,
} from "./utils/types";

// An adapter wallet types is a wallet that is compatible with the wallet standard and the wallet adapter properties
export type AdapterWallet = AptosWallet & {
  readyState?: WalletReadyState;
};

// An adapter not detected wallet types is a wallet that is compatible with the wallet standard but not detected
export type AdapterNotDetectedWallet = Omit<
  AdapterWallet,
  "features" | "version" | "chains" | "accounts"
> & {
  readyState: WalletReadyState.NotDetected;
};

export interface DappConfig {
  network: Network;
  aptosApiKeys?: Partial<Record<Network, string>>;
  aptosConnectDappId?: string;
  aptosConnect?: Omit<AptosConnectWalletConfig, "network">;
  mizuwallet?: {
    manifestURL: string;
    appId?: string;
  };
  msafeWalletConfig?: {
    appId?: string;
    appUrl?: string;
  };
}

export declare interface WalletCoreEvents {
  connect(account: AccountInfo | null): void;
  disconnect(): void;
  standardWalletsAdded(wallets: AdapterWallet): void;
  standardNotDetectedWalletAdded(wallets: AdapterNotDetectedWallet): void;
  networkChange(network: NetworkInfo | null): void;
  accountChange(account: AccountInfo | null): void;
}

export type AdapterAccountInfo = Omit<AccountInfo, "ansName"> & {
  // ansName is a read-only property on the standard AccountInfo type
  ansName?: string;
};

export class WalletCore extends EventEmitter<WalletCoreEvents> {
  // Local private variable to hold the wallet that is currently connected
  private _wallet: AdapterWallet | null = null;

  // Local private variable to hold SDK wallets in the adapter
  private readonly _sdkWallets: AdapterWallet[] = [];

  // Local array that holds all the wallets that are AIP-62 standard compatible
  private _standard_wallets: AdapterWallet[] = [];

  // Local array that holds all the wallets that are AIP-62 standard compatible but are not installed on the user machine
  private _standard_not_detected_wallets: AdapterNotDetectedWallet[] = [];

  // Local private variable to hold the network that is currently connected
  private _network: NetworkInfo | null = null;

  // Local private variable to hold the wallet connected state
  private _connected: boolean = false;

  // Local private variable to hold the connecting state
  private _connecting: boolean = false;

  // Local private variable to hold the account that is currently connected
  private _account: AdapterAccountInfo | null = null;

  // JSON configuration for AptosConnect
  private _dappConfig: DappConfig | undefined;

  // Private array that holds all the Wallets a dapp decided to opt-in to
  private _optInWallets: ReadonlyArray<AvailableWallets> = [];

  // Local flag to disable the adapter telemetry tool
  private _disableTelemetry: boolean = false;

  // Google Analytics 4 module
  private readonly ga4: GA4 | null = null;

  constructor(
    optInWallets?: ReadonlyArray<AvailableWallets>,
    dappConfig?: DappConfig,
    disableTelemetry?: boolean
  ) {
    super();
    this._optInWallets = optInWallets || [];
    this._dappConfig = dappConfig;
    this._disableTelemetry = disableTelemetry ?? false;
    this._sdkWallets = getSDKWallets(this._dappConfig);

    // If disableTelemetry set to false (by default), start GA4
    if (!this._disableTelemetry) {
      this.ga4 = new GA4();
    }
    // Strategy to detect AIP-62 standard compatible extension wallets
    this.fetchExtensionAIP62AptosWallets();
    // Strategy to detect AIP-62 standard compatible SDK wallets.
    // We separate the extension and sdk detection process so we dont refetch sdk wallets everytime a new
    // extension wallet is detected
    this.fetchSDKAIP62AptosWallets();
    // Strategy to append not detected AIP-62 standard compatible extension wallets
    this.appendNotDetectedStandardSupportedWallets();
  }

  private fetchExtensionAIP62AptosWallets(): void {
    let { aptosWallets, on } = getAptosWallets();
    this.setExtensionAIP62Wallets(aptosWallets);

    if (typeof window === "undefined") return;
    // Adds an event listener for new wallets that get registered after the dapp has been loaded,
    // receiving an unsubscribe function, which it can later use to remove the listener
    const that = this;
    const removeRegisterListener = on("register", function () {
      let { aptosWallets } = getAptosWallets();
      that.setExtensionAIP62Wallets(aptosWallets);
    });

    const removeUnregisterListener = on("unregister", function () {
      let { aptosWallets } = getAptosWallets();
      that.setExtensionAIP62Wallets(aptosWallets);
    });
  }

  /**
   * Set AIP-62 extension wallets
   *
   * @param extensionwWallets
   */
  private setExtensionAIP62Wallets(
    extensionwWallets: readonly AptosWallet[]
  ): void {
    extensionwWallets.map((wallet: AdapterWallet) => {
      if (this.excludeWallet(wallet)) {
        return;
      }

      // Remove optional duplications in the _all_wallets array
      this._standard_wallets = this._standard_wallets.filter(
        (item) => item.name !== wallet.name
      );

      const isValid = isWalletWithRequiredFeatureSet(wallet);
      if (isValid) {
        // check if we already have this wallet as a not detected wallet
        const index = this._standard_not_detected_wallets.findIndex(
          (notDetctedWallet) => notDetctedWallet.name == wallet.name
        );
        // if we do, remove it from the not detected wallets array as it is now become detected
        if (index !== -1) {
          this._standard_not_detected_wallets.splice(index, 1);
        }

        wallet.readyState = WalletReadyState.Installed;
        this._standard_wallets.push(wallet);
        this.emit("standardWalletsAdded", wallet);
      }
    });
  }

  /**
   * Set AIP-62 SDK wallets
   */
  private fetchSDKAIP62AptosWallets(): void {
    this._sdkWallets.map((wallet: AdapterWallet) => {
      if (this.excludeWallet(wallet)) {
        return;
      }
      const isValid = isWalletWithRequiredFeatureSet(wallet);

      if (isValid) {
        wallet.readyState = WalletReadyState.Installed;
        this._standard_wallets.push(wallet);
      }
    });
  }

  // Since we can't discover AIP-62 wallets that are not installed on the user machine,
  // we hold a AIP-62 wallets registry to show on the wallet selector modal for the users.
  // Append wallets from wallet standard support registry to the `_standard_not_detected_wallets` array
  // when wallet is not installed on the user machine
  private appendNotDetectedStandardSupportedWallets(): void {
    // Loop over the registry map
    aptosStandardSupportedWalletList.map((supportedWallet) => {
      // Check if we already have this wallet as a detected AIP-62 wallet standard
      const existingStandardWallet = this._standard_wallets.find(
        (wallet) => wallet.name == supportedWallet.name
      );
      // If it is detected, it means the user has the wallet installed, so dont add it to the wallets array
      if (existingStandardWallet) {
        return;
      }
      // If AIP-62 wallet detected but it is excluded by the dapp, dont add it to the wallets array
      if (this.excludeWallet(supportedWallet)) {
        return;
      }
      // If AIP-62 wallet does not exist, append it to the wallet selector modal
      // as an undetected wallet
      if (!existingStandardWallet) {
        this._standard_not_detected_wallets.push(supportedWallet);
        this.emit("standardNotDetectedWalletAdded", supportedWallet);
      }
    });
  }

  /**
   * A function that excludes an AIP-62 compatible wallet the dapp doesnt want to include
   *
   * @param wallet AdapterWallet | AdapterNotDetectedWallet
   * @returns boolean
   */
  excludeWallet(wallet: AdapterWallet | AdapterNotDetectedWallet): boolean {
    // If _optInWallets is not empty, and does not include the provided wallet,
    // return true to exclude the wallet, otherwise return false
    if (
      this._optInWallets.length > 0 &&
      !this._optInWallets.includes(wallet.name as AvailableWallets)
    ) {
      return true;
    }
    return false;
  }

  private recordEvent(eventName: string, additionalInfo?: object): void {
    this.ga4?.gtag("event", `wallet_adapter_${eventName}`, {
      wallet: this._wallet?.name,
      network: this._network?.name,
      network_url: this._network?.url,
      adapter_core_version: WALLET_ADAPTER_CORE_VERSION,
      send_to: process.env.GAID,
      ...additionalInfo,
    });
  }

  /**
   * Helper function to ensure wallet exists
   *
   * @param wallet A wallet
   */
  private ensureWalletExists(
    wallet: AdapterWallet | null
  ): asserts wallet is AdapterWallet {
    if (!wallet) {
      throw new WalletNotConnectedError().name;
    }
    if (!(wallet.readyState === WalletReadyState.Installed))
      throw new WalletNotReadyError("Wallet is not set").name;
  }

  /**
   * Helper function to ensure account exists
   *
   * @param account An account
   */
  private ensureAccountExists(
    account: AccountInfo | null
  ): asserts account is AccountInfo {
    if (!account) {
      throw new WalletAccountError("Account is not set").name;
    }
  }

  /**
   * Queries and sets ANS name for the current connected wallet account
   */
  private async setAnsName(): Promise<void> {
    if (this._network?.chainId && this._account) {
      if (this._account.ansName) return;
      // ANS supports only MAINNET or TESTNET
      if (
        !ChainIdToAnsSupportedNetworkMap[this._network.chainId] ||
        !isAptosNetwork(this._network)
      ) {
        this._account.ansName = undefined;
        return;
      }

      const aptosConfig = getAptosConfig(this._network, this._dappConfig);
      const aptos = new Aptos(aptosConfig);
      try {
        const name = await aptos.ans.getPrimaryName({
          address: this._account.address.toString(),
        });
        this._account.ansName = name;
      } catch (error: any) {
        console.log(`Error setting ANS name ${error}`);
      }
    }
  }

  /**
   * Function to cleat wallet adapter data.
   *
   * - Removes current connected wallet state
   * - Removes current connected account state
   * - Removes current connected network state
   * - Removes autoconnect local storage value
   */
  private clearData(): void {
    this._connected = false;
    this.setWallet(null);
    this.setAccount(null);
    this.setNetwork(null);
    removeLocalStorage();
  }

  /**
   * Sets the connected wallet
   *
   * @param wallet A wallet
   */
  setWallet(wallet: AptosWallet | null): void {
    this._wallet = wallet;
  }

  /**
   * Sets the connected account
   *
   * @param account An account
   */
  setAccount(account: AccountInfo | null): void {
    this._account = account;
  }

  /**
   * Sets the connected network
   *
   * @param network A network
   */
  setNetwork(network: NetworkInfo | null): void {
    this._network = network;
  }

  /**
   * Helper function to detect whether a wallet is connected
   *
   * @returns boolean
   */
  isConnected(): boolean {
    return this._connected;
  }

  /**
   * Getter to fetch all detected wallets
   */
  get wallets(): ReadonlyArray<AptosWallet> {
    return this._standard_wallets;
  }

  get notDetectedWallets(): ReadonlyArray<AdapterNotDetectedWallet> {
    return this._standard_not_detected_wallets;
  }

  /**
   * Getter for the current connected wallet
   *
   * @return wallet info
   * @throws WalletNotSelectedError
   */
  get wallet(): AptosWallet | null {
    try {
      if (!this._wallet) return null;
      return this._wallet;
    } catch (error: any) {
      throw new WalletNotSelectedError(error).message;
    }
  }

  /**
   * Getter for the current connected account
   *
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
   *
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
   * Helper function to run some checks before we connect with a wallet.
   *
   * @param walletName. The wallet name we want to connect with.
   */
  async connect(walletName: string): Promise<void | string> {
    // First, handle mobile case
    // Check if we are in a redirectable view (i.e on mobile AND not in an in-app browser)
    if (isRedirectable()) {
      const selectedWallet = this._standard_not_detected_wallets.find(
        (wallet: AdapterNotDetectedWallet) => wallet.name === walletName
      );

      if (selectedWallet) {
        // If wallet has a deeplinkProvider property, use it
        const uninstalledWallet =
          selectedWallet as unknown as AptosStandardSupportedWallet;
        if (uninstalledWallet.deeplinkProvider) {
          const url = encodeURIComponent(window.location.href);
          const location = uninstalledWallet.deeplinkProvider.concat(url);
          window.location.href = location;
          return;
        }
      }
    }

    // Checks the wallet exists in the detected wallets array
    const allDetectedWallets = this._standard_wallets;

    const selectedWallet = allDetectedWallets.find(
      (wallet: AdapterWallet) => wallet.name === walletName
    );

    if (!selectedWallet) return;

    // Check if wallet is already connected
    if (this._connected && this._account) {
      // if the selected wallet is already connected, we don't need to connect again
      if (this._wallet?.name === walletName)
        throw new WalletConnectionError(
          `${walletName} wallet is already connected`
        ).message;
    }

    await this.connectWallet(selectedWallet, async () => {
      const response = await selectedWallet.features["aptos:connect"].connect();
      if (response.status === UserResponseStatus.REJECTED) {
        throw new WalletConnectionError("User has rejected the request")
          .message;
      }

      return { account: response.args, output: undefined };
    });
  }

  /**
   * Signs into the wallet by connecting and signing an authentication messages.
   *
   * For more information, visit: https://siwa.aptos.dev
   *
   * @param args
   * @param args.input The AptosSignInInput which defines how the SIWA Message should be constructed
   * @param args.walletName The name of the wallet to sign into
   * @returns The AptosSignInOutput which contains the account and signature information
   */
  async signIn(args: {
    input: AptosSignInInput;
    walletName: string;
  }): Promise<AptosSignInOutput> {
    const { input, walletName } = args;

    const allDetectedWallets = this._standard_wallets;
    const selectedWallet = allDetectedWallets.find(
      (wallet: AdapterWallet) => wallet.name === walletName
    );

    if (!selectedWallet) {
      throw new WalletNotFoundError(`Wallet ${walletName} not found`).message;
    }

    if (!selectedWallet.features["aptos:signIn"]) {
      throw new WalletNotSupportedMethod(
        `aptos:signIn is not supported by ${walletName}`
      ).message;
    }

    return await this.connectWallet(selectedWallet, async () => {
      if (!selectedWallet.features["aptos:signIn"]) {
        throw new WalletNotSupportedMethod(
          `aptos:signIn is not supported by ${selectedWallet.name}`
        ).message;
      }

      const response =
        await selectedWallet.features["aptos:signIn"].signIn(input);
      if (response.status === UserResponseStatus.REJECTED) {
        throw new WalletConnectionError("User has rejected the request")
          .message;
      }

      return { account: response.args.account, output: response.args };
    });
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
  private async connectWallet<T>(
    selectedWallet: AdapterWallet,
    onConnect: () => Promise<{ account: AccountInfo; output: T }>
  ): Promise<T> {
    try {
      this._connecting = true;
      this.setWallet(selectedWallet);
      const { account, output } = await onConnect();
      this.setAccount(account);
      const network = await selectedWallet.features["aptos:network"].network();
      this.setNetwork(network);
      await this.setAnsName();
      setLocalStorage(selectedWallet.name);
      this._connected = true;
      this.recordEvent("wallet_connect");
      this.emit("connect", account);
      return output;
    } catch (error: any) {
      this.clearData();
      const errMsg = generalizedErrorMessage(error);
      throw new WalletConnectionError(errMsg).message;
    } finally {
      this._connecting = false;
    }
  }

  /**
   * Disconnect the current connected wallet. On success, we clear the
   * current account, current network and LocalStorage data.
   *
   * @emit emits "disconnect" event
   * @throws WalletDisconnectionError
   */
  async disconnect(): Promise<void> {
    try {
      this.ensureWalletExists(this._wallet);
      await this._wallet.features["aptos:disconnect"].disconnect();
      this.clearData();
      this.recordEvent("wallet_disconnect");
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
   * @returns AptosSignAndSubmitTransactionOutput
   */
  async signAndSubmitTransaction(
    transactionInput: InputTransactionData
  ): Promise<AptosSignAndSubmitTransactionOutput> {
    try {
      if ("function" in transactionInput.data) {
        if (
          transactionInput.data.function ===
          "0x1::account::rotate_authentication_key_call"
        ) {
          throw new WalletSignAndSubmitMessageError("SCAM SITE DETECTED")
            .message;
        }

        if (
          transactionInput.data.function === "0x1::code::publish_package_txn"
        ) {
          ({
            metadataBytes: transactionInput.data.functionArguments[0],
            byteCode: transactionInput.data.functionArguments[1],
          } = handlePublishPackageTransaction(transactionInput));
        }
      }
      this.ensureWalletExists(this._wallet);
      this.ensureAccountExists(this._account);
      this.recordEvent("sign_and_submit_transaction");

      if (this._wallet.features["aptos:signAndSubmitTransaction"]) {
        // check for backward compatibility. before version 1.1.0 the standard expected
        // AnyRawTransaction input so the adapter built the transaction before sending it to the wallet
        if (
          this._wallet.features["aptos:signAndSubmitTransaction"].version !==
          "1.1.0"
        ) {
          const aptosConfig = getAptosConfig(this._network, this._dappConfig);

          const aptos = new Aptos(aptosConfig);
          const transaction = await aptos.transaction.build.simple({
            sender: this._account.address.toString(),
            data: transactionInput.data,
            options: transactionInput.options,
          });

          type AptosSignAndSubmitTransactionV1Method = (
            transaction: AnyRawTransaction
          ) => Promise<UserResponse<AptosSignAndSubmitTransactionOutput>>;

          const signAndSubmitTransactionMethod = this._wallet.features[
            "aptos:signAndSubmitTransaction"
          ]
            .signAndSubmitTransaction as unknown as AptosSignAndSubmitTransactionV1Method;

          const response = (await signAndSubmitTransactionMethod(
            transaction
          )) as UserResponse<AptosSignAndSubmitTransactionOutput>;

          if (response.status === UserResponseStatus.REJECTED) {
            throw new WalletConnectionError("User has rejected the request")
              .message;
          }

          return response.args;
        }

        const response = await this._wallet.features[
          "aptos:signAndSubmitTransaction"
        ].signAndSubmitTransaction({
          payload: transactionInput.data,
          gasUnitPrice: transactionInput.options?.gasUnitPrice,
          maxGasAmount: transactionInput.options?.maxGasAmount,
        });
        if (response.status === UserResponseStatus.REJECTED) {
          throw new WalletConnectionError("User has rejected the request")
            .message;
        }
        return response.args;
      }

      // If wallet does not support signAndSubmitTransaction
      // the adapter will sign and submit it for the dapp.
      const aptosConfig = getAptosConfig(this._network, this._dappConfig);
      const aptos = new Aptos(aptosConfig);
      const transaction = await aptos.transaction.build.simple({
        sender: this._account.address,
        data: transactionInput.data,
        options: transactionInput.options,
      });

      const signTransactionResponse = await this.signTransaction({
        transactionOrPayload: transaction,
      });
      const response = await this.submitTransaction({
        transaction,
        senderAuthenticator: signTransactionResponse.authenticator,
      });
      return { hash: response.hash };
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignAndSubmitMessageError(errMsg).message;
    }
  }

  /**
   * Signs a transaction
   *
   * This method supports 2 input types -
   * 1. A raw transaction that was already built by the dapp,
   * 2. A transaction data input as JSON. This is for the wallet to be able to simulate before signing
   *
   * @param transactionOrPayload AnyRawTransaction | InputTransactionData
   * @param asFeePayer optional. A flag indicates to sign the transaction as the fee payer
   * @param options optional. Transaction options
   *
   * @returns AccountAuthenticator
   */
  async signTransaction(args: {
    transactionOrPayload: AnyRawTransaction | InputTransactionData;
    asFeePayer?: boolean;
  }): Promise<{
    authenticator: AccountAuthenticator;
    rawTransaction: Uint8Array;
  }> {
    const { transactionOrPayload, asFeePayer } = args;
    /**
     * All standard compatible wallets should support AnyRawTransaction for signTransaction version 1.0.0
     * For standard signTransaction version 1.1.0, the standard expects a transaction input
     *
     * So, if the input is AnyRawTransaction, we can directly call the wallet's signTransaction method
     *
     *
     * If the input is InputTransactionData, we need to
     * 1. check if the wallet supports signTransaction version 1.1.0 - if so, we convert the input to the standard expected input
     * 2. if it does not support signTransaction version 1.1.0, we convert it to a rawTransaction input and call the wallet's signTransaction method
     */

    try {
      this.ensureWalletExists(this._wallet);
      this.ensureAccountExists(this._account);
      this.recordEvent("sign_transaction");

      // dapp sends a generated transaction (i.e AnyRawTransaction), which is supported by the wallet standard at signTransaction version 1.0.0
      if ("rawTransaction" in transactionOrPayload) {
        const response = (await this._wallet?.features[
          "aptos:signTransaction"
        ].signTransaction(
          transactionOrPayload,
          asFeePayer
        )) as UserResponse<AccountAuthenticator>;
        if (response.status === UserResponseStatus.REJECTED) {
          throw new WalletConnectionError("User has rejected the request")
            .message;
        }
        return {
          authenticator: response.args,
          rawTransaction: transactionOrPayload.rawTransaction.bcsToBytes(),
        };
      } // dapp sends a transaction data input (i.e InputTransactionData), which is supported by the wallet standard at signTransaction version 1.1.0
      else if (
        this._wallet.features["aptos:signTransaction"]?.version === "1.1"
      ) {
        // convert input to standard expected input
        const signTransactionV1_1StandardInput: AptosSignTransactionInputV1_1 =
          {
            payload: transactionOrPayload.data,
            expirationTimestamp:
              transactionOrPayload.options?.expirationTimestamp,
            expirationSecondsFromNow:
              transactionOrPayload.options?.expirationSecondsFromNow,
            gasUnitPrice: transactionOrPayload.options?.gasUnitPrice,
            maxGasAmount: transactionOrPayload.options?.maxGasAmount,
            sequenceNumber: transactionOrPayload.options?.accountSequenceNumber,
            sender: transactionOrPayload.sender
              ? { address: AccountAddress.from(transactionOrPayload.sender) }
              : undefined,
          };

        const walletSignTransactionMethod = this._wallet?.features[
          "aptos:signTransaction"
        ].signTransaction as AptosSignTransactionMethod &
          AptosSignTransactionMethodV1_1;

        const response = (await walletSignTransactionMethod(
          signTransactionV1_1StandardInput
        )) as UserResponse<AptosSignTransactionOutputV1_1>;
        if (response.status === UserResponseStatus.REJECTED) {
          throw new WalletConnectionError("User has rejected the request")
            .message;
        }
        return {
          authenticator: response.args.authenticator,
          rawTransaction: response.args.rawTransaction.bcsToBytes(),
        };
      } else {
        // dapp input is InputTransactionData but the wallet does not support it, so we convert it to a rawTransaction
        const aptosConfig = getAptosConfig(this._network, this._dappConfig);
        const aptos = new Aptos(aptosConfig);

        const transaction = await aptos.transaction.build.simple({
          sender: this._account.address,
          data: transactionOrPayload.data,
          options: transactionOrPayload.options,
          withFeePayer: transactionOrPayload.withFeePayer,
        });

        const response = (await this._wallet?.features[
          "aptos:signTransaction"
        ].signTransaction(
          transaction,
          asFeePayer
        )) as UserResponse<AccountAuthenticator>;
        if (response.status === UserResponseStatus.REJECTED) {
          throw new WalletConnectionError("User has rejected the request")
            .message;
        }

        return {
          authenticator: response.args,
          rawTransaction: transaction.bcsToBytes(),
        };
      }
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignTransactionError(errMsg).message;
    }
  }

  /**
   * Sign a message (doesnt submit to chain).
   *
   * @param message - AptosSignMessageInput
   *
   * @return response from the wallet's signMessage function
   * @throws WalletSignMessageError
   */
  async signMessage(
    message: AptosSignMessageInput
  ): Promise<AptosSignMessageOutput> {
    try {
      this.ensureWalletExists(this._wallet);
      this.recordEvent("sign_message");

      const response =
        await this._wallet?.features["aptos:signMessage"]?.signMessage(message);
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

  /**
   * Submits transaction to chain
   *
   * @param transaction - InputSubmitTransactionData
   * @returns PendingTransactionResponse
   */
  async submitTransaction(
    transaction: InputSubmitTransactionData
  ): Promise<PendingTransactionResponse> {
    // The standard does not support submitTransaction, so we use the adapter to submit the transaction
    try {
      this.ensureWalletExists(this._wallet);

      const { additionalSignersAuthenticators } = transaction;
      const transactionType =
        additionalSignersAuthenticators !== undefined
          ? "multi-agent"
          : "simple";
      this.recordEvent("submit_transaction", {
        transaction_type: transactionType,
      });

      const aptosConfig = getAptosConfig(this._network, this._dappConfig);
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
      throw new WalletSubmitTransactionError(errMsg).message;
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
      await this._wallet.features["aptos:onAccountChange"]?.onAccountChange(
        async (data: AccountInfo) => {
          this.setAccount(data);
          await this.setAnsName();
          this.recordEvent("account_change");
          this.emit("accountChange", this._account);
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
      await this._wallet.features["aptos:onNetworkChange"]?.onNetworkChange(
        async (data: NetworkInfo) => {
          this.setNetwork(data);
          await this.setAnsName();
          this.emit("networkChange", this._network);
        }
      );
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletNetworkChangeError(errMsg).message;
    }
  }

  /**
   * Sends a change network request to the wallet to change the connected network
   *
   * @param network - Network
   * @returns AptosChangeNetworkOutput
   */
  async changeNetwork(network: Network): Promise<AptosChangeNetworkOutput> {
    try {
      this.ensureWalletExists(this._wallet);
      this.recordEvent("change_network_request", {
        from: this._network?.name,
        to: network,
      });
      const chainId =
        network === Network.DEVNET
          ? await fetchDevnetChainId()
          : NetworkToChainId[network];

      const networkInfo: NetworkInfo = {
        name: network,
        chainId,
      };

      if (this._wallet.features["aptos:changeNetwork"]) {
        const response =
          await this._wallet.features["aptos:changeNetwork"].changeNetwork(
            networkInfo
          );
        if (response.status === UserResponseStatus.REJECTED) {
          throw new WalletConnectionError("User has rejected the request")
            .message;
        }
        return response.args;
      }

      throw new WalletChangeNetworkError(
        `${this._wallet.name} does not support changing network request`
      ).message;
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletChangeNetworkError(errMsg).message;
    }
  }

  /**
   * Signs a message and verifies the signer
   * @param message - AptosSignMessageInput
   * @returns boolean
   */
  async signMessageAndVerify(message: AptosSignMessageInput): Promise<boolean> {
    try {
      this.ensureWalletExists(this._wallet);
      this.ensureAccountExists(this._account);
      this.recordEvent("sign_message_and_verify");

      // sign the message
      const response = (await this._wallet.features[
        "aptos:signMessage"
      ].signMessage(message)) as UserResponse<AptosSignMessageOutput>;

      if (response.status === UserResponseStatus.REJECTED) {
        throw new WalletConnectionError("Failed to sign a message").message;
      }

      const aptosConfig = getAptosConfig(this._network, this._dappConfig);
      const signingMessage = new TextEncoder().encode(
        response.args.fullMessage
      );
      if ("verifySignatureAsync" in (this._account.publicKey as Object)) {
        return await this._account.publicKey.verifySignatureAsync({
          aptosConfig,
          message: signingMessage,
          signature: response.args.signature,
          options: { throwErrorWithReason: true },
        });
      }
      return this._account.publicKey.verifySignature({
        message: signingMessage,
        signature: response.args.signature,
      });
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignMessageAndVerifyError(errMsg).message;
    }
  }
}
