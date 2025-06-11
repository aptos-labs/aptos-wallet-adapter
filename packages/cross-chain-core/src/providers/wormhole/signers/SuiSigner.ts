import { AdapterWallet } from "@aptos-labs/wallet-adapter-core";
import { Network } from "@wormhole-foundation/sdk";
import {
  SuiChains,
  SuiUnsignedTransaction,
} from "@wormhole-foundation/sdk-sui";
import { SuiDerivedWallet } from "@aptos-labs/derived-wallet-sui";
import {
  SuiSignAndExecuteTransactionBlockInput,
  SuiSignAndExecuteTransactionBlockOutput,
} from "@mysten/wallet-standard";

export async function signAndSendTransaction(
  request: SuiUnsignedTransaction<Network, SuiChains>,
  wallet: AdapterWallet
): Promise<string> {
  if (!wallet) {
    throw new Error("wallet is undefined").message;
  }
  const suiDerivedWallet = wallet as SuiDerivedWallet;

  const signAndExecuteTransactionBlockFeature = suiDerivedWallet.suiWallet
    .features["sui:signAndExecuteTransactionBlock"] as {
    signAndExecuteTransactionBlock: (
      input: SuiSignAndExecuteTransactionBlockInput
    ) => Promise<SuiSignAndExecuteTransactionBlockOutput>;
  };

  if (!signAndExecuteTransactionBlockFeature) {
    throw new Error("wallet does not support signAndExecuteTransactionBlock")
      .message;
  }

  const { digest } =
    await signAndExecuteTransactionBlockFeature.signAndExecuteTransactionBlock({
      transactionBlock: request.transaction,
      account: suiDerivedWallet.suiWallet.accounts[0],
      chain: `sui:${request.network.toLocaleLowerCase()}`,
    });

  return digest;
}
