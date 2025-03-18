import {
  EvmUnsignedTransaction,
  EvmChains,
} from "@wormhole-foundation/sdk-evm";
import { Network } from "@wormhole-foundation/sdk";
import { getBigInt } from "ethers";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-aggregator-core";
export async function signAndSendTransaction(
  request: EvmUnsignedTransaction<Network, EvmChains>,
  wallet: AdapterWallet,
  chainName: string,
  options: any
): Promise<string> {
  if (!wallet || !wallet.sendTransaction) {
    throw new Error("wallet.sendTransaction is undefined").message;
  }
  // Ensure the signer is connected to the correct chain
  const actualChainId = await wallet.getConnectedNetwork();

  if (!actualChainId)
    throw new Error("No signer found for chain" + chainName).message;
  const expectedChainId = request.transaction.chainId
    ? getBigInt(request.transaction.chainId)
    : undefined;
  if (
    !actualChainId ||
    !expectedChainId ||
    BigInt(actualChainId.name) !== expectedChainId
  ) {
    throw new Error(
      `Signer is not connected to the right chain. Expected ${expectedChainId}, got ${actualChainId}`
    ).message;
  }

  const txHash = await wallet.sendTransaction(request.transaction);

  return txHash;
}
