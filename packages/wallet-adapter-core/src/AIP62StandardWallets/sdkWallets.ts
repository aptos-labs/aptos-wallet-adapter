import { DevTWallet } from "@atomrigslab/aptos-wallet-adapter";
import { AptosConnectWalletPlugin } from "@aptos-connect/wallet-adapter-plugin";
import { Network } from "@aptos-labs/ts-sdk";

const isProd = process.env.NODE_ENV === "production";

let aptosNetwork = isProd ? Network.MAINNET : Network.TESTNET;

const wallets: any = [new DevTWallet()];

if (typeof window !== "undefined") {
  wallets.push(new AptosConnectWalletPlugin({ network: aptosNetwork }));
}

export default wallets;
