import { AptosSignMessageInput, AptosSignMessageOutput, AptosWallet, NetworkInfo, UserResponse, WalletAccount } from "@aptos-labs/wallet-standard";
import { ethers, TransactionRequest } from "ethers";
import { AdapterWallet, WalletReadyState } from "@aptos-labs/wallet-adapter-aggregator-core";
export type EIP6963ProviderInfo = {
    info: {
        uuid: string;
        name: string;
        icon: `data:image/svg+xml;base64,${string}`;
        rdns: string;
    };
    provider: any;
};
export declare enum Eip6963Wallets {
    PhantomWallet = "Phantom",
    MetaMaskWallet = "MetaMask",
    BackpackWallet = "Backpack",
    CoinbaseWallet = "Coinbase Wallet",
    NightlyWallet = "Nightly",
    RabbyWallet = "Rabby Wallet"
}
export declare const Eip6963WalletUrls: Record<Eip6963Wallets, string>;
export declare function fetchEthereumWallets(): AdapterWallet[];
export type Eip6963AccountInfo = {
    address: string;
    publicKey: Uint8Array<ArrayBufferLike>;
};
export type Eip6963Features = {
    "eip6963:connect": {
        connect: () => Promise<UserResponse<Eip6963AccountInfo>>;
        version: string;
    };
    "eip6963:account": {
        account: () => Promise<Eip6963AccountInfo>;
        version: string;
    };
    "eip6963:sendTransaction": {
        sendTransaction: (transaction: TransactionRequest, provider: ethers.BrowserProvider) => Promise<UserResponse<string>>;
        version: string;
    };
    "eip6963:onAccountChange": {
        onAccountChange: (callback: (newAccount: Eip6963AccountInfo) => void) => void;
        version: string;
    };
};
export type Eip6963BaseWallet = AptosWallet & {
    features: Eip6963Features;
};
export declare class Eip6963Wallet extends AdapterWallet<Eip6963AccountInfo, NetworkInfo, Eip6963AccountInfo, AptosSignMessageInput, AptosSignMessageOutput, TransactionRequest, TransactionRequest, Eip6963AccountInfo, NetworkInfo, TransactionRequest, string> {
    readonly eip6963Wallet: Eip6963BaseWallet;
    readonly eip6963WalletProvider: EIP6963ProviderInfo;
    readonly version = "1.0.0";
    private provider?;
    accounts: WalletAccount[];
    connected: boolean;
    constructor(eip6963Wallet: Eip6963BaseWallet, eip6963WalletProvider: EIP6963ProviderInfo);
    get icon(): `data:image/svg+xml;base64,${string}` | `data:image/webp;base64,${string}` | `data:image/png;base64,${string}` | `data:image/gif;base64,${string}`;
    get name(): string;
    get url(): string;
    get readyState(): WalletReadyState;
    get chains(): readonly ["aptos:devnet", "aptos:testnet", "aptos:localnet", "aptos:mainnet"];
    get isConnected(): boolean;
    getAccount(): Promise<Eip6963AccountInfo>;
    getConnectedNetwork(): Promise<NetworkInfo>;
    connect(): Promise<Eip6963AccountInfo>;
    disconnect(): Promise<void>;
    signMessage(message: AptosSignMessageInput): Promise<AptosSignMessageOutput>;
    signTransaction(transaction: TransactionRequest): Promise<TransactionRequest>;
    sendTransaction(transaction: TransactionRequest): Promise<string>;
    onAccountChange(): Promise<void>;
    onNetworkChange(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map