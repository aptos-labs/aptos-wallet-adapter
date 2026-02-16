# Server-Side Solana Claim Implementation

When withdrawing USDC from Aptos to Solana via CCTP, the claim transaction needs to be signed on Solana. By default, this requires the user's wallet to sign a second transaction after waiting for attestation (~60 seconds). 

For a smoother user experience, you can implement a **server-side claim** where your backend signs the claim transaction instead of the user's wallet. This eliminates the second wallet popup and provides a seamless one-click withdrawal flow.

## Overview

The `@aptos-labs/cross-chain-core` SDK's `withdraw()` method will automatically POST the attestation receipt to a server endpoint if you configure `serverClaimUrl` in your `CrossChainDappConfig`. Your server then:

1. Parses and validates the request body
2. Initializes the Wormhole SDK and creates the CCTP route
3. Creates a `SolanaLocalSigner` with the appropriate RPC endpoint
4. Deserializes the receipt using `deserializeReceipt()` and completes the claim

The SDK provides both `SolanaLocalSigner` and `deserializeReceipt` utilities to simplify server-side implementation.

## SolanaLocalSigner

The SDK provides a `SolanaLocalSigner` class that you can import and use in your server-side code:

```typescript
import { SolanaLocalSigner } from "@aptos-labs/cross-chain-core";
import { Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";

const keypair = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_CLAIM_SIGNER_KEY));
const connection = new Connection("https://api.mainnet-beta.solana.com");

const signer = new SolanaLocalSigner({ keypair, connection });
await cctpRoute.complete(signer, receipt);
```

### Configuration Options

```typescript
interface SolanaLocalSignerConfig {
  /** The Solana keypair to sign transactions with */
  keypair: Keypair;
  /** The Solana RPC connection */
  connection: Connection;
  /** Transaction confirmation commitment level (default: "finalized") */
  commitment?: Commitment;
  /** Retry interval in ms when transaction is not confirmed (default: 5000) */
  retryIntervalMs?: number;
}
```

## Receipt Serialization

The SDK also provides `serializeReceipt` and `deserializeReceipt` utilities for handling Wormhole receipts over HTTP. JSON doesn't natively support `BigInt`, `Uint8Array`, or class instances like `UniversalAddress`, so these utilities handle the conversion:

```typescript
import { serializeReceipt, deserializeReceipt } from "@aptos-labs/cross-chain-core";

// Client-side: serialize before sending to server
const serialized = serializeReceipt(receipt);
await fetch("/api/claim", {
  method: "POST",
  body: JSON.stringify({ receipt: serialized }),
});

// Server-side: deserialize after receiving from client
const receipt = deserializeReceipt(body.receipt);
await cctpRoute.complete(signer, receipt);
```

## API Contract

### Request
**POST** to your configured `serverClaimUrl`

```typescript
{
  receipt: routes.Receipt,        // Wormhole receipt (contains BigInt/Uint8Array)
  destinationAddress: string,     // Solana address to receive USDC
  sourceChain: string             // "Solana"
}
```

### Response
```typescript
{
  destinationChainTxnId: string  // Solana transaction signature
}
```

## Reference Implementation

### 1. Configure the SDK (Client-Side)

```typescript
// config/index.ts
import { CrossChainCore, Network } from "@aptos-labs/cross-chain-core";

export const crossChainCore = new CrossChainCore({
  dappConfig: {
    aptosNetwork: Network.TESTNET,
    solanaConfig: {
      // Point to your API route
      serverClaimUrl: "/api/claim-withdraw",
    },
  },
});
```

### 2. Implement the API Route (Server-Side)

Here's a complete Next.js API route implementation:

```typescript
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

// app/api/claim-withdraw/route.ts
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
```

### 3. Set Environment Variable

```bash
# .env.local (server-only, never exposed to browser)
# Generate with: solana-keygen new --outfile keypair.json
# Then export to base58: base58 keypair.json
SOLANA_CLAIM_SIGNER_KEY=<base58-encoded-private-key>
```

**Example:**
```bash
SOLANA_CLAIM_SIGNER_KEY=5J3mBbAH58CpQ3Y2S4VNFGyvW2...
```

## Security Considerations

1. **Never expose the private key to the client** - Use server-only environment variables
2. **Fund the keypair** - It needs SOL for transaction fees (rent is reclaimed)
3. **Rotate keys regularly** - Follow security best practices
4. **Use rate limiting** - Protect your API endpoint from abuse
5. **Validate inputs** - Ensure the receipt is valid before processing

## How It Works

1. User clicks "Withdraw" in your dApp
2. SDK calls `provider.withdraw()` which:
   - **Phase 1**: User signs Aptos burn transaction (via wallet)
   - **Phase 2**: SDK polls Wormhole for attestation (~60 seconds)
   - **Phase 3**: SDK POSTs to `/api/claim-withdraw` (no wallet popup)
3. Your API route receives the receipt and:
   - Deserializes it
   - Sets up Wormhole SDK
   - Signs with `SolanaLocalSigner`
   - Submits to Solana
4. Returns transaction ID to SDK
5. User sees success message

## Benefits

✅ **Better UX** - No second wallet popup after attestation wait  
✅ **Seamless flow** - User only signs once (the Aptos burn transaction)  
✅ **Reliable** - Server can retry failed transactions  
✅ **Flexible** - Easy to add priority fees, logging, monitoring

## Alternative: Wallet-Based Claim

If you don't configure `serverClaimUrl`, the SDK will fall back to wallet-based claiming where the user signs the Solana claim transaction via their wallet. This works but requires the user to confirm a second transaction after waiting ~60 seconds for attestation.
