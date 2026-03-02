/**
 * Client-side Solana signer for wallet-based transaction signing.
 * This function signs and sends the transaction while constantly checking for confirmation
 * and resending the transaction if it hasn't been confirmed after the specified interval.
 */

import {
  ConfirmOptions,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";

import { Connection } from "@solana/web3.js";
import { Network } from "@wormhole-foundation/sdk";
import { SolanaUnsignedTransaction } from "@wormhole-foundation/sdk-solana";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-core";
import { CrossChainCore } from "../../../CrossChainCore";
import { SolanaDerivedWallet } from "@aptos-labs/derived-wallet-solana";
import {
  addPriorityFeeInstructions,
  sendAndConfirmTransaction,
  PriorityFeeConfig,
} from "./solanaUtils";

// Re-export types for backwards compatibility
export type { SolanaRpcProvider, PriorityFeeConfig } from "./solanaUtils";
export {
  sleep,
  isEmptyObject,
  determineRpcProvider,
} from "./solanaUtils";

// See https://docs.triton.one/chains/solana/sending-txs for more information
export async function signAndSendTransaction(
  request: SolanaUnsignedTransaction<Network>,
  wallet: AdapterWallet | undefined,
  options?: ConfirmOptions,
  crossChainCore?: CrossChainCore,
) {
  if (!wallet || !(wallet instanceof SolanaDerivedWallet)) {
    throw new Error("Invalid wallet type or missing Solana wallet");
  }

  const commitment =
    options?.commitment ??
    crossChainCore?._dappConfig?.solanaConfig?.commitment ??
    "finalized";
  // Solana rpc should come from dapp config
  const connection = new Connection(
    crossChainCore?._dappConfig?.solanaConfig?.rpc ??
      crossChainCore?.CHAINS["Solana"]?.defaultRpc ??
      "https://api.devnet.solana.com", // Last resort fallback
  );
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash(commitment);

  // Add priority fee instructions
  const unsignedTx = await setPriorityFeeInstructions(
    connection,
    blockhash,
    lastValidBlockHeight,
    request,
    crossChainCore?._dappConfig?.solanaConfig?.priorityFeeConfig,
  );

  if (!wallet.solanaWallet.signTransaction) {
    throw new Error("Wallet does not support signing transactions");
  }

  const tx = await wallet.solanaWallet.signTransaction(unsignedTx);

  if (!tx) throw new Error("Failed to sign transaction");

  // Order matters. Phantom's Lighthouse security requires wallet to sign first,
  // then additional signers sign afterward
  if (request.transaction.signers && tx instanceof Transaction) {
    tx.partialSign(...request.transaction.signers);
  }

  const serializedTx = tx.serialize();

  // Use shared utility for sending and confirming
  const signature = await sendAndConfirmTransaction(
    serializedTx,
    blockhash,
    lastValidBlockHeight,
    {
      connection,
      commitment,
      retryIntervalMs: 5000,
      verbose: false,
    },
  );

  return signature;
}

/**
 * Prepares a transaction with priority fee instructions.
 */
export async function setPriorityFeeInstructions(
  connection: Connection,
  blockhash: string,
  lastValidBlockHeight: number,
  request: SolanaUnsignedTransaction<Network>,
  priorityFeeConfig?: PriorityFeeConfig,
): Promise<Transaction | VersionedTransaction> {
  const unsignedTx = request.transaction.transaction as Transaction;

  unsignedTx.recentBlockhash = blockhash;
  unsignedTx.lastValidBlockHeight = lastValidBlockHeight;

  // Add priority fee instructions using shared utility
  await addPriorityFeeInstructions(
    connection,
    unsignedTx,
    priorityFeeConfig,
    false,
  );

  return unsignedTx;
}
