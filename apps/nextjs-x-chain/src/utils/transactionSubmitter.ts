import {
  GasStationClient,
  GasStationTransactionSubmitter,
} from "@aptos-labs/gas-station-client";
import { Network, type TransactionSubmitter } from "@aptos-labs/ts-sdk";

const network = Network.TESTNET;
// Type cast needed: gas-station-client@2 was built against ts-sdk@5 types
const gasStationClient = new GasStationTransactionSubmitter(
  new GasStationClient({
    network: network as never,
    apiKey: process.env.NEXT_PUBLIC_GAS_STATION_API_KEY,
  }),
);

export const getTransactionSubmitter = (): TransactionSubmitter => {
  return gasStationClient as never;
};
