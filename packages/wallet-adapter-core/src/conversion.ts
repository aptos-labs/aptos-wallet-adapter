import {
  Network,
  TransactionPayload,
  InputGenerateTransactionPayloadData,
  TypeTag,
} from "@aptos-labs/ts-sdk";
import { BCS, TxnBuilderTypes, Types } from "aptos";
import { NetworkInfo } from "./types";

// old => new
export function convertNetwork(networkInfo: NetworkInfo | null): Network {
  switch (networkInfo?.name.toLowerCase()) {
    case "mainnet" as Network:
      return Network.MAINNET;
    case "testnet" as Network:
      return Network.TESTNET;
    case "devnet" as Network:
      return Network.DEVNET;
    default:
      throw new Error("Invalid network name");
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
