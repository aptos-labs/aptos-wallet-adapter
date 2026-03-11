import type { SuiDerivedWallet } from "@aptos-labs/derived-wallet-sui";
import type { AdapterWallet } from "@aptos-labs/wallet-adapter-core";
import type {
  SuiSignAndExecuteTransactionInput,
  SuiSignAndExecuteTransactionOutput,
} from "@mysten/wallet-standard";
import type { Network } from "@wormhole-foundation/sdk";
import type {
  SuiChains,
  SuiUnsignedTransaction,
} from "@wormhole-foundation/sdk-sui";

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
