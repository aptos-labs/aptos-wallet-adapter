import { AptosConnectWallet } from "@aptos-connect/wallet-adapter-plugin";
import { Network } from "@aptos-labs/ts-sdk";
import { DevTWallet, TWallet } from "@atomrigslab/aptos-wallet-adapter";
import { MizuWallet } from "@mizuwallet-sdk/aptos-wallet-adapter";
import { DappConfig } from "../WalletCore";
import { AptosStandardWallet } from "./WalletStandard";

export function getSDKWallets(dappConfig?: DappConfig) {
  const sdkWallets: AptosStandardWallet[] = [];

  // Need to check window is defined for AptosConnect
  if (typeof window !== "undefined") {
    sdkWallets.push(
      new AptosConnectWallet({
        network: dappConfig?.network,
        dappId: dappConfig?.aptosConnectDappId,
      })
    );

    if (
      dappConfig?.mizuwallet &&
      dappConfig?.network &&
      [Network.MAINNET, Network.TESTNET].includes(dappConfig.network)
    ) {
      sdkWallets.push(
        new MizuWallet({
          network: dappConfig.network as any,
          manifestURL: dappConfig.mizuwallet.manifestURL,
          appId: dappConfig.mizuwallet.appId,
        }) as any
      );
    }
  }

  // Push production wallet if env is production, otherwise use dev wallet
  if (dappConfig?.network === Network.MAINNET) {
    // TODO twallet uses @aptos-labs/wallet-standard at version 0.0.11 while adapter uses
    // a newer version (0.1.0) - this causes type mismatch. We should figure out how to handle it.
    sdkWallets.push(new TWallet() as any);
  } else {
    sdkWallets.push(new DevTWallet() as any);
  }

  // Add new SDK wallet plugins (ones that should be installed as packages) here:
  // Ex. sdkWallets.push(new YourSDKWallet(dappConfig))

  return sdkWallets;
}
