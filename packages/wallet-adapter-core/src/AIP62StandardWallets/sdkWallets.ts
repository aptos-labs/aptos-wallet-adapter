import { TWallet } from "@atomrigslab/aptos-wallet-adapter";
import { AptosStandardWallet } from "./WalletStandard";

const sdkWallets: AptosStandardWallet[] = [];

// TODO twallet uses @aptos-labs/wallet-standard at version 0.0.11 while adapter uses
// a newer version (0.1.0) - this causes type mismatch. We should figure out how to handle it.
sdkWallets.push(new TWallet() as any);

export default sdkWallets;
