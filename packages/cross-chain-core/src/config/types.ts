import { ChainId } from "@wormhole-foundation/sdk";
import { Chain } from "../CrossChainCore";

export enum Context {
  ETH = "Ethereum",
  SOLANA = "Solana",
  APTOS = "Aptos",
}

export type BaseChainConfig = {
  key: Chain;
  id: ChainId;
  context: Context;
  finalityThreshold: number;
  disabledAsSource?: boolean;
  disabledAsDestination?: boolean;
};

export interface ChainConfig extends BaseChainConfig {
  defaultRpc: string;
  displayName: string;
  explorerUrl: string;
  explorerName: string;
  gasToken: string;
  wrappedGasToken?: string;
  chainId: number | string;
  icon: Chain;
  maxBlockSearch: number;
  symbol?: string;
}

export type ChainsConfig = {
  [chain in Chain]?: ChainConfig;
};

export type TokenConfig = {
  symbol: string;
  name?: string;
  decimals: number;
  icon: string;
  tokenId: {
    chain: Chain;
    address: string;
  };
};
