// This function signs and sends the transaction while constantly checking for confirmation
// and resending the transaction if it hasn't been confirmed after the specified interval

import {
  ComputeBudgetProgram,
  ConfirmOptions,
  LAMPORTS_PER_SOL,
  SimulatedTransactionResponse,
  TransactionInstruction,
  VersionedTransaction,
} from "@solana/web3.js";

import { Transaction } from "@solana/web3.js";
import { RpcResponseAndContext, SignatureResult } from "@solana/web3.js";
import {
  determinePriorityFee,
  determinePriorityFeeTritonOne,
  SolanaUnsignedTransaction,
} from "@wormhole-foundation/sdk-solana";

import { Connection } from "@solana/web3.js";
import { Network } from "@wormhole-foundation/sdk";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-core";
import { CrossChainCore } from "../../../CrossChainCore";
import { SolanaDerivedWallet } from "@aptos-labs/derived-wallet-solana";

export type SolanaRpcProvider = "triton" | "helius" | "ankr" | "unknown";

// See https://docs.triton.one/chains/solana/sending-txs for more information
export async function signAndSendTransaction(
  request: SolanaUnsignedTransaction<Network>,
  wallet: AdapterWallet | undefined,
  options?: ConfirmOptions,
  crossChainCore?: CrossChainCore,
) {
  if (!wallet || !(wallet instanceof SolanaDerivedWallet)) {
    throw new Error("Invalid wallet type or missing Solana wallet").message;
  }

  const commitment = options?.commitment ?? "finalized";
  // Solana rpc should come from dapp config
  const connection = new Connection(
    crossChainCore?._dappConfig?.solanaConfig?.rpc ??
      crossChainCore?.CHAINS["Solana"]?.defaultRpc ??
      "https://api.devnet.solana.com", // Last resort fallback
  );
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash(commitment);

  // Circle Manual CCTP on Wormhole is always of a Trnasaction type
  // https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/f7d992e04f844edcc4128659f12f75ade3553717/platforms/solana/protocols/cctp/src/circleBridge.ts#L173
  const transaction = request.transaction.transaction as Transaction;

  /**
   * TODO: Priority Fee is supported, but needs to come from dapp config
   */
  const unsignedTx = await setPriorityFeeInstructions(
    connection,
    blockhash,
    lastValidBlockHeight,
    request,
    crossChainCore,
  );

  let confirmTransactionPromise: Promise<
    RpcResponseAndContext<SignatureResult>
  > | null = null;
  let confirmedTx: RpcResponseAndContext<SignatureResult> | null = null;
  let txSendAttempts = 1;
  let signature = "";

  // transaction.recentBlockhash = blockhash;
  // if (request.transaction.signers) {
  //   transaction.partialSign(...request.transaction.signers);
  // }

  if (!wallet.solanaWallet.signTransaction) {
    throw new Error("Wallet does not support signing transactions").message;
  }

  const tx = await wallet.solanaWallet.signTransaction(unsignedTx);

  if (!tx) throw new Error("Failed to sign transaction").message;
  const serializedTx = tx.serialize();
  const sendOptions = {
    skipPreflight: true,
    maxRetries: 0,
    preFlightCommitment: commitment, // See PR and linked issue for why setting this matters: https://github.com/anza-xyz/agave/pull/483
  };
  signature = await connection.sendRawTransaction(serializedTx, sendOptions);
  confirmTransactionPromise = connection.confirmTransaction(
    {
      signature,
      blockhash,
      lastValidBlockHeight,
    },
    commitment,
  );

  // This loop will break once the transaction has been confirmed or the block height is exceeded.
  // An exception will be thrown if the block height is exceeded by the confirmTransactionPromise.
  // The transaction will be resent if it hasn't been confirmed after the interval.
  const txRetryInterval = 5000;
  while (!confirmedTx) {
    confirmedTx = await Promise.race([
      confirmTransactionPromise,
      new Promise<null>((resolve) =>
        setTimeout(() => {
          resolve(null);
        }, txRetryInterval),
      ),
    ]);
    if (confirmedTx) {
      break;
    }
    console.log(
      `Tx not confirmed after ${
        txRetryInterval * txSendAttempts++
      }ms, resending`,
    );
    try {
      await connection.sendRawTransaction(serializedTx, sendOptions);
    } catch (e) {
      console.error("Failed to resend transaction:", e);
    }
  }

  if (confirmedTx.value.err) {
    let errorMessage = `Transaction failed: ${confirmedTx.value.err}`;
    if (typeof confirmedTx.value.err === "object") {
      try {
        errorMessage = `Transaction failed: ${JSON.stringify(
          confirmedTx.value.err,
          (_key, value) =>
            typeof value === "bigint" ? value.toString() : value, // Handle bigint props
        )}`;
      } catch (e: unknown) {
        // Most likely a circular reference error, we can't stringify this error object.
        // See for more details:
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#exceptions
        errorMessage = `Transaction failed: Unknown error`;
      }
    }
    throw new Error(`Transaction failed: ${errorMessage}`).message;
  }

  return signature;
}

