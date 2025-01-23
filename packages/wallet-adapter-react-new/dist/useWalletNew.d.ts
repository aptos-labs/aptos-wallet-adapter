/// <reference types="react" />
import { AccountAuthenticator, AccountInfo, AdapterWallet, AnyRawTransaction, AptosSignAndSubmitTransactionOutput, AptosSignTransactionOutputV1_1, InputGenerateTransactionOptions, InputTransactionData, NetworkInfo, AptosSignMessageInput, AptosSignMessageOutput, AdapterNotDetectedWallet } from "@aptos-labs/wallet-adapter-core-new";
export interface WalletContextStateNew {
    connected: boolean;
    isLoading: boolean;
    account: AccountInfo | null;
    network: NetworkInfo | null;
    connect(walletName: string): void;
    signAndSubmitTransaction(transaction: InputTransactionData): Promise<AptosSignAndSubmitTransactionOutput>;
    signTransaction(transaction: AnyRawTransaction | InputTransactionData, asFeePayer?: boolean, options?: InputGenerateTransactionOptions & {
        expirationSecondsFromNow?: number;
        expirationTimestamp?: number;
    }): Promise<AccountAuthenticator | AptosSignTransactionOutputV1_1>;
    signMessage(message: AptosSignMessageInput): Promise<AptosSignMessageOutput>;
    signMessageAndVerify(message: AptosSignMessageInput): Promise<boolean>;
    disconnect(): void;
    wallet: AdapterWallet | null;
    wallets: ReadonlyArray<AdapterWallet>;
    notDetectedWallets: ReadonlyArray<AdapterNotDetectedWallet>;
}
export declare const WalletContextNew: import("react").Context<WalletContextStateNew>;
export declare function useWalletNew(): WalletContextStateNew;
//# sourceMappingURL=useWalletNew.d.ts.map