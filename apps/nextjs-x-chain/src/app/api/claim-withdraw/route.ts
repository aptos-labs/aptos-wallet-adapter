/**
 * Server-side API route for claiming CCTP withdrawals on Solana.
 *
 * This endpoint receives an attested Wormhole receipt from the client SDK
 * and completes the claim transaction on Solana using a server-managed keypair.
 * This eliminates the need for users to sign a second transaction after attestation.
 *
 * Steps:
 * 1. Parse and validate request body (receipt, destinationAddress, sourceChain)
 * 2. Initialize Wormhole SDK and create CCTP route
 * 3. Create the local signer with appropriate RPC endpoint
 * 4. Deserialize the receipt and complete the claim (USDC minted to address in receipt)
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
} from "@aptos-labs/cross-chain-core";
import { wormhole } from "@wormhole-foundation/sdk";
import aptos from "@wormhole-foundation/sdk/aptos";
import solana from "@wormhole-foundation/sdk/solana";

/** Server-only env var for the Solana claim signer private key (base58 encoded) */
const SOLANA_CLAIM_SIGNER_KEY = process.env.SOLANA_CLAIM_SIGNER_KEY;

/** Determines network (mainnet/testnet) from environment */
const DAPP_NETWORK: Network.MAINNET | Network.TESTNET =
  (process.env.NEXT_PUBLIC_DAPP_NETWORK as string) === "mainnet"
    ? Network.MAINNET
    : Network.TESTNET;

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
 * Handles POST requests to claim CCTP withdrawals on Solana.
 * 
 * Expected body: { receipt, destinationAddress, sourceChain }
 * Returns: { destinationChainTxnId }
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Parse and validate request body
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

    // Step 2: Initialize Wormhole SDK and create CCTP route
    const isMainnet = DAPP_NETWORK === Network.MAINNET;
    const wh = await wormhole(isMainnet ? "Mainnet" : "Testnet", [aptos, solana]);
    const tokens = isMainnet ? mainnetTokens : testnetTokens;

    const { route: cctpRoute } = await createCCTPRoute(wh, "Aptos", "Solana", tokens);

    // Step 3: Create the local signer with appropriate RPC endpoint
    const solanaRpcUrl = isMainnet
      ? process.env.NEXT_PUBLIC_SOLANA_RPC_MAINNET ?? "https://api.mainnet-beta.solana.com"
      : process.env.NEXT_PUBLIC_SOLANA_RPC_DEVNET ?? "https://api.devnet.solana.com";

    const connection = new Connection(solanaRpcUrl);
    const keypair = getSolanaKeypair();
    const localSigner = new SolanaLocalSigner({ keypair, connection });

    // Step 4: Deserialize receipt and complete the claim — USDC is minted to the address in the receipt
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
