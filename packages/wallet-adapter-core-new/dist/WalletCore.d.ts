import { Types } from "aptos";
import { Network, AnyRawTransaction, AccountAuthenticator, InputGenerateTransactionOptions, InputSubmitTransactionData, PendingTransactionResponse } from "@aptos-labs/ts-sdk";
import EventEmitter from "eventemitter3";
import { AccountInfo as StandardAccountInfo, AptosChangeNetworkOutput, NetworkInfo as StandardNetworkInfo, UserResponse } from "@aptos-labs/wallet-standard";
import { AccountInfo, InputTransactionData, NetworkInfo, SignMessagePayload, SignMessageResponse, Wallet, WalletCoreEvents, WalletInfo } from "./LegacyWalletPlugins";
import { AptosStandardWallet, AptosStandardSupportedWallet, AvailableWallets } from "./AIP62StandardWallets";
import type { AptosConnectWalletConfig } from "@aptos-connect/wallet-adapter-plugin";
export type IAptosWallet = AptosStandardWallet & Wallet;
/**
 * Interface for dapp configuration
 *
 * @network The network the dapp is working with
 * @aptosApiKeys A map of Network<>Api Key generated with {@link https://developers.aptoslabs.com/docs/api-access}
 * @aptosConnect Config used to initialize the AptosConnect wallet provider
 * @mizuwallet Config used to initialize the Mizu wallet provider
 */
export interface DappConfig {
    network: Network;
    aptosApiKeys?: Partial<Record<Network, string>>;
    /** @deprecated */
    aptosApiKey?: string;
    /** @deprecated */
    aptosConnectDappId?: string;
    aptosConnect?: Omit<AptosConnectWalletConfig, "network">;
    mizuwallet?: {
        manifestURL: string;
        appId?: string;
    };
}
/** Any wallet that can be handled by `WalletCore`.
 * This includes both wallets from legacy wallet adapter plugins and compatible AIP-62 standard wallets.
 */
