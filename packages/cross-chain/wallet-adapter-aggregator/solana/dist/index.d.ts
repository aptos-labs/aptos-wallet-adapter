import { AccountInfo, AptosSignMessageInput, AptosSignMessageOutput, AptosWallet, NetworkInfo, UserResponse, WalletAccount } from "@aptos-labs/wallet-standard";
import { Transaction } from "@solana/web3.js";
import { AdapterWallet, WalletReadyState } from "@aptos-labs/wallet-adapter-aggregator-core";
export type SolanaUnsignedTransaction = Transaction | Transaction[];
export type SolanaSignedTransaction = Transaction | Transaction[];
export declare function getSolanaStandardWallets(): AdapterWallet[];
export type SolanaFeatures = {
    "solana:signTransaction": {
        signTransaction: (transaction: Transaction) => Promise<UserResponse<Transaction>>;
        version: string;
    };
};
export type SolanaBaseWallet = AptosWallet & {
    features: SolanaFeatures;
};
export declare class SolanaWallet extends AdapterWallet<AccountInfo, NetworkInfo, AccountInfo, AptosSignMessageInput, AptosSignMessageOutput, Transaction, Transaction, AccountInfo, NetworkInfo> {
    readonly solanaWallet: SolanaBaseWallet;
    readonly version = "1.0.0";
    accounts: WalletAccount[];
    connected: boolean;
    constructor(solanaWallet: SolanaBaseWallet);
    get icon(): `data:image/svg+xml;base64,${string}` | `data:image/webp;base64,${string}` | `data:image/png;base64,${string}` | `data:image/gif;base64,${string}`;
    get name(): string;
    get url(): string;
    get readyState(): WalletReadyState;
    get chains(): readonly ["aptos:devnet", "aptos:testnet", "aptos:localnet", "aptos:mainnet"];
    get isConnected(): boolean;
    getAccount(): Promise<AccountInfo>;
    getConnectedNetwork(): Promise<NetworkInfo>;
    connect(): Promise<AccountInfo>;
    disconnect(): Promise<void>;
    signMessage(message: AptosSignMessageInput): Promise<AptosSignMessageOutput>;
    signTransaction(transaction: Transaction): Promise<Transaction>;
    onAccountChange(): Promise<void>;
    onNetworkChange(callback: (network: NetworkInfo) => void): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map