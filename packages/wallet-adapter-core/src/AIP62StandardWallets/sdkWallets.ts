import { TWallet } from "@atomrigslab/aptos-wallet-adapter";
import { AptosStandardWallet } from "./WalletStandard";

const sdkWallets: AptosStandardWallet[] = [];

sdkWallets.push(new TWallet());

export default sdkWallets;
