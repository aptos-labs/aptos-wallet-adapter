import { Network as AptosNetwork } from '@aptos-labs/ts-sdk';

/**
 * Subset of `Network` enum that only includes standard networks.
 */
export type StandardNetwork = Exclude<AptosNetwork, AptosNetwork.CUSTOM>;

// Note: mapping to the original enum ensures the values are compatible.
export const StandardNetwork = {
  MAINNET: AptosNetwork.MAINNET,
  TESTNET: AptosNetwork.TESTNET,
  DEVNET: AptosNetwork.DEVNET,
  LOCAL: AptosNetwork.LOCAL,
} as const;

/**
 * Custom network configuration. Requires at least the full node URL to work properly.
 */
export interface CustomNetwork {
  name: string;
  // consider making this required
  chainId?: number;
  fullNodeURL: string;
  indexerURL?: string;
  faucetURL?: string;
}

export type Network = StandardNetwork | CustomNetwork;
