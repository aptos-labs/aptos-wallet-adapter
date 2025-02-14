import { Account, Network } from "@aptos-labs/ts-sdk";

import {
  WormholeInitiateTransferRequest,
  WormholeInitiateTransferResponse,
  WormholeProvider,
  WormholeQuoteRequest,
  WormholeQuoteResponse,
} from "./providers/wormhole";

export interface CrossChainDappConfig {
  network: Network;
  disableTelemetry?: boolean;
}

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

  constructor(args: { dappConfig: CrossChainDappConfig }) {
    this._dappConfig = args.dappConfig;
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
