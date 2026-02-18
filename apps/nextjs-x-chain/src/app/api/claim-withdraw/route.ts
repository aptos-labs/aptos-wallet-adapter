/**
 * Server-side API route for claiming CCTP withdrawals on Solana.
 *
 * This endpoint receives an attested Wormhole receipt from the client SDK
 * and completes the claim transaction on Solana using a server-managed keypair.
 * This eliminates the need for users to sign a second transaction after attestation.
 *
 * Steps:
 * 1. Validate origin/referrer header to prevent cross-origin abuse
 * 2. Rate-limit by client IP
 * 3. Parse and validate request body (receipt, destinationAddress, sourceChain)
 * 4. Initialize Wormhole SDK and create CCTP route (cached for performance)
 * 5. Create the local signer with appropriate RPC endpoint
 * 6. Deserialize the receipt and complete the claim (USDC minted to address in receipt)
 */

import { NextRequest, NextResponse } from "next/server";
import { Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { Network } from "@aptos-labs/ts-sdk";
import {
  SolanaLocalSigner,
  mainnetTokens,
  testnetTokens,
  createCCTPRoute,
  deserializeReceipt,
  CCTPRouteResult,
} from "@aptos-labs/cross-chain-core";
import { wormhole, Wormhole } from "@wormhole-foundation/sdk";
import aptos from "@wormhole-foundation/sdk/aptos";
import solana from "@wormhole-foundation/sdk/solana";

/** Server-only env var for the Solana claim signer private key (base58 encoded) */
const SOLANA_CLAIM_SIGNER_KEY = process.env.SOLANA_CLAIM_SIGNER_KEY;

/** Server-only Solana RPC URL (don't expose API keys to client — no NEXT_PUBLIC_ prefix) */
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL;

/** Determines network (mainnet/testnet) from environment — consistent with config/index.ts */
const DAPP_NETWORK: Network.MAINNET | Network.TESTNET =
  (process.env.NEXT_PUBLIC_DAPP_NETWORK as Network.MAINNET | Network.TESTNET) || Network.TESTNET;

const IS_MAINNET = DAPP_NETWORK === Network.MAINNET;

// ============================================================================
// Solana RPC helper (single source of truth)
// ============================================================================

function getSolanaRpcUrl(): string {
  return SOLANA_RPC_URL ?? (IS_MAINNET
    ? "https://api.mainnet-beta.solana.com"
    : "https://api.devnet.solana.com");
}

// ============================================================================
// Simple in-memory rate limiter
// NOTE: This resets on each serverless cold start. For production, consider
// using a persistent store (e.g., Redis, Upstash) for rate limiting.
// ============================================================================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute

function isRateLimited(identifier: string): boolean {
  const now = Date.now();

  // Clean up expired entries to prevent memory leaks
  rateLimitMap.forEach((entry, key) => {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  });

  const entry = rateLimitMap.get(identifier);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

// ============================================================================
// Lazy-initialized singletons to avoid re-creating on every request
// ============================================================================

let cachedWormholeContext: Wormhole<"Mainnet" | "Testnet"> | null = null;
let cachedCCTPRoute: CCTPRouteResult | null = null;

async function getOrCreateCCTPRoute(): Promise<CCTPRouteResult> {
  if (cachedCCTPRoute && cachedWormholeContext) {
    return cachedCCTPRoute;
  }

  const wh = await wormhole(IS_MAINNET ? "Mainnet" : "Testnet", [aptos, solana], {
    chains: {
      Solana: {
        rpc: getSolanaRpcUrl(),
      },
    },
  });
  cachedWormholeContext = wh;

  const tokens = IS_MAINNET ? mainnetTokens : testnetTokens;
  cachedCCTPRoute = await createCCTPRoute(wh, "Aptos", "Solana", tokens);

  return cachedCCTPRoute;
}

/**
 * Loads the Solana keypair from environment variable.
 * @throws Error if env var is missing or invalid
 */
function getSolanaKeypair(): Keypair {
  if (!SOLANA_CLAIM_SIGNER_KEY) {
    throw new Error("SOLANA_CLAIM_SIGNER_KEY env var is not set");
  }

  try {
    return Keypair.fromSecretKey(bs58.decode(SOLANA_CLAIM_SIGNER_KEY));
  } catch (error) {
    throw new Error(
      "Invalid SOLANA_CLAIM_SIGNER_KEY format. Expected base58-encoded private key.",
    );
  }
}

/**
 * Validates that the request originates from the same site.
 * Checks the Origin and Referer headers to prevent cross-origin abuse.
 */
function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // In server-side rendering or same-origin fetch, Origin or Referer should be present
  const requestUrl = new URL(request.url);
  const expectedHost = requestUrl.host;

  if (origin) {
    try {
      const originUrl = new URL(origin);
      return originUrl.host === expectedHost;
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      return refererUrl.host === expectedHost;
    } catch {
      return false;
    }
  }

  // If neither Origin nor Referer is present, reject the request
  return false;
}

/**
 * Handles POST requests to claim CCTP withdrawals on Solana.
 *
 * Expected body: { receipt, destinationAddress, sourceChain }
 * Returns: { destinationChainTxnId }
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Validate origin to prevent cross-origin abuse
    if (!validateOrigin(request)) {
      return NextResponse.json(
        { error: "Forbidden: invalid origin" },
        { status: 403 },
      );
    }

    // Step 2: Rate limit by client IP
    const forwarded = request.headers.get("x-forwarded-for");
    const clientIp = forwarded?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    // Step 3: Parse and validate request body
    const body = await request.json();
    const { receipt: serializedReceipt, destinationAddress, sourceChain } = body;

    if (!serializedReceipt || !destinationAddress || !sourceChain) {
      return NextResponse.json(
        { error: "Missing required fields: receipt, destinationAddress, sourceChain" },
        { status: 400 },
      );
    }

    if (sourceChain !== "Solana") {
      return NextResponse.json(
        { error: "Server-side claim is currently only supported for Solana" },
        { status: 400 },
      );
    }

    console.log(`Processing claim for destination: ${destinationAddress}`);

    // Step 4: Get or create the cached CCTP route
    const { route: cctpRoute } = await getOrCreateCCTPRoute();

    // Step 5: Create the local signer with appropriate RPC endpoint
    const connection = new Connection(getSolanaRpcUrl());
    const keypair = getSolanaKeypair();
    const localSigner = new SolanaLocalSigner({ keypair, connection });

    // Step 6: Deserialize receipt and complete the claim — USDC is minted to the address in the receipt
    const receipt = deserializeReceipt(serializedReceipt);
    await cctpRoute.complete(localSigner, receipt);
    const destinationChainTxnId = localSigner.claimedTransactionHashes();

    return NextResponse.json({ destinationChainTxnId });
  } catch (error: any) {
    console.error("Error in claim-withdraw API:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
