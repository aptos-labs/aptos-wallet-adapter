import { AccountAuthenticator, Deserializer, Network, TransactionPayloadScript, TransactionPayloadEntryFunction, TransactionPayloadMultisig, AnyTransactionPayloadInstance, InputAnyRawTransaction } from "@aptos-labs/ts-sdk"
import { BCS, HexString, TxnBuilderTypes, Types } from "aptos"
import { NetworkInfo } from "./types";
import { NetworkName } from "./constants";
import { TransactionAuthenticator } from "@aptos-labs/ts-sdk";

// old => new
export function convertNetwork(networkInfo: NetworkInfo | null): Network {
    switch(networkInfo?.name.toLowerCase()) {
        case "mainnet" as NetworkName:
            return Network.MAINNET;
        case "testnet" as NetworkName:
            return Network.TESTNET;
        case "devnet" as NetworkName:
            return Network.DEVNET;
        default:
            throw new Error("Invalid network name")
    }
}

// new => old
export function convertToBCSPayload(payload: AnyTransactionPayloadInstance): TxnBuilderTypes.TransactionPayload {
    const deserializer = new BCS.Deserializer(payload.bcsToBytes());
    return TxnBuilderTypes.TransactionPayload.deserialize(deserializer);
}

// new => old
export function convertAuthenticator(authenticator: AccountAuthenticator): TxnBuilderTypes.AccountAuthenticator {
    const deserializer = new BCS.Deserializer(authenticator.bcsToBytes());
    return TxnBuilderTypes.AccountAuthenticator.deserialize(deserializer)
}

// new => old
export function convertRawTransaction(rawTransaction: InputAnyRawTransaction): TxnBuilderTypes.RawTransaction | TxnBuilderTypes.RawTransactionWithData {
    // rawTransaction is already the serialized BCS bytes here
    const deserializer = new BCS.Deserializer(rawTransaction.rawTransaction);
    if (rawTransaction.feePayerAddress !== undefined) {
        return TxnBuilderTypes.FeePayerRawTransaction.deserialize(deserializer)
    } else if (rawTransaction.secondarySignerAddresses !== undefined) {
        return TxnBuilderTypes.MultiAgentRawTransaction.deserialize(deserializer)
    } else {
        return TxnBuilderTypes.RawTransaction.deserialize(deserializer)
    }
}

// new => old
export function convertTransaction(transaction: TransactionAuthenticator): TxnBuilderTypes.TransactionAuthenticator {
    const deserializer = new BCS.Deserializer(transaction.bcsToBytes());
    return TxnBuilderTypes.Transaction.deserialize(deserializer)
}
