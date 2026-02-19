import {
  EvmUnsignedTransaction,
  EvmChains,
} from "@wormhole-foundation/sdk-evm";
import { Network } from "@wormhole-foundation/sdk";
import { ethers, getBigInt } from "ethers";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-core";
import { EIP1193DerivedWallet } from "@aptos-labs/derived-wallet-ethereum";
export async function signAndSendTransaction(
  request: EvmUnsignedTransaction<Network, EvmChains>,
  wallet: AdapterWallet,
  chainName: string,
  options: any,
): Promise<string> {
  if (!wallet) {
    throw new Error("wallet.sendTransaction is undefined");
  }
  // Ensure the signer is connected to the correct chain
  const chainId = await (
    wallet as EIP1193DerivedWallet
  ).eip1193Provider.request({
    method: "eth_chainId",
  });
  const actualChainId = parseInt(chainId, 16);

  if (!actualChainId)
    throw new Error("No signer found for chain" + chainName);
  const expectedChainId = request.transaction.chainId
    ? getBigInt(request.transaction.chainId)
    : undefined;
  if (
    !actualChainId ||
    !expectedChainId ||
    BigInt(actualChainId) !== expectedChainId
  ) {
    throw new Error(
      `Signer is not connected to the right chain. Expected ${expectedChainId}, got ${actualChainId}`,
    );
  }

  const provider = new ethers.BrowserProvider(
    (wallet as EIP1193DerivedWallet).eip1193Provider,
  );
  const signer = await provider.getSigner();

  let response: ethers.TransactionResponse;
  try {
    response = await signer.sendTransaction(request.transaction);
  } catch (e) {
    // Some wallet providers (e.g. MetaMask via injected provider) can throw
    // after the transaction is already broadcast. Try to extract the hash from
    // the error so the caller can track the pending transaction.
    const message = e instanceof Error ? e.message : String(e);
    const hashMatch = message.match(/"hash":\s*"(0x[a-fA-F0-9]{64})"/);
    if (hashMatch) {
      console.warn("Extracted EVM tx hash from error:", hashMatch[1]);
      return hashMatch[1];
    }
    throw e;
  }

  try {
    const receipt = await response.wait();
    return receipt?.hash || response.hash || "";
  } catch (e: any) {
    // When a user speeds up or cancels a transaction in their wallet, ethers
    // throws a TRANSACTION_REPLACED error. We must handle this specifically
    // to avoid returning the old (now-invalid) hash.
    if (e?.code === "TRANSACTION_REPLACED") {
      // "repriced" means the same transaction data was re-sent with higher
      // gas — the bridge burn still went through with the replacement tx.
      if (e.reason === "repriced") {
        const replacementHash = e.receipt?.hash || e.replacement?.hash;
        if (replacementHash) {
          console.warn(
            "EVM transaction was repriced. Using replacement hash:",
            replacementHash,
          );
          return replacementHash;
        }
      }
      // "cancelled" or "replaced" means the original burn was superseded by
      // a different transaction (e.g. a 0-value self-transfer or an entirely
      // different call). The bridge burn did not happen, so we must not
      // return a hash that implies success.
      throw e;
    }

    // wait() can fail due to network timeouts or RPC instability, but the
    // transaction was already submitted (sendTransaction returned successfully).
    // Return the hash so the caller can track confirmation asynchronously.
    if (response.hash) {
      console.warn(
        "EVM transaction wait failed but tx was submitted:",
        response.hash,
      );
      return response.hash;
    }
    throw e;
  }
}
