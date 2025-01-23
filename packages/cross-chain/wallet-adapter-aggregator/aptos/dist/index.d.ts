import { AdapterWallet, WalletReadyState } from "@aptos-labs/wallet-adapter-aggregator-core";
import { AccountInfo, NetworkInfo, WalletCore, AdapterWallet as AptosBaseWallet, AnyRawTransaction, InputTransactionData, AccountAuthenticator } from "@aptos-labs/wallet-adapter-core";
import { AptosSignMessageInput, AptosSignMessageOutput, WalletAccount } from "@aptos-labs/wallet-standard";
export declare const getAptosWallets: () => AptosWallet[];
export declare class AptosWallet extends AdapterWallet<AccountInfo, NetworkInfo, AccountInfo | null, AptosSignMessageInput, AptosSignMessageOutput, {
    transactionOrPayload: AnyRawTransaction | InputTransactionData;
    asFeePayer?: boolean;
}, {
    authenticator: AccountAuthenticator;
    rawTransaction: Uint8Array;
}, AccountInfo, NetworkInfo> {
    readonly aptosWallet: AptosBaseWallet;
    readonly walletCore: WalletCore;
    readonly version = "1.0.0";
    accounts: WalletAccount[];
    connected: boolean;
    constructor(aptosWallet: AptosBaseWallet, walletCore: WalletCore);
    get icon(): `data:image/svg+xml;base64,${string}` | `data:image/webp;base64,${string}` | `data:image/png;base64,${string}` | `data:image/gif;base64,${string}`;
    get name(): string;
    get url(): string;
    get readyState(): WalletReadyState;
    get chains(): readonly ["aptos:devnet", "aptos:testnet", "aptos:localnet", "aptos:mainnet"];
    get isConnected(): boolean;
    getAccount(): Promise<AccountInfo>;
    getConnectedNetwork(): Promise<NetworkInfo>;
    connect(): Promise<AccountInfo | null>;
    disconnect(): Promise<void>;
    signMessage(message: AptosSignMessageInput): Promise<import("@aptos-labs/wallet-adapter-core").AptosSignMessageOutput>;
    signTransaction(args: {
        transactionOrPayload: AnyRawTransaction | InputTransactionData;
        asFeePayer?: boolean;
    }): Promise<{
        authenticator: AccountAuthenticator;
        rawTransaction: Uint8Array;
    }>;
    onAccountChange(): void;
    onNetworkChange(callback: (network: NetworkInfo) => void): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map