export async function setPriorityFeeInstructions(
  connection: Connection,
  blockhash: string,
  lastValidBlockHeight: number,
  request: SolanaUnsignedTransaction<Network>,
  crossChainCore?: CrossChainCore,
): Promise<Transaction | VersionedTransaction> {
  const unsignedTx = request.transaction.transaction as Transaction;

  const computeBudgetIxFilter = (ix: TransactionInstruction) =>
    ix.programId.toString() !== "ComputeBudget111111111111111111111111111111";

  unsignedTx.recentBlockhash = blockhash;
  unsignedTx.lastValidBlockHeight = lastValidBlockHeight;

  // Remove existing compute budget instructions if they were added by the SDK
  unsignedTx.instructions = unsignedTx.instructions.filter(
    computeBudgetIxFilter,
  );
  unsignedTx.add(
    ...(await createPriorityFeeInstructions(
      connection,
      unsignedTx,
      crossChainCore,
    )),
  );
  if (request.transaction.signers) {
    unsignedTx.partialSign(...request.transaction.signers);
  }

  return unsignedTx;
}

// This will throw if the simulation fails
async function createPriorityFeeInstructions(
  connection: Connection,
  transaction: Transaction | VersionedTransaction,
  crossChainCore?: CrossChainCore,
) {
  let unitsUsed = 200_000;
  let simulationAttempts = 0;

  simulationLoop: while (true) {
    const response = await connection.simulateTransaction(
      transaction as Transaction,
    );

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

      // Still failing after multiple attempts for both known and unknown errors
      // We should throw in that case
      throw new Error(
        `Simulation failed: ${JSON.stringify(response.value.err)}\nLogs:\n${(
          response.value.logs || []
        ).join("\n  ")}`,
      ).message;
    } else {
      // Simulation was successful
      if (response.value.unitsConsumed) {
        unitsUsed = response.value.unitsConsumed;
      }
      break;
    }
  }

  const unitBudget = Math.floor(unitsUsed * 1.2); // Budget in 20% headroom

  const instructions: TransactionInstruction[] = [];
  instructions.push(
    ComputeBudgetProgram.setComputeUnitLimit({
      // Set compute budget to 120% of the units used in the simulated transaction
      units: unitBudget,
    }),
  );

  const {
    percentile = 0.9,
    percentileMultiple = 1,
    min = 100_000,
    max = 100_000_000,
  } = crossChainCore?._dappConfig?.solanaConfig?.priorityFeeConfig ?? {};

  const calculateFee = async (
    rpcProvider?: SolanaRpcProvider,
  ): Promise<{ fee: number; methodUsed: "triton" | "default" | "minimum" }> => {
    if (rpcProvider === "triton") {
      // Triton has an experimental RPC method that accepts a percentile paramater
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

        return {
          fee,
          methodUsed: "triton",
        };
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

      return {
        fee,
        methodUsed: "default",
      };
    } catch (e) {
      console.warn(`Failed to determine priority fee using Triton RPC:`, e);

      return {
        fee: min,
        methodUsed: "minimum",
      };
    }
  };

  const rpcProvider = determineRpcProvider(connection.rpcEndpoint);

  const { fee, methodUsed } = await calculateFee(rpcProvider);

  const maxFeeInSol =
    (fee /
      // convert microlamports to lamports
      1e6 /
      // convert lamports to SOL
      LAMPORTS_PER_SOL) *
    // multiply by maximum compute units used
    unitBudget;

  console.table({
    "RPC Provider": rpcProvider,
    "Method used": methodUsed,
    "Percentile used": percentile,
    "Multiple used": percentileMultiple,
    "Compute budget": unitBudget,
    "Priority fee": fee,
    "Max fee in SOL": maxFeeInSol,
  });

  instructions.push(
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: fee }),
  );
  return instructions;
}

// Checks response logs for known errors.
// Returns when the first error is encountered.
function checkKnownSimulationError(
  response: SimulatedTransactionResponse,
): boolean {
  const errors = {} as any;

  // This error occur when the blockhash included in a transaction is not deemed to be valid
  // when a validator processes a transaction. We can retry the simulation to get a valid blockhash.
  if (response.err === "BlockhashNotFound") {
    errors["BlockhashNotFound"] =
      "Blockhash not found during simulation. Trying again.";
  }

  // Check the response logs for any known errors
  if (response.logs) {
    for (const line of response.logs) {
      // In some cases which aren't deterministic, like a slippage error, we can retry the
      // simulation a few times to get a successful response.
      if (line.includes("SlippageToleranceExceeded")) {
        errors["SlippageToleranceExceeded"] =
          "Slippage failure during simulation. Trying again.";
      }

      // In this case a require_gte expression was violated during a Swap instruction.
      // We can retry the simulation to get a successful response.
      if (line.includes("RequireGteViolated")) {
        errors["RequireGteViolated"] =
          "Swap instruction failure during simulation. Trying again.";
      }
    }
  }

  // No known simulation errors found
  if (isEmptyObject(errors)) {
    return false;
  }

  console.table(errors);
  return true;
}

export async function sleep(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

/**
 * Checks whether an object is empty.
 *
 * isEmptyObject(null)
 * // => true
 *
 * isEmptyObject(undefined)
 * // => true
 *
 * isEmptyObject({})
 * // => true
 *
 * isEmptyObject({ 'a': 1 })
 * // => false
 */
export const isEmptyObject = (value: object | null | undefined) => {
  if (value === null || value === undefined) {
    return true;
  }

  // Check all property keys for any own prop
  for (const key in value) {
    if (value.hasOwnProperty.call(value, key)) {
      return false;
    }
  }

  return true;
};

function determineRpcProvider(endpoint: string): SolanaRpcProvider {
  try {
    const url = new URL(endpoint);
    const hostname = url.hostname;
    if (hostname === "rpcpool.com") {
      return "triton";
    } else if (hostname === "helius-rpc.com") {
      return "helius";
    } else if (hostname === "rpc.ankr.com") {
      return "ankr";
    } else {
      return "unknown";
    }
  } catch (e) {
    return "unknown";
  }
}
