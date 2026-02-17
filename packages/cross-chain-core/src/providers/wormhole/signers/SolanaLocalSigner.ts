import {
  Connection,
  Keypair,
  Transaction,
  type Commitment,
} from "@solana/web3.js";
import {
  Chain,
  Network,
  SignAndSendSigner,
  TxHash,
  UnsignedTransaction,
} from "@wormhole-foundation/sdk";
import {
  addPriorityFeeInstructions,
  PriorityFeeConfig,
  sendAndConfirmTransaction,
} from "./solanaUtils";

export interface SolanaLocalSignerConfig {
  /** The Solana keypair to sign transactions with */
  keypair: Keypair;
  /** The Solana RPC connection */
  connection: Connection;
  /** Transaction confirmation commitment level (default: "finalized") */
  commitment?: Commitment;
  /** Retry interval in ms when transaction is not confirmed (default: 5000) */
  retryIntervalMs?: number;
  /** Priority fee configuration for faster transaction landing */
  priorityFeeConfig?: PriorityFeeConfig;
  /** Enable verbose logging (default: false) */
  verbose?: boolean;
}

/**
 * Server-side Solana signer for programmatic transaction signing.
 * Use this when you want to sign Solana transactions without user wallet interaction,
 * such as for server-side claim operations.
 *
 * @example
 * ```typescript
 * import { SolanaLocalSigner } from "@aptos-labs/cross-chain-core";
 * import { Connection, Keypair } from "@solana/web3.js";
 * import bs58 from "bs58";
 *
 * const keypair = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_CLAIM_SIGNER_KEY));
 * const connection = new Connection("https://api.mainnet-beta.solana.com");
 *
 * const signer = new SolanaLocalSigner({
 *   keypair,
 *   connection,
 *   // Optional: configure priority fees for faster landing
 *   priorityFeeConfig: {
 *     percentile: 0.9,
 *     min: 100_000,
 *     max: 1_000_000,
 *   },
 * });
 * await cctpRoute.complete(signer, receipt);
 * ```
 */
