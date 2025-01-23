import { AptosSignTransactionInputV1_1, AptosSignTransactionOutput, AptosSignMessageOutput, AptosSignMessageInput, AptosWallet, AptosSignAndSubmitTransactionOutput, AccountInfo as StandardAccountInfo, AptosSignTransactionOutputV1_1 } from "@aptos-labs/wallet-standard";
import { AnyRawTransaction, Aptos } from "@aptos-labs/ts-sdk";
import { WalletReadyState } from "../constants";
import { AccountInfo, InputTransactionData, Wallet } from "../LegacyWalletPlugins";
export type AptosStandardWallet = AptosWallet & {
    readyState?: WalletReadyState;
};
export declare class WalletStandardCore {
    connect(wallet: Wallet): Promise<StandardAccountInfo>;
    /**
     * Signs and submits a transaction to chain
     *
     * @param transactionInput InputTransactionData
     * @returns PendingTransactionResponse
     */
    signAndSubmitTransaction(transactionInput: InputTransactionData, aptos: Aptos, account: AccountInfo, wallet: Wallet, standardWallets: ReadonlyArray<AptosStandardWallet>): Promise<AptosSignAndSubmitTransactionOutput>;
    /**
     * Signs a transaction
     *
     * To support both existing wallet adapter V1 and V2, we support 2 input types
     *
     * @param transactionOrPayload AnyRawTransaction
     * @param options asFeePayer. To sign a transaction as the fee payer sponsor
     *
     * @returns AptosSignTransactionOutput
     */
    signTransaction(transaction: AnyRawTransaction, wallet: Wallet, asFeePayer?: boolean): Promise<AptosSignTransactionOutput>;
    signTransaction(input: AptosSignTransactionInputV1_1, wallet: Wallet): Promise<AptosSignTransactionOutputV1_1>;
    /**
     * Sign message
     *
     * @param message AptosSignMessageInput
     * @return AptosSignMessageOutput
     * @throws WalletSignMessageError
     */
    signMessage(message: AptosSignMessageInput, wallet: Wallet): Promise<AptosSignMessageOutput>;
    /**
     * Signs a message and verifies the signer
     * @param message AptosSignMessageInput
     * @returns boolean
     */
    signMessageAndVerify(message: AptosSignMessageInput, wallet: Wallet): Promise<boolean>;
}
//# sourceMappingURL=WalletStandard.d.ts.map