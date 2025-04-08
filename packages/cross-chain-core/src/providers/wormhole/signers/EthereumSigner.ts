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
    throw new Error("wallet.sendTransaction is undefined").message;
  }
  // Ensure the signer is connected to the correct chain
  const chainId = await (
    wallet as EIP1193DerivedWallet
  ).eip1193Provider.request({
    method: "eth_chainId",
  });
  const actualChainId = parseInt(chainId, 16);

  if (!actualChainId)
    throw new Error("No signer found for chain" + chainName).message;
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
    ).message;
  }

  const provider = new ethers.BrowserProvider(
    (wallet as EIP1193DerivedWallet).eip1193Provider,
  );
  const signer = await provider.getSigner();
  const response = await signer.sendTransaction(request.transaction);
  const receipt = await response.wait();

  return receipt?.hash || "";
}
