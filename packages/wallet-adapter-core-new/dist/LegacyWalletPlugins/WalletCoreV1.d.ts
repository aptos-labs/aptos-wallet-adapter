import { TxnBuilderTypes, Types } from "aptos";
import EventEmitter from "eventemitter3";
import { InputGenerateTransactionPayloadData } from "@aptos-labs/ts-sdk";
import { Wallet, WalletCoreEvents, TransactionOptions, NetworkInfo, InputTransactionData, AccountInfo, SignMessagePayload } from "./types";
import { DappConfig } from "../WalletCoreNew";
export declare class WalletCoreV1 extends EventEmitter<WalletCoreEvents> {
    connect(wallet: Wallet): Promise<any>;
    /**
     * Resolve the transaction type (BCS arguments or Simple arguments)
     *
     * @param payloadData
     * @param network
     * @param wallet
     * @param transactionInput
     *
     * @returns
     */
    resolveSignAndSubmitTransaction(payloadData: InputGenerateTransactionPayloadData, network: NetworkInfo | null, wallet: Wallet, transactionInput: InputTransactionData, dappConfig?: DappConfig): Promise<any>;
    /**
    Sign and submit an entry (not bcs serialized) transaction type to chain.
    @param transaction a non-bcs serialized transaction
    @param options max_gas_amount and gas_unit_limit
    @return response from the wallet's signAndSubmitTransaction function
    @throws WalletSignAndSubmitMessageError
    */
    signAndSubmitTransaction(transaction: Types.TransactionPayload, wallet: Wallet, options?: TransactionOptions): Promise<any>;
    /**
     Sign and submit a bsc serialized transaction type to chain.
     @param transaction a bcs serialized transaction
     @param options max_gas_amount and gas_unit_limit
     @return response from the wallet's signAndSubmitBCSTransaction function
     @throws WalletSignAndSubmitMessageError
     */
    signAndSubmitBCSTransaction(transaction: TxnBuilderTypes.TransactionPayload, wallet: Wallet, options?: TransactionOptions): Promise<any>;
    /**
     Sign transaction
     @param transaction
     @param options max_gas_amount and gas_unit_limit
     @return response from the wallet's signTransaction function
     @throws WalletSignTransactionError
     */
    signTransaction(transaction: Types.TransactionPayload, wallet: Wallet, options?: TransactionOptions): Promise<Uint8Array | null>;
    /**
     * Signs a message and verifies the signer
     * @param message SignMessagePayload
     * @returns boolean
     */
    signMessageAndVerify(message: SignMessagePayload, wallet: Wallet, account: AccountInfo): Promise<boolean>;
}
//# sourceMappingURL=WalletCoreV1.d.ts.map