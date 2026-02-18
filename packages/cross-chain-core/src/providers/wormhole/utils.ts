/**
 * Utility functions for Wormhole CCTP route creation.
 * These helpers can be used both by WormholeProvider and server-side claim endpoints.
 */

import {
  chainToPlatform,
  routes,
  Wormhole,
  TokenId,
} from "@wormhole-foundation/sdk";
import { Chain } from "../../CrossChainCore";
import { TokenConfig } from "../../config";

export interface CCTPRouteResult {
  route: routes.ManualRoute<"Mainnet" | "Testnet">;
  request: routes.RouteTransferRequest<"Mainnet" | "Testnet">;
}

/**
 * Creates a CCTP route for transferring USDC between two chains.
 *
 * This is a standalone helper that can be used both by WormholeProvider
 * (client-side) and server-side claim endpoints to avoid code duplication.
 *
 * @param wh - Initialized Wormhole context
 * @param sourceChain - Source chain (e.g., "Aptos")
 * @param destChain - Destination chain (e.g., "Solana")
 * @param tokens - Token configuration mapping (mainnetTokens or testnetTokens)
 * @returns The CCTP route and request for completing transfers
 * @throws Error if no valid CCTP route is found
 */
export async function createCCTPRoute(
  wh: Wormhole<"Mainnet" | "Testnet">,
  sourceChain: Chain,
  destChain: Chain,
  tokens: Record<string, TokenConfig>,
): Promise<CCTPRouteResult> {
  const sourceToken: TokenId = Wormhole.tokenId(
    sourceChain,
    tokens[sourceChain].tokenId.address,
  );
  const destToken: TokenId = Wormhole.tokenId(
    destChain,
    tokens[destChain].tokenId.address,
  );

  const destContext = wh
    .getPlatform(chainToPlatform(destChain))
    .getChain(destChain);
  const sourceContext = wh
    .getPlatform(chainToPlatform(sourceChain))
    .getChain(sourceChain);

  const request = await routes.RouteTransferRequest.create(
    wh,
    { source: sourceToken, destination: destToken },
    sourceContext,
    destContext,
  );

  const resolver = wh.resolver([routes.CCTPRoute]);
  const foundRoutes = await resolver.findRoutes(request);
  const cctpRoute = foundRoutes[0];

  if (!cctpRoute || !routes.isManual(cctpRoute)) {
    throw new Error("Expected manual CCTP route");
  }

  return { route: cctpRoute, request };
}

