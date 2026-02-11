import { NextRequest, NextResponse } from "next/server";
import {
  Connection,
  Keypair,
  Transaction,
  type Commitment,
} from "@solana/web3.js";
import bs58 from "bs58";
import { Network } from "@aptos-labs/ts-sdk";
import {
  wormhole,
  routes,
  Wormhole,
  chainToPlatform,
  AttestationReceipt,
  UniversalAddress,
} from "@wormhole-foundation/sdk";
import aptos from "@wormhole-foundation/sdk/aptos";
import solana from "@wormhole-foundation/sdk/solana";

// Server-only env var — never sent to the browser
const SOLANA_CLAIM_SIGNER_KEY =
  process.env.SWAP_CCTP_SOLANA_CLAIM_SIGNER_PRIVATE_KEY;

const DAPP_NETWORK: Network.MAINNET | Network.TESTNET =
  (process.env.NEXT_PUBLIC_DAPP_NETWORK as string) === "mainnet"
    ? Network.MAINNET
    : Network.TESTNET;

function getSolanaKeypair(): Keypair {
  if (!SOLANA_CLAIM_SIGNER_KEY) {
    throw new Error(
      "SWAP_CCTP_SOLANA_CLAIM_SIGNER_PRIVATE_KEY env var is not set",
    );
  }
  
  try {
    return Keypair.fromSecretKey(bs58.decode(SOLANA_CLAIM_SIGNER_KEY));
  } catch (error) {
    throw new Error(
      "Invalid SWAP_CCTP_SOLANA_CLAIM_SIGNER_PRIVATE_KEY format. Expected base58-encoded private key.",
    );
  }
}

