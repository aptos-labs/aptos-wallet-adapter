import {
  Network,
  TransactionPayload,
  InputGenerateTransactionPayloadData,
  TypeTag,
  AptosConfig,
  InputEntryFunctionData,
  InputMultiSigData,
  MoveFunctionId,
  generateTransactionPayload,
  TransactionPayloadEntryFunction,
} from "@aptos-labs/ts-sdk";
import { NetworkInfo as StandardNetworkInfo } from "@aptos-labs/wallet-standard";
import { BCS, TxnBuilderTypes, Types } from "aptos";
import { NetworkInfo } from "./types";

// old => new
export function convertNetwork(
  networkInfo: NetworkInfo | StandardNetworkInfo | null
): Network {
  switch (networkInfo?.name) {
    case "mainnet" as Network:
      return Network.MAINNET;
    case "testnet" as Network:
      return Network.TESTNET;
    case "devnet" as Network:
      return Network.DEVNET;
    case "local" as Network:
      return Network.LOCAL;
    default:
      throw new Error("Invalid Aptos network name");
  }
}

// new => old
export function convertV2TransactionPayloadToV1BCSPayload(
  payload: TransactionPayload
): TxnBuilderTypes.TransactionPayload {
  const deserializer = new BCS.Deserializer(payload.bcsToBytes());
  return TxnBuilderTypes.TransactionPayload.deserialize(deserializer);
}

export function convertV2PayloadToV1JSONPayload(
  payload: InputGenerateTransactionPayloadData
): Types.TransactionPayload {
  if ("bytecode" in payload) {
    // is a script payload
    throw new Error("script payload not supported");
    // is multisig function payload
  } else if ("multisigAddress" in payload) {
    const stringTypeTags: string[] | undefined = payload.typeArguments?.map(
      (typeTag) => {
        if (typeTag instanceof TypeTag) {
          return typeTag.toString();
        }
        return typeTag;
      }
    );
    const newPayload: Types.TransactionPayload = {
      type: "multisig_payload",
      multisig_address: payload.multisigAddress.toString(),
      function: payload.function,
      type_arguments: stringTypeTags || [],
      arguments: payload.functionArguments,
    };

    return newPayload;
  } else {
    // is entry function payload
    const stringTypeTags: string[] | undefined = payload.typeArguments?.map(
      (typeTag) => {
        if (typeTag instanceof TypeTag) {
          return typeTag.toString();
        }
        return typeTag;
      }
    );
    const newPayload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: payload.function,
      type_arguments: stringTypeTags || [],
      arguments: payload.functionArguments,
    };

    return newPayload;
  }
}

export async function generateTransactionPayloadFromV1Input(
  aptosConfig: AptosConfig,
  inputV1: Types.TransactionPayload
): Promise<TransactionPayloadEntryFunction> {
  if ("function" in inputV1) {
    const inputV2: InputEntryFunctionData | InputMultiSigData = {
      function: inputV1.function as MoveFunctionId,
      functionArguments: inputV1.arguments,
      typeArguments: inputV1.type_arguments,
    };
    return generateTransactionPayload({ ...inputV2, aptosConfig });
  }

  throw new Error("Payload type not supported");
}

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
