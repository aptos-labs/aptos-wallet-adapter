/**
 * Shared utilities for Solana transaction handling.
 * Used by both SolanaLocalSigner (server-side) and SolanaSigner (client-side).
 */

import {
  ComputeBudgetProgram,
  Connection,
  LAMPORTS_PER_SOL,
  RpcResponseAndContext,
  SignatureResult,
  SimulatedTransactionResponse,
  Transaction,
  TransactionInstruction,
  VersionedTransaction,
  type Commitment,
} from "@solana/web3.js";
import {
  determinePriorityFee,
  determinePriorityFeeTritonOne,
} from "@wormhole-foundation/sdk-solana";

// ============================================================================
// Types
// ============================================================================

/** Configuration for priority fees */
export interface PriorityFeeConfig {
  /** Percentile of recent fees to use (default: 0.9) */
  percentile?: number;
  /** Multiplier for the percentile fee (default: 1) */
  percentileMultiple?: number;
  /** Minimum fee in microlamports (default: 100_000) */
  min?: number;
  /** Maximum fee in microlamports (default: 100_000_000) */
  max?: number;
}

/** Configuration for sending and confirming transactions */
export interface SendAndConfirmConfig {
  connection: Connection;
  commitment: Commitment;
  retryIntervalMs?: number;
  /** Enable verbose logging (default: false) */
  verbose?: boolean;
}

/** RPC provider type for priority fee calculation */
export type SolanaRpcProvider = "triton" | "helius" | "ankr" | "unknown";

// ============================================================================
// Transaction Confirmation
// ============================================================================

/**
 * Sends a serialized transaction and waits for confirmation with automatic retries.
 *
 * @param serializedTx - The serialized transaction bytes
 * @param blockhash - The recent blockhash used in the transaction
 * @param lastValidBlockHeight - The last valid block height for the transaction
 * @param config - Configuration for sending and confirming
 * @returns The transaction signature
 */
export async function sendAndConfirmTransaction(
  serializedTx: Buffer | Uint8Array,
  blockhash: string,
  lastValidBlockHeight: number,
  config: SendAndConfirmConfig,
): Promise<string> {
  const { connection, commitment, retryIntervalMs = 5000, verbose = false } = config;

  const sendOptions = {
    skipPreflight: true,
    maxRetries: 0,
    preflightCommitment: commitment,
  };

  const signature = await connection.sendRawTransaction(serializedTx, sendOptions);

  const confirmTransactionPromise = connection.confirmTransaction(
    { signature, blockhash, lastValidBlockHeight },
    commitment,
  );

  // Retry loop: resend if not confirmed after interval.
  // The confirmation promise can reject with "block height exceeded" when the
  // blockhash expires before confirmation completes. Because the transaction was
  // already sent (sendRawTransaction succeeded), it may still land on-chain.
  // In that case we return the signature so the caller can track it, rather than
  // throwing and losing the transaction reference.
  let confirmedTx: RpcResponseAndContext<SignatureResult> | null = null;
  let txSendAttempts = 1;

  try {
    while (!confirmedTx) {
      confirmedTx = await Promise.race([
        confirmTransactionPromise,
        new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), retryIntervalMs),
        ),
      ]);

      if (confirmedTx) break;

      if (verbose) {
        console.log(
          `Tx not confirmed after ${retryIntervalMs * txSendAttempts++}ms, resending`,
        );
      }

      try {
        await connection.sendRawTransaction(serializedTx, sendOptions);
      } catch (e) {
        if (verbose) {
          console.error("Failed to resend transaction:", e);
        }
        // Ignore resend errors, confirmation will handle success/failure
      }
    }
  } catch (e) {
    const message = e instanceof Error ? e.message.toLowerCase() : "";
    if (
      message.includes("block height exceeded") ||
      message.includes("blockheightexceeded")
    ) {
      if (verbose) {
        console.warn(
          "Block height exceeded but tx was already sent, returning signature:",
          signature,
        );
      }
      // Transaction was already sent — return the signature so the caller can
      // track confirmation asynchronously instead of losing the tx reference.
      return signature;
    }
    throw e;
  }

  if (confirmedTx.value.err) {
    const errorMessage = formatTransactionError(confirmedTx.value.err);
    throw new Error(errorMessage);
  }

  return signature;
}

