import {
  SuiChains,
  SuiUnsignedTransaction,
} from "@wormhole-foundation/sdk-sui";
import { Network } from "@wormhole-foundation/sdk";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-aggregator-core";

export async function signAndSendTransaction(
  request: SuiUnsignedTransaction<Network, SuiChains>,
  wallet: AdapterWallet
): Promise<string> {
  if (!wallet || !wallet.sendTransaction) {
    throw new Error("wallet.sendTransaction is undefined");
  }

  const response = await wallet.sendTransaction({
    /* @ts-ignore */
    transactionBlock: request.transaction as TransactionBlock,
  });

  return response?.id;
}
