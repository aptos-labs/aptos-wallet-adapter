import {
  AptosConnectAppleWallet,
  AptosConnectGenericWallet,
  AptosConnectGoogleWallet,
} from "@aptos-connect/wallet-adapter-plugin";
import type { AdapterWallet, DappConfig } from "./WalletCore";

export function getSDKWallets(dappConfig?: DappConfig) {
  const sdkWallets: AdapterWallet[] = [];

  // Need to check window is defined for AptosConnect
  if (typeof window !== "undefined") {
    // Aptos Connect is still typed against wallet-standard 0.5.x. Runtime AIP-62
    // behavior is compatible; WalletCore already branches on feature versions.
    sdkWallets.push(
      new AptosConnectGoogleWallet({
        network: dappConfig?.network,
        dappId: dappConfig?.aptosConnectDappId,
        ...dappConfig?.aptosConnect,
      }) as AdapterWallet,
      new AptosConnectAppleWallet({
        network: dappConfig?.network,
        dappId: dappConfig?.aptosConnectDappId,
        ...dappConfig?.aptosConnect,
      }) as AdapterWallet,
      new AptosConnectGenericWallet({
        network: dappConfig?.network,
        dappId: dappConfig?.aptosConnectDappId,
        ...dappConfig?.aptosConnect,
      }) as AdapterWallet,
    );
  }

  // Add new SDK wallet plugins (ones that should be installed as packages) here:
  // Ex. sdkWallets.push(new YourSDKWallet(dappConfig))

  return sdkWallets;
}
