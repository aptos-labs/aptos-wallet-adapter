import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { NetworkInfo } from "@aptos-labs/wallet-adapter-core";

export const aptosClient = (network?: NetworkInfo | null) => {
  if (network?.name.toLowerCase() === Network.DEVNET.toLowerCase()) {
    return DEVNET_CLIENT;
  } else if (network?.name.toLowerCase() === Network.TESTNET.toLowerCase()) {
    return TESTNET_CLIENT;
  } else if (network?.name.toLowerCase() === Network.MAINNET.toLowerCase()) {
    throw new Error("Please use devnet or testnet for testing");
  } else {
    const CUSTOM_CONFIG = new AptosConfig({
      network: Network.CUSTOM,
      fullnode: network?.url,
    });
    return new Aptos(CUSTOM_CONFIG);
  }
};

// Devnet client
export const DEVNET_CONFIG = new AptosConfig({
  network: Network.DEVNET,
});
export const DEVNET_CLIENT = new Aptos(DEVNET_CONFIG);

// Testnet client
export const TESTNET_CONFIG = new AptosConfig({ network: Network.TESTNET });
export const TESTNET_CLIENT = new Aptos(TESTNET_CONFIG);
