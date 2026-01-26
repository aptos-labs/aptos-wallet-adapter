import { Chain } from "../CrossChainCore";

export enum Context {
  ETH = "Ethereum",
  SOLANA = "Solana",
  APTOS = "Aptos",
  SUI = "Sui",
}

export type BaseChainConfig = {
  key: Chain;
  context: Context;
  disabledAsSource?: boolean;
  disabledAsDestination?: boolean;
};

export interface ChainConfig extends BaseChainConfig {
  defaultRpc: string;
  displayName: string;
  explorerUrl: string;
  explorerName: string;
  chainId: number | string;
  icon: Chain;
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
