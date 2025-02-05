import {
  EvmUnsignedTransaction,
  EvmChains,
} from "@wormhole-foundation/sdk-evm";
import { Network } from "@wormhole-foundation/sdk";
import { Eip6963Wallet } from "@xlabs-libs/wallet-aggregator-evm";
import { getBigInt } from "ethers";

export async function signAndSendTransaction(
  request: EvmUnsignedTransaction<Network, EvmChains>,
  wallet: Eip6963Wallet,
  chainName: string,
  options: any // TODO ?!?!!?!?
): Promise<string> {
  // Ensure the signer is connected to the correct chain
  console.log("wallet", wallet);
  const provider = await wallet.getNetworkInfo();
  console.log("provider", provider);
  if (!provider) throw new Error("No signer found for chain" + chainName);
  const expectedChainId = request.transaction.chainId
    ? getBigInt(request.transaction.chainId)
    : undefined;
  const actualChainId = provider?.chainId;
  console.log("actualChainId", actualChainId);
  console.log("expectedChainId", expectedChainId);
  if (
    !actualChainId ||
    !expectedChainId ||
    BigInt(actualChainId) !== expectedChainId
  ) {
    throw new Error(
      `Signer is not connected to the right chain. Expected ${expectedChainId}, got ${actualChainId}`
    );
  }

  const tx = await wallet.sendTransaction(request.transaction);
  //const result = await tx.wait();
  console.log("tx.hash", tx.id);

  return tx.id;
}