export class SolanaLocalSigner<N extends Network, C extends Chain>
  implements SignAndSendSigner<N, C>
{
  private keypair: Keypair;
  private connection: Connection;
  private commitment: Commitment;
  private retryIntervalMs: number;
  private priorityFeeConfig?: PriorityFeeConfig;
  private verbose: boolean;
  private _claimedTransactionHashes: string[] = [];

  constructor(config: SolanaLocalSignerConfig) {
    this.keypair = config.keypair;
    this.connection = config.connection;
    this.commitment = config.commitment ?? "finalized";
    this.retryIntervalMs = config.retryIntervalMs ?? 5000;
    this.priorityFeeConfig = config.priorityFeeConfig;
    this.verbose = config.verbose ?? false;
  }

  chain(): C {
    return "Solana" as C;
  }

  address(): string {
    return this.keypair.publicKey.toBase58();
  }

  /**
   * Returns all transaction hashes from the most recent signAndSend call,
   * joined by comma. If only one transaction was signed, returns a single hash string.
   */
  claimedTransactionHashes(): string {
    return this._claimedTransactionHashes.join(",");
  }

  async signAndSend(txs: UnsignedTransaction<N, C>[]): Promise<TxHash[]> {
    const txHashes: TxHash[] = [];
    this._claimedTransactionHashes = [];

    for (const tx of txs) {
      const txId = await this.signAndSendTransaction(tx);
      txHashes.push(txId);
      this._claimedTransactionHashes.push(txId);
    }
    return txHashes;
  }

  private async signAndSendTransaction(request: any): Promise<string> {
    const { blockhash, lastValidBlockHeight } =
      await this.connection.getLatestBlockhash(this.commitment);

    // Wormhole SDK wraps transactions in SolanaUnsignedTransaction
    // The actual transaction is in the .transaction property
    // Sometimes it's nested: request.transaction.transaction
    let unsignedTx = request.transaction ?? request;

    // Capture additional signers before unwrapping.
    // SolanaUnsignedTransaction nests them at request.transaction.signers
    // (see SolanaSigner.ts for the client-side equivalent).
    const additionalSigners = request.transaction?.signers;

    // Unwrap nested transaction wrappers (Wormhole SDK's SolanaUnsignedTransaction)
    const MAX_UNWRAP_DEPTH = 10;
    let unwrapDepth = 0;
    while (
      unsignedTx &&
      typeof unsignedTx === "object" &&
      "transaction" in unsignedTx &&
      !(unsignedTx instanceof Transaction) &&
      !("signatures" in unsignedTx && "message" in unsignedTx)
    ) {
      if (++unwrapDepth > MAX_UNWRAP_DEPTH) {
        throw new Error(
          "Transaction unwrapping exceeded maximum depth — possible circular nesting",
        );
      }
      unsignedTx = unsignedTx.transaction;
    }

    // Check if this is a versioned transaction using duck typing
    // (VersionedTransaction has .message and .signatures properties)
    const isVersioned =
      unsignedTx.message !== undefined &&
      unsignedTx.signatures !== undefined &&
      typeof unsignedTx.message.recentBlockhash !== "undefined";

    if (isVersioned) {
      // For versioned transactions, we need to update the blockhash and sign
      unsignedTx.message.recentBlockhash = blockhash;

      // Note: Priority fees for versioned transactions would require rebuilding
      // the message, which is more complex. For now, we skip priority fees for versioned txs.
      if (this.verbose || this.priorityFeeConfig) {
        console.warn(
          "SolanaLocalSigner: Versioned transaction detected — priority fees are not applied. " +
          "Consider using legacy transactions if priority fees are required.",
        );
      }
      unsignedTx.sign([this.keypair]);

      // Also sign with any additional signers from Wormhole SDK
      if (additionalSigners && additionalSigners.length > 0) {
        unsignedTx.sign(additionalSigners);
      }
    } else if (unsignedTx instanceof Transaction) {
      // Legacy transaction handling
      unsignedTx.recentBlockhash = blockhash;
      unsignedTx.lastValidBlockHeight = lastValidBlockHeight;

      // Add priority fee instructions if configured
      if (this.priorityFeeConfig) {
        await addPriorityFeeInstructions(
          this.connection,
          unsignedTx,
          this.priorityFeeConfig,
          this.verbose,
        );
      }

      // Sign with the local keypair (and any additional signers in a single call).
      // Transaction.sign() resets the signatures array to only the provided
      // signers, so calling partialSign() afterwards for extra signers would
      // throw "unknown signer". Passing everyone to sign() at once avoids this.
      if (additionalSigners && additionalSigners.length > 0) {
        unsignedTx.sign(this.keypair, ...additionalSigners);
      } else {
        unsignedTx.sign(this.keypair);
      }
    } else if (
      unsignedTx.recentBlockhash !== undefined ||
      unsignedTx.feePayer !== undefined
    ) {
      // Looks like a legacy transaction but instanceof check failed
      // This can happen with different module instances
      unsignedTx.recentBlockhash = blockhash;
      unsignedTx.lastValidBlockHeight = lastValidBlockHeight;

      // Add priority fee instructions if configured
      if (this.priorityFeeConfig) {
        await addPriorityFeeInstructions(
          this.connection,
          unsignedTx,
          this.priorityFeeConfig,
          this.verbose,
        );
      }

      // Same rationale as the instanceof Transaction branch above:
      // include all signers in a single sign() call to avoid "unknown signer".
      if (additionalSigners && additionalSigners.length > 0) {
        unsignedTx.sign(this.keypair, ...additionalSigners);
      } else {
        unsignedTx.sign(this.keypair);
      }
    } else {
      throw new Error(
        `Unsupported transaction type: ${unsignedTx?.constructor?.name}`,
      );
    }

    const serializedTx = unsignedTx.serialize();

    // Use shared utility for sending and confirming
    const signature = await sendAndConfirmTransaction(
      serializedTx,
      blockhash,
      lastValidBlockHeight,
      {
        connection: this.connection,
        commitment: this.commitment,
        retryIntervalMs: this.retryIntervalMs,
        verbose: this.verbose,
      },
    );

    return signature;
  }
}

// Re-export PriorityFeeConfig for convenience
export type { PriorityFeeConfig };
