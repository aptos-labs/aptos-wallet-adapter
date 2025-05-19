import {
  AptosConnectAppleWallet,
  AptosConnectGoogleWallet,
} from "@aptos-connect/wallet-adapter-plugin";
import { Network } from "@aptos-labs/ts-sdk";
import { DevTWallet, TWallet } from "@atomrigslab/aptos-wallet-adapter";
import { inMSafeWallet, MSafeWallet } from "@msafe/aptos-aip62-wallet";
import { DappConfig, AdapterWallet } from "./WalletCore";

export function getSDKWallets(dappConfig?: DappConfig) {
  const sdkWallets: AdapterWallet[] = [];

  // Need to check window is defined for AptosConnect
  if (typeof window !== "undefined") {
    sdkWallets.push(
      new AptosConnectGoogleWallet({
        network: dappConfig?.network,
        dappId: dappConfig?.aptosConnectDappId,
        ...dappConfig?.aptosConnect,
      }),
      new AptosConnectAppleWallet({
        network: dappConfig?.network,
        dappId: dappConfig?.aptosConnectDappId,
        ...dappConfig?.aptosConnect,
      })
    );
  }

  // Push production wallet if env is production, otherwise use dev wallet
  if (dappConfig?.network === Network.MAINNET) {
    // TODO twallet uses @aptos-labs/wallet-standard at version 0.0.11 while adapter uses
    // a newer version (0.1.0) - this causes type mismatch. We should figure out how to handle it.
    sdkWallets.push(new TWallet() as any);
  } else {
    sdkWallets.push(new DevTWallet() as any);
  }

  // MSafe only works if the dapp is open within the MSafe App store
  // https://doc.m-safe.io/aptos/developers/integrate-with-msafe-dapp/faq
  if (dappConfig?.msafeWalletConfig && dappConfig.network && inMSafeWallet()) {
    sdkWallets.push(
      new MSafeWallet({
        ...dappConfig?.msafeWalletConfig,
        network: dappConfig.network,
      })
    );
  }

  // Add new SDK wallet plugins (ones that should be installed as packages) here:
  // Ex. sdkWallets.push(new YourSDKWallet(dappConfig))

  return sdkWallets;
}
