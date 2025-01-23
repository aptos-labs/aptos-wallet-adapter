import { Network, TransactionPayload, InputGenerateTransactionPayloadData, AptosConfig, InputEntryFunctionData, TransactionPayloadEntryFunction } from "@aptos-labs/ts-sdk";
import { NetworkInfo as StandardNetworkInfo } from "@aptos-labs/wallet-standard";
import { TxnBuilderTypes, Types } from "aptos";
import { NetworkInfo } from "./types";
export declare function convertNetwork(networkInfo: NetworkInfo | StandardNetworkInfo | null): Network;
export declare function convertV2TransactionPayloadToV1BCSPayload(payload: TransactionPayload): TxnBuilderTypes.TransactionPayload;
export declare function convertV2PayloadToV1JSONPayload(payload: InputGenerateTransactionPayloadData): Types.TransactionPayload;
export declare function convertPayloadInputV1ToV2(inputV1: Types.TransactionPayload): InputEntryFunctionData;
export declare function generateTransactionPayloadFromV1Input(aptosConfig: AptosConfig, inputV1: Types.TransactionPayload): Promise<TransactionPayloadEntryFunction>;
export interface CompatibleTransactionOptions {
    expireTimestamp?: number;
    expirationSecondsFromNow?: number;
    expirationTimestamp?: number;
    gasUnitPrice?: number;
    gas_unit_price?: number;
    maxGasAmount?: number;
    max_gas_amount?: number;
    sender?: string;
    sequenceNumber?: number;
}
//# sourceMappingURL=conversion.d.ts.map