import {
  GasStationClient,
  GasStationTransactionSubmitter,
} from "@aptos-labs/gas-station-client";
import { Network } from "@aptos-labs/ts-sdk";

const network = Network.TESTNET;
const gasStationClient = new GasStationTransactionSubmitter(
  new GasStationClient({
    // Cast required because @aptos-labs/gas-station-client still bundles
    // ts-sdk v5 types; the v7 Network enum is structurally different.
    // Remove this cast once `@aptos-labs/gas-station-client` publishes
    // v7-compatible types.
    network: network as unknown as ConstructorParameters<
      typeof GasStationClient
    >[0]["network"],
    apiKey: process.env.NEXT_PUBLIC_GAS_STATION_API_KEY,
  }),
);

export const getTransactionSubmitter = (): GasStationTransactionSubmitter => {
  return gasStationClient;
};
