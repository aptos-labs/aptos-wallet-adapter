import { Types } from 'aptos';
import { EventEmitter } from 'eventemitter3';

declare enum WalletReadyState {
    /**
     * User-installable wallets can typically be detected by scanning for an API
     * that they've injected into the global context. If such an API is present,
     * we consider the wallet to have been installed.
     */
    Installed = "Installed",
    NotDetected = "NotDetected",
    /**
     * Loadable wallets are always available to you. Since you can load them at
     * any time, it's meaningless to say that they have been detected.
     */
    Loadable = "Loadable",
    /**
     * If a wallet is not supported on a given platform (eg. server-rendering, or
     * mobile) then it will stay in the `Unsupported` state.
     */
    Unsupported = "Unsupported"
}
declare enum NetworkName {
    Mainnet = "mainnet",
    Testnet = "testnet",
    Devnet = "devnet"
}

declare type WalletName<T extends string = string> = T & {
    __brand__: "WalletName";
};
declare type NetworkInfo = {
    name: NetworkName | undefined;
};
declare type AccountInfo = {
    address: string;
    publicKey: string;
};
interface AdapterPluginEvents {
    onNetworkChange(callback: any): Promise<any>;
    onAccountChange(callback: any): Promise<any>;
}
interface AdapterPluginProps<Name extends string = string> {
    name: WalletName<Name>;
    url: string;
    icon: `data:image/${"svg+xml" | "webp" | "png" | "gif"};base64,${string}`;
    provider: any;
    connect(): Promise<any>;
    disconnect: () => Promise<any>;
    network: () => Promise<any>;
    signAndSubmitTransaction<T extends Types.TransactionPayload, V>(transaction: T, options?: V): Promise<{
        hash: Types.HexEncodedBytes;
    }>;
    signMessage<T extends SignMessagePayload>(message: T): Promise<SignMessageResponse>;
}
declare type AdapterPlugin<Name extends string = string> = AdapterPluginProps<Name> & AdapterPluginEvents;
declare type Wallet<Name extends string = string> = AdapterPlugin<Name> & {
    readyState?: WalletReadyState;
};
declare type WalletInfo = {
    name: WalletName;
    icon: string;
    url: string;
};
declare interface WalletCoreEvents {
    connect(account: AccountInfo | null): void;
    disconnect(): void;
    readyStateChange(wallet: Wallet): void;
    networkChange(network: NetworkInfo | null): void;
    accountChange(account: AccountInfo | null): void;
}
interface SignMessagePayload {
    address?: boolean;
    application?: boolean;
    chainId?: boolean;
    message: string;
    nonce: string;
}
interface SignMessageResponse {
    address: string;
    application: string;
    chainId: number;
    fullMessage: string;
    message: string;
    nonce: string;
    prefix: "APTOS";
    signature: string;
}

declare class WalletCore extends EventEmitter<WalletCoreEvents> {
    private _wallets;
    private _wallet;
    private _account;
    private _network;
    private _connecting;
    private _connected;
    constructor(plugins: Wallet[]);
    private scopePollingDetectionStrategy;
    private isWalletExists;
    private clearData;
    setWallet(wallet: Wallet | null): void;
    setAccount(account: AccountInfo | null): void;
    setNetwork(network: NetworkInfo | null): void;
    isConnected(): boolean;
    get wallets(): Wallet[];
    get wallet(): WalletInfo | null;
    get account(): AccountInfo | null;
    get network(): NetworkInfo | null;
    connect(walletName: WalletName): Promise<void>;
    disconnect(): Promise<void>;
    signAndSubmitTransaction(transaction: Types.TransactionPayload): Promise<any>;
    signTransaction(transaction: Types.TransactionPayload): Promise<Uint8Array | null>;
    signMessage(message: SignMessagePayload): Promise<SignMessageResponse | null>;
    onAccountChange(): Promise<void>;
    onNetworkChange(): Promise<void>;
}

export { WalletCore };