function deserializeReceipt(obj: any): routes.Receipt<AttestationReceipt> {
  // Recursively reconstruct BigInt, Uint8Array, and UniversalAddress from serialized format
  function revive(value: any, key?: string): any {
    if (value && typeof value === "object") {
      if ("__type" in value) {
        if (value.__type === "bigint") {
          return BigInt(value.value);
        }
        if (value.__type === "Uint8Array") {
          return new Uint8Array(Buffer.from(value.value, "base64"));
        }
      }
      
      // Check if this is a serialized UniversalAddress-like object { address: Uint8Array }
      // These are the address fields in the CCTP message that need to be UniversalAddress instances
      const addressFields = ['sender', 'recipient', 'destinationCaller', 'burnToken', 'mintRecipient', 'messageSender'];
      if (key && addressFields.includes(key) && 'address' in value) {
        // First revive the inner address to get the Uint8Array
        const addressBytes = revive(value.address);
        if (addressBytes instanceof Uint8Array) {
          // Reconstruct as UniversalAddress
          return new UniversalAddress(addressBytes);
        }
      }
      
      // Recursively process objects and arrays
      if (Array.isArray(value)) {
        return value.map((v, i) => revive(v, String(i)));
      }
      const result: any = {};
      for (const k in value) {
        result[k] = revive(value[k], k);
      }
      return result;
    }
    return value;
  }
  
  return revive(obj);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      receipt: serializedReceipt,
      destinationAddress,
      sourceChain,
    } = body;

    if (!serializedReceipt || !destinationAddress || !sourceChain) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: receipt, destinationAddress, sourceChain",
        },
        { status: 400 },
      );
    }

    if (sourceChain !== "Solana") {
      return NextResponse.json(
        { error: "Server-side claim is currently only supported for Solana" },
        { status: 400 },
      );
    }

    console.log("[claim-withdraw] Processing claim for", destinationAddress);
    
    const receipt = deserializeReceipt(serializedReceipt);
    const keypair = getSolanaKeypair();

    // Initialize Wormhole SDK (only need Aptos and Solana for this claim)
    const isMainnet = DAPP_NETWORK === Network.MAINNET;
    const wh = await wormhole(
      isMainnet ? "Mainnet" : "Testnet",
      [aptos, solana],
    );

    // Set up the CCTP route (same as SDK does)
    const sourceToken = Wormhole.tokenId(
      "Aptos",
      isMainnet
        ? "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b"
        : "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832",
    );
    const destToken = Wormhole.tokenId(
      "Solana",
      isMainnet
        ? "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
        : "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
    );

    const destContext = wh
      .getPlatform(chainToPlatform("Solana"))
      .getChain("Solana");
    const sourceContext = wh
      .getPlatform(chainToPlatform("Aptos"))
      .getChain("Aptos");

    const wormholeRequest = await routes.RouteTransferRequest.create(
      wh,
      { source: sourceToken, destination: destToken },
      sourceContext,
      destContext,
    );

    const resolver = wh.resolver([routes.CCTPRoute]);
    const route = await resolver.findRoutes(wormholeRequest);
    const cctpRoute = route[0];

    if (!routes.isManual(cctpRoute)) {
      throw new Error("Expected manual CCTP route");
    }

    // Create a local signer with correct RPC for the network
    const solanaRpcUrl = isMainnet
      ? process.env.NEXT_PUBLIC_SOLANA_RPC_MAINNET ??
        "https://api.mainnet-beta.solana.com"
      : process.env.NEXT_PUBLIC_SOLANA_RPC_DEVNET ??
        "https://api.devnet.solana.com";

    const connection = new Connection(solanaRpcUrl);
    const localSigner = new SolanaLocalSigner(keypair, connection);

    // Complete the claim - the USDC will be minted to the address encoded in the receipt
    await cctpRoute.complete(localSigner, receipt);
    const destinationChainTxnId = localSigner.claimedTransactionHashes();

    console.log("[claim-withdraw] Success:", destinationChainTxnId);
    return NextResponse.json({ destinationChainTxnId });
  } catch (error: any) {
    console.error("Error in claim-withdraw API:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
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
    const commitment: Commitment = "finalized";
    const { blockhash, lastValidBlockHeight } =
      await this.connection.getLatestBlockhash(commitment);

    // Wormhole SDK wraps transactions in SolanaUnsignedTransaction
    // The actual transaction is in the .transaction property
    // Sometimes it's nested: request.transaction.transaction
    let unsignedTx = request.transaction ?? request;
    
    // Unwrap nested transaction wrappers (Wormhole SDK's SolanaUnsignedTransaction)
    while (unsignedTx && typeof unsignedTx === 'object' && 
           'transaction' in unsignedTx && 
           !(unsignedTx instanceof Transaction) &&
           !('signatures' in unsignedTx && 'message' in unsignedTx)) {
      unsignedTx = unsignedTx.transaction;
    }
    
    // Check if this is a versioned transaction using duck typing
    // (VersionedTransaction has .message and .signatures properties)
    const isVersioned = unsignedTx.message !== undefined && 
                        unsignedTx.signatures !== undefined &&
                        typeof unsignedTx.message.recentBlockhash !== 'undefined';
    
    if (isVersioned) {
      // For versioned transactions, we need to update the blockhash and sign
      unsignedTx.message.recentBlockhash = blockhash;
      unsignedTx.sign([this.keypair]);
      
      // Also sign with any additional signers from Wormhole SDK
      if (request.signers && request.signers.length > 0) {
        unsignedTx.sign(request.signers);
      }
    } else if (unsignedTx instanceof Transaction) {
      // Legacy transaction handling
      unsignedTx.recentBlockhash = blockhash;
      unsignedTx.lastValidBlockHeight = lastValidBlockHeight;
      
      // Sign with the local keypair
      unsignedTx.sign(this.keypair);

      // Also sign with any additional signers from Wormhole SDK
      if (request.signers) {
        unsignedTx.partialSign(...request.signers);
      }
    } else if (unsignedTx.recentBlockhash !== undefined || unsignedTx.feePayer !== undefined) {
      // Looks like a legacy transaction but instanceof check failed
      // This can happen with different module instances
      unsignedTx.recentBlockhash = blockhash;
      unsignedTx.lastValidBlockHeight = lastValidBlockHeight;
      unsignedTx.sign(this.keypair);
      
      if (request.signers) {
        unsignedTx.partialSign(...request.signers);
      }
    } else {
      throw new Error(`Unsupported transaction type: ${unsignedTx?.constructor?.name}`);
    }

    const serializedTx = unsignedTx.serialize();
    const sendOptions = {
      skipPreflight: true,
      maxRetries: 0,
      preflightCommitment: commitment,
    };

    let signature = await this.connection.sendRawTransaction(
      serializedTx,
      sendOptions,
    );

    let confirmTransactionPromise = this.connection.confirmTransaction(
      { signature, blockhash, lastValidBlockHeight },
      commitment,
    );

    // Retry loop: resend if not confirmed after interval
    const txRetryInterval = 5000;
    let confirmedTx = null;
    let txSendAttempts = 1;

    while (!confirmedTx) {
      confirmedTx = await Promise.race([
        confirmTransactionPromise,
        new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), txRetryInterval),
        ),
      ]);

      if (confirmedTx) break;

      txSendAttempts++;
      try {
        await this.connection.sendRawTransaction(serializedTx, sendOptions);
      } catch {
        // Ignore resend errors, confirmation will handle success/failure
      }
    }

    if (confirmedTx.value.err) {
      throw new Error(
        `Transaction failed: ${JSON.stringify(confirmedTx.value.err)}`,
      );
    }

    return signature;
  }
}
