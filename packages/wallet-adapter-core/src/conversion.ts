import { Network, AnyTransactionPayloadInstance } from "@aptos-labs/ts-sdk"
import { BCS, TxnBuilderTypes } from "aptos"
import { NetworkInfo } from "./types";
import { NetworkName } from "./constants";

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
