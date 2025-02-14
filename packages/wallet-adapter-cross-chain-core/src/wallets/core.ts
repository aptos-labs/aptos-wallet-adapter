import { Wallet } from "@xlabs-libs/wallet-aggregator-core";
import { AttestationReceipt, Chain, routes } from "@wormhole-foundation/sdk";

import { UsdcBalance, WormholeRouteResponse } from "../CrossChainCore";
import { WormholeQuote } from "../CrossChainCore";
import { WormholeRequest } from "../CrossChainCore";
import { InputTransactionData } from "./solana";

// An interface to extend the Wallet class from the aggregator package
export interface CrossChainWallet {
  CCTPTransfer(
    chain: Chain,
    route: WormholeRouteResponse,
    request: WormholeRequest,
    quote: WormholeQuote
  ): Promise<{
    originChainTxnId: string;
    receipt: routes.Receipt<AttestationReceipt>;
  }>;
  signAndSubmitTransaction(transaction: InputTransactionData): Promise<string>;
  getUsdcBalance(): Promise<UsdcBalance>;
}

// A type that extends the CrossChainWallet interface and the Wallet class from the aggregator package
// to be used by dapps to represent the wallet type
export type AptosCrossChainWallet = CrossChainWallet & Wallet;