/**
 * Formats a transaction error into a readable string.
 */
export function formatTransactionError(err: unknown): string {
  if (typeof err === "object" && err !== null) {
    try {
      return `Transaction failed: ${JSON.stringify(
        err,
        (_key, value) => (typeof value === "bigint" ? value.toString() : value),
      )}`;
    } catch {
      // Circular reference or other stringify error
      return "Transaction failed: Unknown error";
    }
  }
  return `Transaction failed: ${err}`;
}

// ============================================================================
// Priority Fees
// ============================================================================

/**
 * Adds priority fee instructions to a transaction.
 * Simulates the transaction to determine compute units and calculates optimal fees.
 *
 * @param connection - Solana RPC connection
 * @param transaction - The transaction to add priority fees to
 * @param priorityFeeConfig - Configuration for priority fees
 * @param verbose - Enable verbose logging
 * @returns The transaction with priority fee instructions added
 */
export async function addPriorityFeeInstructions(
  connection: Connection,
  transaction: Transaction,
  priorityFeeConfig?: PriorityFeeConfig,
  verbose: boolean = false,
): Promise<Transaction> {
  const computeBudgetIxFilter = (ix: TransactionInstruction) =>
    ix.programId.toString() !== "ComputeBudget111111111111111111111111111111";

  // Remove existing compute budget instructions if they were added by the SDK
  transaction.instructions = transaction.instructions.filter(computeBudgetIxFilter);

  const instructions = await createPriorityFeeInstructions(
    connection,
    transaction,
    priorityFeeConfig,
    verbose,
  );

  transaction.add(...instructions);

  return transaction;
}

/**
 * Creates priority fee instructions based on simulation and fee estimation.
 */
export async function createPriorityFeeInstructions(
  connection: Connection,
  transaction: Transaction | VersionedTransaction,
  priorityFeeConfig?: PriorityFeeConfig,
  verbose: boolean = false,
): Promise<TransactionInstruction[]> {
  // Simulate to get compute units
  const unitsUsed = await simulateAndGetComputeUnits(connection, transaction);
  const unitBudget = Math.floor(unitsUsed * 1.2); // Budget in 20% headroom

  const instructions: TransactionInstruction[] = [];
  instructions.push(
    ComputeBudgetProgram.setComputeUnitLimit({
      units: unitBudget,
    }),
  );

  // Calculate priority fee
  const {
    percentile = 0.9,
    percentileMultiple = 1,
    min = 100_000,
    max = 100_000_000,
  } = priorityFeeConfig ?? {};

  const rpcProvider = determineRpcProvider(connection.rpcEndpoint);
  const { fee, methodUsed } = await calculatePriorityFee(
    connection,
    transaction,
    rpcProvider,
    { percentile, percentileMultiple, min, max },
  );

  if (verbose) {
    const maxFeeInSol = (fee / 1e6 / LAMPORTS_PER_SOL) * unitBudget;
    console.table({
      "RPC Provider": rpcProvider,
      "Method used": methodUsed,
      "Percentile used": percentile,
      "Multiple used": percentileMultiple,
      "Compute budget": unitBudget,
      "Priority fee": fee,
      "Max fee in SOL": maxFeeInSol,
    });
  }

  instructions.push(
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: fee }),
  );

  return instructions;
}

/**
 * Simulates a transaction and returns the compute units consumed.
 */
async function simulateAndGetComputeUnits(
  connection: Connection,
  transaction: Transaction | VersionedTransaction,
): Promise<number> {
  let unitsUsed = 200_000;
  let simulationAttempts = 0;

  simulationLoop: while (true) {
    const response = await connection.simulateTransaction(transaction as Transaction);

    if (response.value.err) {
      if (checkKnownSimulationError(response.value)) {
        // Number of attempts will be at most 5 for known errors
        if (simulationAttempts < 5) {
          simulationAttempts++;
          await sleep(1000);
          continue simulationLoop;
        }
      } else if (simulationAttempts < 3) {
        // Number of attempts will be at most 3 for unknown errors
        simulationAttempts++;
        await sleep(1000);
        continue simulationLoop;
      }

      // Still failing after multiple attempts
      throw new Error(
        `Simulation failed: ${JSON.stringify(response.value.err)}\nLogs:\n${(
          response.value.logs || []
        ).join("\n  ")}`,
      );
    } else {
      // Simulation was successful
      if (response.value.unitsConsumed) {
        unitsUsed = response.value.unitsConsumed;
      }
      break;
    }
  }

  return unitsUsed;
}

