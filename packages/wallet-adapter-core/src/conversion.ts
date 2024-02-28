import { Network } from "@aptos-labs/ts-sdk";

// old => new
export function convertNetwork(networkName: string): Network {
  switch (networkName.toLowerCase()) {
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
