# Server-Side Solana Claim Implementation

When withdrawing USDC from Aptos to Solana via CCTP, the claim transaction needs to be signed on Solana. By default, this requires the user's wallet to sign a second transaction after waiting for attestation (~60 seconds). 

For a smoother user experience, you can implement a **server-side claim** where your backend signs the claim transaction instead of the user's wallet. This eliminates the second wallet popup and provides a seamless one-click withdrawal flow.

## Overview

The `@aptos-labs/cross-chain-core` SDK's `withdraw()` method will automatically POST the attestation receipt to a server endpoint if you configure `serverClaimUrl` in your `CrossChainDappConfig`. Your server then:

1. Deserializes the receipt
2. Sets up the Wormhole SDK
3. Signs and submits the claim transaction using a funded Solana keypair
4. Returns the transaction ID

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
// app/api/claim-withdraw/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  Connection,
  Keypair,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import {
  wormhole,
  routes,
  Wormhole,
  chainToPlatform,
  AttestationReceipt,
} from "@wormhole-foundation/sdk";
import aptos from "@wormhole-foundation/sdk/aptos";
import solana from "@wormhole-foundation/sdk/solana";

// Server-only environment variable
const SOLANA_CLAIM_SIGNER_KEY = process.env.SOLANA_CLAIM_SIGNER_KEY;

function getSolanaKeypair(): Keypair {
  if (!SOLANA_CLAIM_SIGNER_KEY) {
    throw new Error("SOLANA_CLAIM_SIGNER_KEY env var is not set");
  }
  
  try {
    return Keypair.fromSecretKey(bs58.decode(SOLANA_CLAIM_SIGNER_KEY));
  } catch (error) {
    throw new Error(
      "Invalid SOLANA_CLAIM_SIGNER_KEY format. Expected base58-encoded private key."
    );
  }
}

function deserializeReceipt(json: any): routes.Receipt<AttestationReceipt> {
  // Reconstruct BigInt and Uint8Array from serialized format
  return JSON.parse(JSON.stringify(json), (_key, value) => {
    if (value && typeof value === "object" && "__type" in value) {
      if (value.__type === "bigint") {
        return BigInt(value.value);
      }
      if (value.__type === "Uint8Array") {
        return new Uint8Array(Buffer.from(value.value, "base64"));
      }
    }
    return value;
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { receipt: serializedReceipt, destinationAddress, sourceChain } = body;

    if (!serializedReceipt || !destinationAddress || !sourceChain) {
      return NextResponse.json(
        {
          error: "Missing required fields: receipt, destinationAddress, sourceChain",
        },
        { status: 400 }
      );
    }

    if (sourceChain !== "Solana") {
      return NextResponse.json(
        { error: "Server-side claim is currently only supported for Solana" },
        { status: 400 }
      );
    }

    const receipt = deserializeReceipt(serializedReceipt);
    const keypair = getSolanaKeypair();

    // Initialize Wormhole SDK (only need Aptos and Solana for this claim)
    const wh = await wormhole("Mainnet", [aptos, solana]);

    // Set up the CCTP route with USDC token addresses
    // Mainnet:
    //   Aptos:  0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b
    //   Solana: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
    // Testnet:
    //   Aptos:  0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832
    //   Solana: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
    const sourceToken = Wormhole.tokenId(
      "Aptos",
      "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b"
    );
    const destToken = Wormhole.tokenId(
      "Solana",
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    );

    const destContext = wh.getPlatform(chainToPlatform("Solana")).getChain("Solana");
    const sourceContext = wh.getPlatform(chainToPlatform("Aptos")).getChain("Aptos");

    const request = await routes.RouteTransferRequest.create(
      wh,
      { source: sourceToken, destination: destToken },
      sourceContext,
      destContext
    );

    const resolver = wh.resolver([routes.CCTPRoute]);
    const route = await resolver.findRoutes(request);
    const cctpRoute = route[0];

    if (!routes.isManual(cctpRoute)) {
      throw new Error("Expected manual CCTP route");
    }

    // Create a local signer
    const solanaRpcUrl = process.env.SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com";
    const connection = new Connection(solanaRpcUrl);

    const localSigner = new SolanaLocalSigner(keypair, connection);

    // Complete the claim
    await cctpRoute.complete(localSigner, receipt);
    const destinationChainTxnId = localSigner.claimedTransactionHashes();

    return NextResponse.json({ destinationChainTxnId });
  } catch (error: any) {
    console.error("Error in claim-withdraw API:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// Server-side Solana signer implementation
class SolanaLocalSigner {
  private keypair: Keypair;
  private connection: Connection;
  private _claimedTransactionHashes: string = "";

  constructor(keypair: Keypair, connection: Connection) {
    this.keypair = keypair;
    this.connection = connection;
  }

  chain(): "Solana" {
    return "Solana";
  }

  address(): string {
    return this.keypair.publicKey.toBase58();
  }

  claimedTransactionHashes(): string {
    return this._claimedTransactionHashes;
  }

  async signAndSend(txs: any[]): Promise<string[]> {
    const txHashes: string[] = [];

    for (const tx of txs) {
      const txId = await this.signAndSendTransaction(tx);
      txHashes.push(txId);
      this._claimedTransactionHashes = txId;
    }
    return txHashes;
  }

  private async signAndSendTransaction(request: any): Promise<string> {
    const commitment = "finalized";
    const { blockhash, lastValidBlockHeight } =
      await this.connection.getLatestBlockhash(commitment);

    const unsignedTx = request.transaction as Transaction;
    unsignedTx.recentBlockhash = blockhash;
    unsignedTx.lastValidBlockHeight = lastValidBlockHeight;

    // Sign with the local keypair
    unsignedTx.sign(this.keypair);

    // Also sign with any additional signers from Wormhole SDK
    if (request.transaction.signers) {
      unsignedTx.partialSign(...request.transaction.signers);
    }

    const serializedTx = unsignedTx.serialize();
    const sendOptions = {
      skipPreflight: true,
      maxRetries: 0,
      preflightCommitment: commitment,
    };

    let signature = await this.connection.sendRawTransaction(
      serializedTx,
      sendOptions
    );

    let confirmTransactionPromise = this.connection.confirmTransaction(
      { signature, blockhash, lastValidBlockHeight },
      commitment
    );

    // Retry loop: resend if not confirmed after interval
    const txRetryInterval = 5000;
    let confirmedTx = null;
    let txSendAttempts = 1;

    while (!confirmedTx) {
      confirmedTx = await Promise.race([
        confirmTransactionPromise,
        new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), txRetryInterval)
        ),
      ]);
      
      if (confirmedTx) break;
      
      console.log(
        `Tx not confirmed after ${txRetryInterval * txSendAttempts++}ms, resending`
      );
      
      try {
        await this.connection.sendRawTransaction(serializedTx, sendOptions);
      } catch (e) {
        console.error("Failed to resend transaction:", e);
      }
    }

    if (confirmedTx.value.err) {
      throw new Error(`Transaction failed: ${JSON.stringify(confirmedTx.value.err)}`);
    }

    return signature;
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
   - Signs with server keypair
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

