import {
  PetraWebWallet,
  type PetraWebWalletConfig,
} from "@petra-app/wallet-adapter-plugin";
import type { AdapterWallet, DappConfig } from "./WalletCore";

export function getSDKWallets(dappConfig?: DappConfig): AdapterWallet[] {
  const sdkWallets: AdapterWallet[] = [];

  // Petra Web opens its prompt in a browser popup, so it needs a window
  if (typeof window !== "undefined") {
    const config: PetraWebWalletConfig = {
      ...dappConfig?.petraWeb,
      network: dappConfig?.network,
    };
    sdkWallets.push(
      new PetraWebWallet("google", config),
      new PetraWebWallet("apple", config),
      new PetraWebWallet("generic", config),
    );
  }

  // Add new SDK wallet plugins (ones that should be installed as packages) here:
  // Ex. sdkWallets.push(new YourSDKWallet(dappConfig))

  return sdkWallets;
}
