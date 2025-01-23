import EventEmitter from "eventemitter3";
import { AptosStandardWallet, AvailableWallets } from "./AIP62StandardWallets";
import { WalletReadyState } from "./constants";
import { AccountAuthenticator, AnyRawTransaction, InputGenerateTransactionOptions, InputSubmitTransactionData, Network, PendingTransactionResponse } from "@aptos-labs/ts-sdk";
import { AptosWallet, AptosSignAndSubmitTransactionOutput, AptosSignTransactionOutputV1_1, NetworkInfo, AccountInfo, AptosSignMessageInput, AptosSignMessageOutput, AptosChangeNetworkOutput } from "@aptos-labs/wallet-standard";
export type { NetworkInfo, AccountInfo } from "@aptos-labs/wallet-standard";
import { InputTransactionData } from "./LegacyWalletPlugins/types";
import { AptosConnectWalletConfig } from "@aptos-connect/wallet-adapter-plugin";
export type AdapterWallet = AptosWallet & {
    readyState?: WalletReadyState;
};
export type AdapterNotDetectedWallet = Omit<AdapterWallet, "features" | "version" | "chains" | "accounts"> & {
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
    ansName?: string;
};
export declare class WalletCoreNew extends EventEmitter<WalletCoreEvents> {
    private _wallet;
    private readonly _sdkWallets;
    private _standard_wallets;
    private _standard_not_detected_wallets;
    private _network;
    private _connected;
    private _connecting;
    private _account;
    private _dappConfig;
    private _optInWallets;
    private _disableTelemetry;
    private readonly ga4;
    constructor(optInWallets?: ReadonlyArray<AvailableWallets>, dappConfig?: DappConfig, disableTelemetry?: boolean);
    private fetchExtensionAIP62AptosWallets;
    /**
     * Set AIP-62 extension wallets
     *
     * @param extensionwWallets
     */
    private setExtensionAIP62Wallets;
    /**
     * Set AIP-62 SDK wallets
     */
    private fetchSDKAIP62AptosWallets;
    private appendNotDetectedStandardSupportedWallets;
    /**
     * A function that excludes an AIP-62 compatible wallet the dapp doesnt want to include
     *
     * @param walletName
     * @returns
     */
    excludeWallet(wallet: AptosStandardWallet): boolean;
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
     * Queries and sets ANS name for the current connected wallet account
     */
    private setAnsName;
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
     * Sets the connected wallet
     *
     * @param wallet A wallet
     */
    setWallet(wallet: AptosWallet | null): void;
    /**
     * Sets the connected account
     *
     * @param account An account
     */
    setAccount(account: AccountInfo | null): void;
    /**
     * Sets the connected network
     *
     * @param network A network
     */
    setNetwork(network: NetworkInfo | null): void;
    /**
     * Helper function to detect whether a wallet is connected
     *
     * @returns boolean
     */
    isConnected(): boolean;
    /**
     * Getter to fetch all detected wallets
     */
    get wallets(): ReadonlyArray<AptosWallet>;
    get notDetectedWallets(): ReadonlyArray<AdapterNotDetectedWallet>;
    /**
     * Getter for the current connected wallet
     *
     * @return wallet info
     * @throws WalletNotSelectedError
     */
    get wallet(): AptosWallet | null;
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
    connectWallet(selectedWallet: AdapterWallet): Promise<void>;
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
     * @returns PendingTransactionResponse
     */
    signAndSubmitTransaction(transactionInput: InputTransactionData): Promise<AptosSignAndSubmitTransactionOutput>;
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
    signTransaction(transactionOrPayload: AnyRawTransaction | InputTransactionData, asFeePayer?: boolean, options?: InputGenerateTransactionOptions & {
        expirationSecondsFromNow?: number;
        expirationTimestamp?: number;
    }): Promise<AccountAuthenticator | AptosSignTransactionOutputV1_1>;
    /**
     * Sign message (doesnt submit to chain).
     *
     * @param message
     * @return response from the wallet's signMessage function
     * @throws WalletSignMessageError
     */
    signMessage(message: AptosSignMessageInput): Promise<AptosSignMessageOutput>;
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
    signMessageAndVerify(message: AptosSignMessageInput): Promise<boolean>;
}
//# sourceMappingURL=WalletCoreNew.d.ts.map