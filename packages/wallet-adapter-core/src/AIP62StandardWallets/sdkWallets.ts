import { DevTWallet, TWallet } from "@atomrigslab/aptos-wallet-adapter";
import { AptosConnectWallet } from "@aptos-connect/wallet-adapter-plugin";
import { AptosStandardWallet } from "./WalletStandard";
import { Network } from "@aptos-labs/ts-sdk";

const isProd = process.env.NODE_ENV === "production";

let aptosNetwork = isProd ? Network.MAINNET : Network.TESTNET;

const sdkWallets: AptosStandardWallet[] = [];

// Push production wallet if env is production, otherwise use dev wallet
if (isProd) {
  // TODO twallet uses @aptos-labs/wallet-standard at version 0.0.11 while adapter uses
  // a newer version (0.1.0) - this causes type mismatch. We should figure out how to handle it.
  sdkWallets.push(new TWallet() as any);
} else {
  sdkWallets.push(new DevTWallet() as any);
}

// Need to check window is defined for AptosConnect
if (typeof window !== "undefined") {
  sdkWallets.push(new AptosConnectWallet({ network: aptosNetwork }));
}

export default sdkWallets;