/**
 * Calculates the priority fee based on RPC provider and configuration.
 */
async function calculatePriorityFee(
  connection: Connection,
  transaction: Transaction | VersionedTransaction,
  rpcProvider: SolanaRpcProvider,
  config: Required<PriorityFeeConfig>,
): Promise<{ fee: number; methodUsed: "triton" | "default" | "minimum" }> {
  const { percentile, percentileMultiple, min, max } = config;

  if (rpcProvider === "triton") {
    // Triton has an experimental RPC method that accepts a percentile parameter
    // and usually gives more accurate fee numbers.
    try {
      const fee = await determinePriorityFeeTritonOne(
        connection,
        transaction,
        percentile,
        percentileMultiple,
        min,
        max,
      );

      return { fee, methodUsed: "triton" };
    } catch (e) {
      console.warn(`Failed to determine priority fee using Triton RPC:`, e);
    }
  }

  try {
    // By default, use generic Solana RPC method
    const fee = await determinePriorityFee(
      connection,
      transaction,
      percentile,
      percentileMultiple,
      min,
      max,
    );

    return { fee, methodUsed: "default" };
  } catch (e) {
    console.warn(`Failed to determine priority fee:`, e);

    return { fee: min, methodUsed: "minimum" };
  }
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Checks response logs for known simulation errors that can be retried.
 */
function checkKnownSimulationError(response: SimulatedTransactionResponse): boolean {
  const errors: Record<string, string> = {};

  // This error occurs when the blockhash included in a transaction is not deemed to be valid
  if (response.err === "BlockhashNotFound") {
    errors["BlockhashNotFound"] =
      "Blockhash not found during simulation. Trying again.";
  }

  // Check the response logs for any known errors
  if (response.logs) {
    for (const line of response.logs) {
      if (line.includes("SlippageToleranceExceeded")) {
        errors["SlippageToleranceExceeded"] =
          "Slippage failure during simulation. Trying again.";
      }

      if (line.includes("RequireGteViolated")) {
        errors["RequireGteViolated"] =
          "Swap instruction failure during simulation. Trying again.";
      }
    }
  }

  if (Object.keys(errors).length === 0) {
    return false;
  }

  console.table(errors);
  return true;
}

/**
 * Checks whether a hostname is exactly the given domain or a subdomain of it.
 * e.g. isHostOrSubdomainOf("api.triton.one", "triton.one") => true
 *      isHostOrSubdomainOf("not-triton.com", "triton.one") => false
 */
function isHostOrSubdomainOf(hostname: string, base: string): boolean {
  return hostname === base || hostname.endsWith(`.${base}`);
}

/**
 * Determines the RPC provider from the endpoint URL.
 */
export function determineRpcProvider(endpoint: string): SolanaRpcProvider {
  try {
    const url = new URL(endpoint);
    const hostname = url.hostname;
    if (isHostOrSubdomainOf(hostname, "rpcpool.com") || isHostOrSubdomainOf(hostname, "triton.one")) {
      return "triton";
    } else if (isHostOrSubdomainOf(hostname, "helius-rpc.com") || isHostOrSubdomainOf(hostname, "helius.xyz")) {
      return "helius";
    } else if (isHostOrSubdomainOf(hostname, "ankr.com")) {
      return "ankr";
    } else {
      return "unknown";
    }
  } catch {
    return "unknown";
  }
}

/**
 * Sleep for a specified duration.
 */
export async function sleep(timeout: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

/**
 * Checks whether an object is empty.
 */
export const isEmptyObject = (value: object | null | undefined): boolean => {
  if (value === null || value === undefined) {
    return true;
  }

  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      return false;
    }
  }

  return true;
};

