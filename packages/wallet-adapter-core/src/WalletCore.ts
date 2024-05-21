import { TxnBuilderTypes, Types, BCS } from "aptos";
import {
  Network,
  AnyRawTransaction,
  AccountAuthenticator,
  AccountAuthenticatorEd25519,
  Ed25519PublicKey,
  InputGenerateTransactionOptions,
  Ed25519Signature,
  AptosConfig,
  InputSubmitTransactionData,
  PendingTransactionResponse,
  Aptos,
  generateRawTransaction,
  SimpleTransaction,
  NetworkToChainId,
} from "@aptos-labs/ts-sdk";
import EventEmitter from "eventemitter3";
import {
  AccountInfo as StandardAccountInfo,
  AptosChangeNetworkOutput,
  AptosWallet,
  getAptosWallets,
  NetworkInfo as StandardNetworkInfo,
  UserResponse,
  UserResponseStatus,
  isWalletWithRequiredFeatureSet,
} from "@aptos-labs/wallet-standard";

import SDKWallets from "./AIP62StandardWallets/sdkWallets";
import { ChainIdToAnsSupportedNetworkMap, WalletReadyState } from "./constants";
import {
  WalletAccountChangeError,
  WalletAccountError,
  WalletChangeNetworkError,
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
  InputTransactionData,
  NetworkInfo,
  SignMessagePayload,
  SignMessageResponse,
  Wallet,
  WalletCoreEvents,
  WalletInfo,
  WalletName,
  WalletCoreV1,
  CompatibleTransactionOptions,
  convertNetwork,
  generateTransactionPayloadFromV1Input,
} from "./LegacyWalletPlugins";
import {
  fetchDevnetChainId,
  generalizedErrorMessage,
  getAptosConfig,
  isAptosNetwork,
  isRedirectable,
  removeLocalStorage,
  scopePollingDetectionStrategy,
  setLocalStorage,
} from "./utils";
import {
  AptosStandardWallet,
  WalletStandardCore,
  AptosStandardSupportedWallet,
  AvailableWallets,
} from "./AIP62StandardWallets";
import { GA4 } from "./ga";
import { WALLET_ADAPTER_CORE_VERSION } from "./version";
import { aptosStandardSupportedWalletList } from "./AIP62StandardWallets/registry";

export type IAptosWallet = AptosStandardWallet & Wallet;

export class WalletCore extends EventEmitter<WalletCoreEvents> {
  // Private array to hold legacy wallet adapter plugins
  private _wallets: ReadonlyArray<Wallet> = [];

  // Private array that holds all the Wallets a dapp decided to opt-in to
  private _optInWallets: ReadonlyArray<AvailableWallets> = [];

  // Private array to hold compatible AIP-62 standard wallets
  private _standard_wallets: ReadonlyArray<AptosStandardWallet> = [];

  // Private array to hold all wallets (legacy wallet adapter plugins AND compatible AIP-62 standard wallets)
  // while providing support for legacy and new wallet standard
  private _all_wallets: Array<Wallet | AptosStandardSupportedWallet> = [];

  // Current connected wallet
  private _wallet: Wallet | null = null;

  // Current connected account
  private _account: AccountInfo | null = null;

  // Current connected network
  private _network: NetworkInfo | null = null;

  // WalletCoreV1 property to interact with wallet adapter v1 (legacy wallet adapter plugins) functionality
  private readonly walletCoreV1: WalletCoreV1 = new WalletCoreV1();

  // WalletStandardCore property to interact with wallet adapter v2 (compatible AIP-62 standard wallets) functionality
  private readonly walletStandardCore: WalletStandardCore =
    new WalletStandardCore();

  // Indicates whether the dapp is currently connecting with a wallet
  private _connecting: boolean = false;

  // Indicates whether the dapp is connected with a wallet
  private _connected: boolean = false;

  // Google Analytics 4 module
  private readonly ga4: GA4 = new GA4();

  /**
   * Core functionality constructor.
   * For legacy wallet adapter v1 support we expect the dapp to pass in wallet plugins,
   * since AIP-62 standard support this is optional for dapps.
   *
   * @param plugins legacy wallet adapter v1 wallet plugins
   */
  constructor(
    plugins: ReadonlyArray<Wallet>,
    optInWallets: ReadonlyArray<AvailableWallets>
  ) {
    super();
    this._wallets = plugins;
    this._optInWallets = optInWallets;
    // Strategy to detect legacy wallet adapter v1 wallet plugins
    this.scopePollingDetectionStrategy();
    // Strategy to detect AIP-62 standard compatible wallets (extension + SDK wallets)
    this.fetchAptosWallets();
  }

