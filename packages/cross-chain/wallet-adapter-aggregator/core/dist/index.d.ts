import EventEmitter from "eventemitter3";
import { AccountInfo, NetworkInfo, WalletAccount } from "@aptos-labs/wallet-standard";
export type UsdcBalance = {
    amount: string;
    decimal: number;
    display: string;
};
export declare enum WalletReadyState {
    /**
     * Wallet can only be in one of two states - installed or not installed
     * Installed: wallets are detected by the browser event listeners and means they are installed on the user's browser.
     * NotDetected: wallets are not detected by the browser event listeners and means they are not installed on the user's browser.
     */
    Installed = "Installed",
    NotDetected = "NotDetected"
}
export declare interface WalletEvents {
    connect(account: AccountInfo | null): void;
    disconnect(): void;
    networkChange(network: NetworkInfo | null): void;
    accountChange(account: AccountInfo | null): void;
}
export declare abstract class AdapterWallet<GetAccountOutput = any, GetConnectedNetworkOutput = any, ConnectOutput = any, SignMessageInput = any, SignMessageOutput = any, SignTransactionInput = any, SignTransactionOutput = any, OnAccountChangeInput = any, OnNetworkChangeInput = any, SendTransactionInput = any, SendTransactionOutput = any> extends EventEmitter<WalletEvents> {
    abstract readonly version: "1.0.0";
    abstract accounts: WalletAccount[];
    abstract get name(): string;
    abstract get icon(): any;
    abstract get url(): string;
    abstract get readyState(): WalletReadyState;
    abstract getAccount(): Promise<GetAccountOutput>;
    abstract getConnectedNetwork(): Promise<GetConnectedNetworkOutput>;
    abstract connect(): Promise<ConnectOutput>;
    abstract disconnect(): Promise<void>;
    abstract signMessage(message: SignMessageInput): Promise<SignMessageOutput>;
    abstract signTransaction(transaction: SignTransactionInput): Promise<SignTransactionOutput>;
    abstract onAccountChange(callback: (account: OnAccountChangeInput) => void): void;
    abstract onNetworkChange(callback: (network: OnNetworkChangeInput) => void): void;
    sendTransaction?(transaction: SendTransactionInput): Promise<SendTransactionOutput>;
    getAccountUsdcBalance?(): Promise<UsdcBalance>;
}
//# sourceMappingURL=index.d.ts.map