export type AnyAptosWallet = Wallet | AptosStandardSupportedWallet;
export declare class WalletCore extends EventEmitter<WalletCoreEvents> {
    private _wallets;
    private _optInWallets;
    private _standard_wallets;
    private _all_wallets;
    private _wallet;
    private _account;
    private _network;
    private readonly walletCoreV1;
    private readonly walletStandardCore;
    private _connecting;
    private _connected;
    private readonly ga4;
    private _dappConfig;
    private readonly _sdkWallets;
    private _disableTelemetry;
    /**
     * Core functionality constructor.
     * For legacy wallet adapter v1 support we expect the dapp to pass in wallet plugins,
     * since AIP-62 standard support this is optional for dapps.
     *
     * @param plugins legacy wallet adapter v1 wallet plugins
     */
    constructor(plugins: ReadonlyArray<Wallet>, optInWallets: ReadonlyArray<AvailableWallets>, dappConfig?: DappConfig, disableTelemetry?: boolean);
    private scopePollingDetectionStrategy;
    private fetchExtensionAIP62AptosWallets;
    private appendNotDetectedStandardSupportedWallets;
    /**
     * Set AIP-62 SDK wallets
     */
    private fetchSDKAIP62AptosWallets;
    /**
     * Set AIP-62 extension wallets
     *
     * @param extensionwWallets
     */
    private setExtensionAIP62Wallets;
    /**
     * A function that excludes an AIP-62 compatible wallet the dapp doesnt want to include
     *
     * @param walletName
     * @returns
     */
    excludeWallet(wallet: AptosStandardWallet): boolean;
    /**
     * Standardize AIP62 wallet
     *
     * 1) check it is Standard compatible
     * 2) Update its readyState to Installed (for a future UI detection)
     * 3) convert it to the Wallet Plugin type interface for legacy compatibility
     * 4) push the wallet into a local standard wallets array
     *
     * @param wallet
     * @returns
     */
    private standardizeAIP62WalletType;
    /**
     * To maintain support for both plugins and AIP-62 standard wallets,
     * without introducing dapps breaking changes, we convert
     * AIP-62 standard compatible wallets to the legacy adapter wallet plugin type.
     *
     * @param standardWallet An AIP-62 standard compatible wallet
     */
    private standardizeStandardWalletToPluginWalletType;
    private recordEvent;
    /**
     * Helper function to ensure wallet exists
     *
     * @param wallet A wallet
     */
    private ensureWalletExists;
    /**
     * Helper function to ensure account exists
     *
     * @param account An account
     */
    private ensureAccountExists;
    /**
     * @deprecated use ensureWalletExists
     */
    private doesWalletExist;
    /**
     * Function to cleat wallet adapter data.
     *
     * - Removes current connected wallet state
     * - Removes current connected account state
     * - Removes current connected network state
     * - Removes autoconnect local storage value
     */
    private clearData;
    /**
     * Queries and sets ANS name for the current connected wallet account
     */
    private setAnsName;
    /**
     * Sets the connected wallet
     *
     * @param wallet A wallet
     */
    setWallet(wallet: Wallet | null): void;
    /**
     * Sets the connected account
     *
     * `AccountInfo` type comes from a legacy wallet adapter plugin
     * `StandardAccountInfo` type comes from AIP-62 standard compatible wallet when onAccountChange event is called
     * `UserResponse<StandardAccountInfo>` type comes from AIP-62 standard compatible wallet on wallet connect
     *
     * @param account An account
     */
    setAccount(account: AccountInfo | StandardAccountInfo | UserResponse<StandardAccountInfo> | null): void;
    /**
     * Sets the connected network
     *
     * `NetworkInfo` type comes from a legacy wallet adapter plugin
     * `StandardNetworkInfo` type comes from AIP-62 standard compatible wallet
     *
     * @param network A network
     */
    setNetwork(network: NetworkInfo | StandardNetworkInfo | null): void;
    /**
     * Helper function to detect whether a wallet is connected
     *
     * @returns boolean
     */
    isConnected(): boolean;
    /**
     * Getter to fetch all detected wallets
     */
    get wallets(): ReadonlyArray<AnyAptosWallet>;
    /**
     * Getter to fetch all detected plugin wallets
     */
    get pluginWallets(): ReadonlyArray<Wallet>;
    /**
     * Getter to fetch all detected AIP-62 standard compatible wallets
     */
    get standardWallets(): ReadonlyArray<AptosStandardWallet>;
    /**
     * Getter for the current connected wallet
     *
     * @return wallet info
     * @throws WalletNotSelectedError
     */
    get wallet(): WalletInfo | null;
    /**
     * Getter for the current connected account
     *
     * @return account info
     * @throws WalletAccountError
     */
    get account(): AccountInfo | null;
    /**
     * Getter for the current wallet network
     *
     * @return network info
     * @throws WalletGetNetworkError
     */
    get network(): NetworkInfo | null;
    /**
     * Helper function to run some checks before we connect with a wallet.
     *
     * @param walletName. The wallet name we want to connect with.
     */
    connect(walletName: string): Promise<void | string>;
    /**
     * Connects a wallet to the dapp.
     * On connect success, we set the current account and the network, and keeping the selected wallet
     * name in LocalStorage to support autoConnect function.
     *
     * @param selectedWallet. The wallet we want to connect.
     * @emit emits "connect" event
     * @throws WalletConnectionError
     */
    connectWallet(selectedWallet: Wallet): Promise<void>;
    /**
     * Disconnect the current connected wallet. On success, we clear the
     * current account, current network and LocalStorage data.
     *
     * @emit emits "disconnect" event
     * @throws WalletDisconnectionError
     */
    disconnect(): Promise<void>;
    /**
     * Signs and submits a transaction to chain
     *
     * @param transactionInput InputTransactionData
     * @param options optional. A configuration object to generate a transaction by
     * @returns The pending transaction hash (V1 output) | PendingTransactionResponse (V2 output)
     */
    signAndSubmitTransaction(transactionInput: InputTransactionData): Promise<{
        hash: Types.HexEncodedBytes;
        output?: any;
    } | PendingTransactionResponse>;
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
    signTransaction(transactionOrPayload: AnyRawTransaction | Types.TransactionPayload, asFeePayer?: boolean, options?: InputGenerateTransactionOptions): Promise<AccountAuthenticator>;
    /**
     * Sign message (doesnt submit to chain).
     *
     * @param message
     * @return response from the wallet's signMessage function
     * @throws WalletSignMessageError
     */
    signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
    /**
     * Submits transaction to chain
     *
     * @param transaction
     * @returns PendingTransactionResponse
     */
    submitTransaction(transaction: InputSubmitTransactionData): Promise<PendingTransactionResponse>;
    /**
     Event for when account has changed on the wallet
     @return the new account info
     @throws WalletAccountChangeError
     */
    onAccountChange(): Promise<void>;
    /**
     Event for when network has changed on the wallet
     @return the new network info
     @throws WalletNetworkChangeError
     */
    onNetworkChange(): Promise<void>;
    /**
     * Sends a change network request to the wallet to change the connected network
     *
     * @param network
     * @returns AptosChangeNetworkOutput
     */
    changeNetwork(network: Network): Promise<AptosChangeNetworkOutput>;
    /**
     * Signs a message and verifies the signer
     * @param message SignMessagePayload
     * @returns boolean
     */
    signMessageAndVerify(message: SignMessagePayload): Promise<boolean>;
}
//# sourceMappingURL=WalletCore.d.ts.map