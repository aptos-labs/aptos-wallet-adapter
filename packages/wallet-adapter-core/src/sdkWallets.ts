import {
  AptosConnectAppleWallet,
  AptosConnectGoogleWallet,
} from "@aptos-connect/wallet-adapter-plugin";
import { Network } from "@aptos-labs/ts-sdk";
import { DevTWallet, TWallet } from "@atomrigslab/aptos-wallet-adapter";
import { MizuWallet } from "@mizuwallet-sdk/aptos-wallet-adapter";
import { MSafeWallet } from "@msafe/aptos-aip62-wallet";
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

    if (
      dappConfig?.mizuwallet &&
      dappConfig?.network &&
      [Network.MAINNET, Network.TESTNET].includes(dappConfig.network)
    ) {
      sdkWallets.push(
        new MizuWallet({
          // mizo supports only TESTNET and MAINNET and holds a custom type for network
          network: dappConfig.network as Network.MAINNET | Network.TESTNET,
          manifestURL: dappConfig.mizuwallet.manifestURL,
          appId: dappConfig.mizuwallet.appId,
        })
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

  if (dappConfig?.network) {
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
