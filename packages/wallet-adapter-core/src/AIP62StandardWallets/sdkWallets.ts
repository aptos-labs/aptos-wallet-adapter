import { DevTWallet, TWallet } from "@atomrigslab/aptos-wallet-adapter";
import { AptosConnectWallet } from "@aptos-connect/wallet-adapter-plugin";
import { AptosStandardWallet } from "./WalletStandard";
import { Network } from "@aptos-labs/ts-sdk";
import { DappConfig } from "../WalletCore";

export function getSDKWallets(dappConfig?: DappConfig) {
  const sdkWallets: AptosStandardWallet[] = [];
  // Push production wallet if env is production, otherwise use dev wallet
  if (dappConfig?.network === Network.MAINNET) {
    // TODO twallet uses @aptos-labs/wallet-standard at version 0.0.11 while adapter uses
    // a newer version (0.1.0) - this causes type mismatch. We should figure out how to handle it.
    sdkWallets.push(new TWallet() as any);
  } else {
    sdkWallets.push(new DevTWallet() as any);
  }

  // Need to check window is defined for AptosConnect
  if (typeof window !== "undefined") {
    sdkWallets.push(new AptosConnectWallet({ network: dappConfig?.network, dappId: dappConfig?.aptosConnectDappId }));
  }

  return sdkWallets;
}
