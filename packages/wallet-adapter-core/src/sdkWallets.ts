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
    const aptosConnectConfig = {
      network: dappConfig?.network,
      dappId: dappConfig?.aptosConnectDappId,
      ...dappConfig?.aptosConnect,
    };

    sdkWallets.push(
      new AptosConnectGoogleWallet(aptosConnectConfig),
      new AptosConnectAppleWallet(aptosConnectConfig),
      new AptosConnectGenericWallet(aptosConnectConfig),
    );
  }

  // Add new SDK wallet plugins (ones that should be installed as packages) here:
  // Ex. sdkWallets.push(new YourSDKWallet(dappConfig))

  return sdkWallets;
}
