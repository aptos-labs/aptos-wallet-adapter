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

const keypair = Keypair.fromSecretKey(
  bs58.decode(process.env.SOLANA_CLAIM_SIGNER_KEY),
);
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
  /** Priority fee configuration for faster transaction landing */
  priorityFeeConfig?: {
    percentile?: number; // Percentile of recent fees (default: 0.9)
    percentileMultiple?: number; // Multiplier for the fee (default: 1)
    min?: number; // Minimum fee in microlamports (default: 100_000)
    max?: number; // Maximum fee in microlamports (default: 100_000_000)
  };
  /** Enable verbose logging (default: false) */
  verbose?: boolean;
}
```

## Receipt Serialization

The SDK also provides `serializeReceipt` and `deserializeReceipt` utilities for handling Wormhole receipts over HTTP. JSON doesn't natively support `BigInt`, `Uint8Array`, or class instances like `UniversalAddress`, so these utilities handle the conversion:

```typescript
import {
  serializeReceipt,
  deserializeReceipt,
} from "@aptos-labs/cross-chain-core";

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
  sourceChain: string             // The chain that initiated the withdraw (e.g. "Solana")
}
```

> **Note on `sourceChain`**: In the withdraw flow, `sourceChain` refers to the chain
> that initiated the original cross-chain transfer request (the non-Aptos chain).
> For a withdrawal from Aptos to Solana, `sourceChain` is `"Solana"` because the
> user started the flow from the Solana context. Don't confuse this with the chain
> that burns the USDC (which is Aptos).

### Response

```typescript
{
  destinationChainTxnId: string; // Solana transaction signature
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

📖 **See [`apps/nextjs-x-chain/src/app/api/claim-withdraw/route.ts`](../../apps/nextjs-x-chain/src/app/api/claim-withdraw/route.ts) for a complete working Next.js API route implementation.**

The reference implementation includes:

- Origin/referrer validation to prevent cross-origin abuse
- Lazy-cached Wormhole SDK initialization (avoids re-creating on every request)
- Server-only environment variables for RPC URLs and signer keys
- Receipt deserialization and CCTP claim completion via `SolanaLocalSigner`

Key imports for your own implementation:

```typescript
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

1. **Never expose the private key to the client** - Use server-only environment variables (no `NEXT_PUBLIC_` prefix)
2. **Validate request origin** - Check Origin/Referer headers to prevent cross-origin abuse (see reference implementation)
3. **Use server-only RPC URLs** - Don't use `NEXT_PUBLIC_` prefixed env vars for RPC URLs containing API keys in server routes
4. **Fund the keypair** - It needs SOL for transaction fees (rent is reclaimed)
5. **Rotate keys regularly** - Follow security best practices
6. **Use rate limiting** - Protect your API endpoint from abuse (consider per-IP or per-address limits). Note: the reference implementation uses an in-memory rate limiter which resets on each serverless cold start. For production, consider using a persistent store (e.g., Redis, Upstash) for rate limiting.
7. **Validate inputs** - Ensure the receipt is valid before processing

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
