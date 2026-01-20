import { AdapterWallet } from "@aptos-labs/wallet-adapter-core";
import { Network } from "@wormhole-foundation/sdk";
import {
  SuiChains,
  SuiUnsignedTransaction,
} from "@wormhole-foundation/sdk-sui";
import { SuiDerivedWallet } from "@aptos-labs/derived-wallet-sui";
import {
  SuiSignAndExecuteTransactionInput,
  SuiSignAndExecuteTransactionOutput,
} from "@mysten/wallet-standard";

export async function signAndSendTransaction(
  request: SuiUnsignedTransaction<Network, SuiChains>,
  wallet: AdapterWallet,
): Promise<string> {
  if (!wallet) {
    throw new Error("wallet is undefined");
  }
  const suiDerivedWallet = wallet as SuiDerivedWallet;

  const signAndExecuteTransactionFeature = suiDerivedWallet.suiWallet.features[
    "sui:signAndExecuteTransaction"
  ] as {
    signAndExecuteTransaction: (
      input: SuiSignAndExecuteTransactionInput,
    ) => Promise<SuiSignAndExecuteTransactionOutput>;
  };

  if (!signAndExecuteTransactionFeature) {
    throw new Error("wallet does not support signAndExecuteTransaction");
  }

  const { digest } =
    await signAndExecuteTransactionFeature.signAndExecuteTransaction({
      transaction: request.transaction,
      account: suiDerivedWallet.suiWallet.accounts[0],
      chain: `sui:${request.network.toLocaleLowerCase()}`,
    });

  return digest;
}