  private scopePollingDetectionStrategy() {
    this._wallets?.forEach((wallet: Wallet) => {
      this._all_wallets.push(wallet);
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

  // Append wallets from wallet standard support registry to the `all_wallets` array
  private appendNotDetectedStandardSupportedWallets(
    aptosStandardWallets: ReadonlyArray<AptosStandardWallet>
  ) {
    aptosStandardSupportedWalletList.map((supportedWallet) => {
      if (this.excludeWallet(supportedWallet.name)) {
        return;
      }
      const existingWalletIndex = aptosStandardWallets.findIndex(
        (wallet) => wallet.name == supportedWallet.name
      );

      // If wallet does not exist, append it from the supported wallets list
      if (existingWalletIndex === -1) {
        this._all_wallets.push(supportedWallet);
        this.emit("standardWalletsAdded", supportedWallet);
      }
    });
  }

  /**
   * Set potential Standard compatible SDK + extension wallets
   *
   * Loop over local SDK and Extensions wallets
   * 1) check it is Standard compatible
   * 2) Update their readyState to Installed (for a future UI detection)
   * 3) push the wallet into a local wallets array
   * 4) standardize each wallet to the Wallet Plugin type interface for legacy compatibility
   *
   * @param extensionwWallets
   */
  private setWallets(extensionwWallets: readonly AptosWallet[]) {
    const aptosStandardWallets: AptosStandardWallet[] = [];

    [...SDKWallets, ...extensionwWallets].map((wallet: AptosStandardWallet) => {
      if (this.excludeWallet(wallet.name)) {
        return;
      }
      const isValid = isWalletWithRequiredFeatureSet(wallet);
      if (isValid) {
        wallet.readyState = WalletReadyState.Installed;
        aptosStandardWallets.push(wallet);
        this.standardizeStandardWalletToPluginWalletType(wallet);
      }
    });

    this._standard_wallets = aptosStandardWallets;
    // Append AIP-62 compatible wallets that are not detected on the user machine
    this.appendNotDetectedStandardSupportedWallets(this._standard_wallets);
  }

  /**
   * A function that excludes a wallet the dapp doesnt want to include
   *
   * @param walletName
   * @returns
   */
  excludeWallet(walletName: string): boolean {
    // If _optInWallets is not empty, and does not include the provided wallet,
    // return true to exclude the wallet, otherwise return false
    if (
      this._optInWallets.length > 0 &&
      !this._optInWallets.includes(walletName as AvailableWallets)
    ) {
      return true;
    }
    return false;
  }

  /**
   * To maintain support for both plugins and AIP-62 standard wallets,
   * without introducing dapps breaking changes, we convert
   * AIP-62 standard compatible wallets to the legacy adapter wallet plugin type.
   *
   * @param standardWallet An AIP-62 standard compatible wallet
   */
  private standardizeStandardWalletToPluginWalletType = (
    standardWallet: AptosStandardWallet
  ) => {
    let standardWalletConvertedToWallet: Wallet = {
      name: standardWallet.name as WalletName,
      url: standardWallet.url,
      icon: standardWallet.icon,
      provider: standardWallet,
      connect: standardWallet.features["aptos:connect"].connect,
      disconnect: standardWallet.features["aptos:disconnect"].disconnect,
      network: standardWallet.features["aptos:network"].network,
      account: standardWallet.features["aptos:account"].account,
      signAndSubmitTransaction:
        standardWallet.features["aptos:signAndSubmitTransaction"]
          ?.signAndSubmitTransaction,
      signMessage: standardWallet.features["aptos:signMessage"].signMessage,
      onAccountChange:
        standardWallet.features["aptos:onAccountChange"].onAccountChange,
      onNetworkChange:
        standardWallet.features["aptos:onNetworkChange"].onNetworkChange,
      signTransaction:
        standardWallet.features["aptos:signTransaction"].signTransaction,
      openInMobileApp:
        standardWallet.features["aptos:openInMobileApp"]?.openInMobileApp,
      changeNetwork:
        standardWallet.features["aptos:changeNetwork"]?.changeNetwork,
      readyState: WalletReadyState.Installed,
      isAIP62Standard: true,
    };

    // Remove optional duplications in the _all_wallets array
    this._all_wallets = this._all_wallets.filter(
      (item) => item.name !== standardWalletConvertedToWallet.name
    );
    this._all_wallets.push(standardWalletConvertedToWallet);

    this.emit("standardWalletsAdded", standardWalletConvertedToWallet);
  };

  private recordEvent(eventName: string, additionalInfo?: object) {
    this.ga4.gtag("event", `wallet_adapter_${eventName}`, {
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
  private ensureWalletExists(wallet: Wallet | null): asserts wallet is Wallet {
    if (!wallet) {
      throw new WalletNotConnectedError().name;
    }
    if (
      !(
        wallet.readyState === WalletReadyState.Loadable ||
        wallet.readyState === WalletReadyState.Installed
      )
    )
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
   * @deprecated use ensureWalletExists
   */
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
   * Queries and sets ANS name for the current connected wallet account
   */
  private async setAnsName(): Promise<void> {
    if (this._network?.chainId && this._account) {
      // ANS supports only MAINNET or TESTNET
      if (
        !ChainIdToAnsSupportedNetworkMap[this._network.chainId] ||
        !isAptosNetwork(this._network)
      ) {
        this._account.ansName = undefined;
        return;
      }

      const aptosConfig = new AptosConfig({
        network: convertNetwork(this._network),
      });
      const aptos = new Aptos(aptosConfig);
      const name = await aptos.ans.getPrimaryName({
        address: this._account.address,
      });

      this._account.ansName = name;
    }
  }

  /**
   * Sets the connected wallet
   *
   * @param wallet A wallet
   */
  setWallet(wallet: Wallet | null): void {
    this._wallet = wallet;
  }

  /**
   * Sets the connected account
   *
   * `AccountInfo` type comes from a legacy wallet adapter plugin
   * `StandardAccountInfo` type comes from AIP-62 standard compatible wallet when onAccountChange event is called
   * `UserResponse<StandardAccountInfo>` type comes from AIP-62 standard compatible wallet on wallet connect
   *
   * @param account An account
   */
  setAccount(
    account:
      | AccountInfo
      | StandardAccountInfo
      | UserResponse<StandardAccountInfo>
      | null
  ): void {
    if (account === null) {
      this._account = null;
      return;
    }

    // Check if wallet is of type AIP-62 standard
    if (this._wallet?.isAIP62Standard) {
      // Check if account is of type UserResponse<StandardAccountInfo> which means the `account`
      // comes from the `connect` method
      if ("status" in account) {
        const connectStandardAccount =
          account as UserResponse<StandardAccountInfo>;
        if (connectStandardAccount.status === UserResponseStatus.REJECTED) {
          this._connecting = false;
          throw new WalletConnectionError("User has rejected the request")
            .message;
        }
        // account is of type
        this._account = {
          address: connectStandardAccount.args.address.toString(),
          publicKey: connectStandardAccount.args.publicKey.toString(),
          ansName: connectStandardAccount.args.ansName,
        };
        return;
      } else {
        // account is of type `StandardAccountInfo` which means it comes from onAccountChange event
        const standardAccount = account as StandardAccountInfo;
        this._account = {
          address: standardAccount.address.toString(),
          publicKey: standardAccount.publicKey.toString(),
          ansName: standardAccount.ansName,
        };
        return;
      }
    }

    // account is of type `AccountInfo`
    this._account = { ...(account as AccountInfo) };
    return;
  }

  /**
   * Sets the connected network
   *
   * `NetworkInfo` type comes from a legacy wallet adapter plugin
   * `StandardNetworkInfo` type comes from AIP-62 standard compatible wallet
   *
   * @param network A network
   */
  setNetwork(network: NetworkInfo | StandardNetworkInfo | null): void {
    if (network === null) {
      this._network = null;
      return;
    }
    if (this._wallet?.isAIP62Standard) {
      const standardizeNetwork = network as StandardNetworkInfo;
      this.recordEvent("network_change", {
        from: this._network?.name,
        to: standardizeNetwork.name,
      });
      this._network = {
        name: standardizeNetwork.name.toLowerCase() as Network,
        chainId: standardizeNetwork.chainId.toString(),
        url: standardizeNetwork.url,
      };

      return;
    }

    this.recordEvent("network_change", {
      from: this._network?.name,
      to: network.name,
    });
    this._network = {
      ...(network as NetworkInfo),
      name: network.name.toLowerCase() as Network,
    };
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
  get wallets(): ReadonlyArray<Wallet | AptosStandardSupportedWallet> {
    return this._all_wallets;
  }

  /**
   * Getter to fetch all detected plugin wallets
   */
  get pluginWallets(): ReadonlyArray<Wallet> {
    return this._wallets;
  }

  /**
   * Getter to fetch all detected AIP-62 standard compatible wallets
   */
  get standardWallets(): ReadonlyArray<AptosStandardWallet> {
    return this._standard_wallets;
  }

  /**
   * Getter for the current connected wallet
   *
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
    // Checks the wallet exists in the detected wallets array

    const allDetectedWallets = this._all_wallets as Array<Wallet>;

    const selectedWallet = allDetectedWallets.find(
      (wallet: Wallet) => wallet.name === walletName
    );
    if (!selectedWallet) return;

    // Check if wallet is already connected
    if (this._connected) {
      // if the selected wallet is already connected, we don't need to connect again
      if (this._wallet?.name === walletName)
        throw new WalletConnectionError(
          `${walletName} wallet is already connected`
        ).message;
    }

    // Check if we are in a redirectable view (i.e on mobile AND not in an in-app browser)
    // Ignore if wallet is installed (iOS extension)
    if (
      isRedirectable() &&
      selectedWallet.readyState !== WalletReadyState.Installed
    ) {
      // use wallet deep link
      if (selectedWallet.isAIP62Standard && selectedWallet.openInMobileApp) {
        selectedWallet.openInMobileApp();
        return;
      }
      if (selectedWallet.deeplinkProvider) {
        const url = encodeURIComponent(window.location.href);
        const location = selectedWallet.deeplinkProvider({ url });
        window.location.href = location;
      }
      return;
    }

    // Check wallet state is Installed or Loadable
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
  async connectWallet(selectedWallet: Wallet): Promise<void> {
    try {
      this._connecting = true;
      this.setWallet(selectedWallet);
      let account;
      if (selectedWallet.isAIP62Standard) {
        account = await this.walletStandardCore.connect(selectedWallet);
      } else {
        account = await this.walletCoreV1.connect(selectedWallet);
      }
      this.setAccount(account);
      const network = await selectedWallet.network();
      this.setNetwork(network);
      await this.setAnsName();
      setLocalStorage(selectedWallet.name);
      this._connected = true;
      this.recordEvent("wallet_connect");
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
   * Disconnect the current connected wallet. On success, we clear the
   * current account, current network and LocalStorage data.
   *
   * @emit emits "disconnect" event
   * @throws WalletDisconnectionError
   */
  async disconnect(): Promise<void> {
    try {
      this.ensureWalletExists(this._wallet);
      await this._wallet.disconnect();
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
   * @param options optional. A configuration object to generate a transaction by
   * @returns The pending transaction hash (V1 output) | PendingTransactionResponse (V2 output)
   */
  async signAndSubmitTransaction(
    transactionInput: InputTransactionData
  ): Promise<
    { hash: Types.HexEncodedBytes; output?: any } | PendingTransactionResponse
  > {
    try {
      if ("function" in transactionInput.data) {
        if (
          transactionInput.data.function ===
          "0x1::account::rotate_authentication_key_call"
        ) {
          throw new WalletSignAndSubmitMessageError("SCAM SITE DETECTED")
            .message;
        }
      }

      this.ensureWalletExists(this._wallet);
      this.ensureAccountExists(this._account);
      this.recordEvent("sign_and_submit_transaction");
      // get the payload piece from the input
      const payloadData = transactionInput.data;
      const aptosConfig = getAptosConfig(this._network);

      const aptos = new Aptos(aptosConfig);

      if (this._wallet.signAndSubmitTransaction) {
        // if wallet is compatible with the AIP-62 standard
        if (this._wallet.isAIP62Standard) {
          const { hash, ...output } =
            await this.walletStandardCore.signAndSubmitTransaction(
              transactionInput,
              aptos,
              this._account,
              this._wallet
            );
          return { hash, output };
        } else {
          // Else use wallet plugin
          const { hash, ...output } =
            await this.walletCoreV1.resolveSignAndSubmitTransaction(
              payloadData,
              this._network,
              this._wallet,
              transactionInput
            );
          return { hash, output };
        }
      }

      // If wallet does not support signAndSubmitTransaction
      // the adapter will sign and submit it for the dapp.
      // Note: This should happen only for AIP-62 standard compatible wallets since
      // signAndSubmitTransaction is not a required function implementation
      const transaction = await aptos.transaction.build.simple({
        sender: this._account.address,
        data: transactionInput.data,
        options: transactionInput.options,
      });

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
      this.ensureWalletExists(this._wallet);
      this.recordEvent("sign_transaction");
      // Make sure wallet supports signTransaction
      if (this._wallet.signTransaction) {
        // If current connected wallet is AIP-62 standard compatible
        // we want to make sure the transaction input is what the
        // standard expects, i,e new sdk v2 input
        if (this._wallet.isAIP62Standard) {
          // if rawTransaction prop it means transaction input data is
          // compatible with new sdk v2 input
          if ("rawTransaction" in transactionOrPayload) {
            return await this.walletStandardCore.signTransaction(
              transactionOrPayload,
              this._wallet,
              asFeePayer
            );
          } else {
            const aptosConfig = getAptosConfig(this._network);
            this.ensureAccountExists(this._account);
            const sender = this._account.address;
            const payload = await generateTransactionPayloadFromV1Input(
              aptosConfig,
              transactionOrPayload
            );
            const optionsV1 = options as CompatibleTransactionOptions;
            const optionsV2 = {
              accountSequenceNumber: optionsV1?.sequenceNumber,
              expireTimestamp:
                optionsV1?.expireTimestamp ?? optionsV1?.expirationTimestamp,
              gasUnitPrice:
                optionsV1?.gasUnitPrice ?? optionsV1?.gas_unit_price,
              maxGasAmount:
                optionsV1?.maxGasAmount ?? optionsV1?.max_gas_amount,
            };
            const rawTransaction = await generateRawTransaction({
              aptosConfig,
              payload,
              sender,
              options: optionsV2,
            });
            return await this.walletStandardCore.signTransaction(
              new SimpleTransaction(rawTransaction),
              this._wallet,
              false
            );
          }
        }

        // If current connected wallet is legacy compatible with wallet standard

        // if input is AnyRawTransaction, i.e new sdk v2 input
        if ("rawTransaction" in transactionOrPayload) {
          const accountAuthenticator = (await this._wallet.signTransaction(
            transactionOrPayload,
            asFeePayer
          )) as AccountAuthenticator;

          return accountAuthenticator;
        } else {
          const response = await this.walletCoreV1.signTransaction(
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
        }
      }

      // If we are here it means this wallet does not support signTransaction
      throw new WalletNotSupportedMethod(
        `Sign Transaction is not supported by ${this.wallet?.name}`
      ).message;
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignTransactionError(errMsg).message;
    }
  }

  /**
   * Sign message (doesnt submit to chain).
   *
   * @param message
   * @return response from the wallet's signMessage function
   * @throws WalletSignMessageError
   */
  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    try {
      this.ensureWalletExists(this._wallet);
      this.recordEvent("sign_message");
      if (this._wallet.isAIP62Standard) {
        return await this.walletStandardCore.signMessage(message, this._wallet);
      }
      const response = await this._wallet!.signMessage(message);
      return response as SignMessageResponse;
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignMessageError(errMsg).message;
    }
  }

  /**
   * Submits transaction to chain
   *
   * @param transaction
   * @returns PendingTransactionResponse
   */
  async submitTransaction(
    transaction: InputSubmitTransactionData
  ): Promise<PendingTransactionResponse> {
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
      // If wallet supports submitTransaction transaction function
      if (this._wallet.submitTransaction) {
        const pendingTransaction =
          await this._wallet.submitTransaction(transaction);
        return pendingTransaction;
      }

      // Else have the adapter submit the transaction

      const aptosConfig = new AptosConfig({
        network: convertNetwork(this.network),
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
      await this._wallet.onAccountChange(
        async (data: AccountInfo | StandardAccountInfo) => {
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
      await this._wallet.onNetworkChange(
        async (data: NetworkInfo | StandardNetworkInfo) => {
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
   * @param network
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
      if (this._wallet.changeNetwork) {
        const networkInfo: StandardNetworkInfo = {
          name: network,
          chainId,
        };
        const response = await this._wallet.changeNetwork(networkInfo);
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
   * @param message SignMessagePayload
   * @returns boolean
   */
  async signMessageAndVerify(message: SignMessagePayload): Promise<boolean> {
    try {
      this.ensureWalletExists(this._wallet);
      this.ensureAccountExists(this._account);
      this.recordEvent("sign_message_and_verify");
      // If current connected wallet is AIP-62 standard compatible
      if (this._wallet.isAIP62Standard) {
        return this.walletStandardCore.signMessageAndVerify(
          message,
          this._wallet
        );
      }

      return await this.walletCoreV1.signMessageAndVerify(
        message,
        this._wallet,
        this._account
      );
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignMessageAndVerifyError(errMsg).message;
    }
  }
}
