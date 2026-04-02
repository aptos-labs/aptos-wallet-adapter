import {
  AptosConnectAppleWallet,
  AptosConnectGenericWallet,
  AptosConnectGoogleWallet,
} from "@aptos-connect/wallet-adapter-plugin";
import { Aptos } from "@aptos-labs/ts-sdk";
import type { AdapterWallet, DappConfig } from "./WalletCore";

function withDedupedChainIdPrefetch<T>(callback: () => T): T {
  const originalGetChainId = Aptos.prototype.getChainId;
  let sharedChainIdPromise: ReturnType<typeof originalGetChainId> | undefined;

  // Aptos Connect eagerly prefetches the chain ID in each wallet constructor.
  // Reuse the first request during SDK wallet creation so we only hit the node once.
  Aptos.prototype.getChainId = function getDedupedChainId(this: Aptos) {
    if (!sharedChainIdPromise) {
      sharedChainIdPromise = originalGetChainId.call(this).catch((error) => {
        sharedChainIdPromise = undefined;
        throw error;
      });
    }

    return sharedChainIdPromise;
  };

  try {
    return callback();
  } finally {
    Aptos.prototype.getChainId = originalGetChainId;
  }
}

export function getSDKWallets(dappConfig?: DappConfig) {
  const sdkWallets: AdapterWallet[] = [];

  // Need to check window is defined for AptosConnect
  if (typeof window !== "undefined") {
    const aptosConnectConfig = {
      network: dappConfig?.network,
      dappId: dappConfig?.aptosConnectDappId,
      ...dappConfig?.aptosConnect,
    };

    sdkWallets.push(
      ...withDedupedChainIdPrefetch(() => [
        new AptosConnectGoogleWallet(aptosConnectConfig),
        new AptosConnectAppleWallet(aptosConnectConfig),
        new AptosConnectGenericWallet(aptosConnectConfig),
      ]),
    );
  }

  // Add new SDK wallet plugins (ones that should be installed as packages) here:
  // Ex. sdkWallets.push(new YourSDKWallet(dappConfig))

  return sdkWallets;
}
