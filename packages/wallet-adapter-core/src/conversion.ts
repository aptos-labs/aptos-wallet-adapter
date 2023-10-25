import { AccountAuthenticator, Deserializer, TransactionPayload, TransactionBuilderTypes, AnyRawTransaction, Network, TransactionPayloadScript, TransactionPayloadEntryFunction, TransactionPayloadMultisig } from "@aptos-labs/ts-sdk"
import { BCS, HexString, TxnBuilderTypes, Types } from "aptos"
import { NetworkInfo } from "./types";
import { NetworkName } from "./constants";


// we could serialize the entire thing and then deserialize
// export const convertEntryFunction(entryFunction: EntryFunction): TxnBuilderTypes.EntryFunction {
//     const newModuleName = entryFunction.module_name;
//     const newFunctionName = entryFunction.function_name;
//     const newArgs = entryFunction.args;
//     const newTypeArgs = entryFunction.type_args;

//     const oldHexAddress = HexString.fromUint8Array( newModuleName.address.data );
//     const oldAddress = TxnBuilderTypes.AccountAddress.fromHex(oldHexAddress);
//     const oldModuleIdentifier = new TxnBuilderTypes.Identifier(newModuleName.name.identifier);
//     const oldModuleName = new TxnBuilderTypes.ModuleId(oldAddress, oldModuleIdentifier);
//     const oldFunctionName = new TxnBuilderTypes.Identifier(newFunctionName.identifier);

//     const oldArgs = newArgs.map((arg) => { arg.bcsToBytes() });
//     const oldTypeArgs = Array<TxnBuilderTypes.TypeTag>();

//     return new TxnBuilderTypes.EntryFunction(
//         oldModuleName,
//         oldFunctionName,
//         oldTypeArgs,
//         oldArgs,
//     )
// }

// old => new
export function convertNetwork(networkInfo: NetworkInfo | null): Network {
    switch(networkInfo?.name) {
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
export function convertToBCSPayload(payload: TransactionBuilderTypes.TransactionPayload): TxnBuilderTypes.TransactionPayload {
    const deserializer = new BCS.Deserializer(payload.bcsToBytes());
    return TxnBuilderTypes.TransactionPayload.deserialize(deserializer)
}
declare type TransactionPayload = TransactionPayloadEntryFunction | TransactionPayloadScript | TransactionPayloadMultisig;

/*
// new => old
export function convertToJSONPayload(payload: TransactionPayload): Types.TransactionPayload {
    let payloadType: string;
    let bytecode: Uint8Array;
    let type_arguments: string;
    let function_args: any;
    if (payload instanceof TransactionPayloadEntryFunction) {
        payloadType = "entry_function_payload"
        type_arguments = payload.entryFunction.type_args; // need a .toString() function for this
        function_args = payload.entryFunction.args.map((arg) => { arg.value }); // would need `inner` or `getRawValues` in EntryFunctionArgumentTypes
    } else if (payload instanceof TransactionPayloadScript) {
        payloadType = "script_payload"
    } else if (payload instanceof TransactionPayloadMultisig) {
        payloadType = "multisig"
        code = 
    }
}
*/

// new => old
export function convertAuthenticator(authenticator: AccountAuthenticator): TxnBuilderTypes.AccountAuthenticator {
    const deserializer = new BCS.Deserializer(authenticator.bcsToBytes());
    return TxnBuilderTypes.AccountAuthenticator.deserialize(deserializer)
}

// new => old
export function convertRawTransaction(rawTransaction: AnyRawTransaction): TxnBuilderTypes.RawTransaction | TxnBuilderTypes.RawTransactionWithData {
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
export function convertTransaction(transaction: TransactionBuilderTypes.TransactionAuthenticator): TxnBuilderTypes.TransactionAuthenticator {
    const deserializer = new BCS.Deserializer(transaction.bcsToBytes());
    return TxnBuilderTypes.Transaction.deserialize(deserializer)
}

// export async function convertToOldTypes<T1 extends Serializable, T2>(newType: T1, cls: Deserializable<T2>): Promise<T2> {
//     const bcsBytes = newType.bcsToBytes();
//     const deserializer = new BCS.Deserializer(bcsBytes);
//     return cls.deserialize(deserializer)
// }