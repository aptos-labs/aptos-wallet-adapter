import { Account, Network } from "@aptos-labs/ts-sdk";

import {
  WormholeInitiateTransferRequest,
  WormholeInitiateTransferResponse,
  WormholeProvider,
  WormholeQuoteRequest,
  WormholeQuoteResponse,
} from "./providers/wormhole";

import {
  ChainsConfig,
  testnetChains,
  testnetTokens,
  mainnetChains,
  mainnetTokens,
  TokenConfig,
  AptosTestnetUSDCToken,
  AptosMainnetUSDCToken,
} from "./config";

export interface CrossChainDappConfig {
  aptosNetwork: Network;
  disableTelemetry?: boolean;
  solanaConfig?: {
    rpc?: string;
    priorityFeeConfig?: {
      percentile?: number;
      percentileMultiple?: number;
      min?: number;
      max?: number;
    };
  };
}
export type { AccountAddressInput } from "@aptos-labs/ts-sdk";
export { NetworkToChainId, NetworkToNodeAPI } from "@aptos-labs/ts-sdk";
export type AptosAccount = Account;

export type Chain = "Solana" | "Ethereum" | "Aptos";

export type CCTPProviders = "Wormhole";

export type UsdcBalance = {
  amount: string;
  decimal: number;
  display: string;
};

export interface CrossChainProvider<
  TQuoteRequest = any,
  TQuoteResponse = any,
  TInitiateTransferRequest = any,
  TInitiateTransferResponse = any,
> {
  getQuote(params: TQuoteRequest): Promise<TQuoteResponse>;
  initiateCCTPTransfer(
    params: TInitiateTransferRequest
  ): Promise<TInitiateTransferResponse>;
}

export class CrossChainCore {
  readonly _dappConfig: CrossChainDappConfig | undefined;

  readonly CHAINS: ChainsConfig = testnetChains;
  readonly TOKENS: Record<string, TokenConfig> = testnetTokens;

  readonly APTOS_TOKEN: TokenConfig = AptosTestnetUSDCToken;

  constructor(args: { dappConfig: CrossChainDappConfig }) {
    this._dappConfig = args.dappConfig;
    if (args.dappConfig?.aptosNetwork === Network.MAINNET) {
      this.CHAINS = mainnetChains;
      this.TOKENS = mainnetTokens;
      this.APTOS_TOKEN = AptosMainnetUSDCToken;
    } else {
      this.CHAINS = testnetChains;
      this.TOKENS = testnetTokens;
      this.APTOS_TOKEN = AptosTestnetUSDCToken;
    }
  }

  getProvider(providerType: CCTPProviders): CrossChainProvider {
    switch (providerType) {
      case "Wormhole":
        return new WormholeProvider(this) as CrossChainProvider<
          WormholeQuoteRequest,
          WormholeQuoteResponse,
          WormholeInitiateTransferRequest,
          WormholeInitiateTransferResponse
        >;
      default:
        throw new Error(`Unknown provider: ${providerType}`);
    }
  }
}
