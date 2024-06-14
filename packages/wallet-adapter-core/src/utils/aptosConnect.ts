import { WalletInfo } from "../LegacyWalletPlugins";
import { AnyAptosWallet } from "../WalletCore";

/** The base URL for all Aptos Connect wallets. */
export const APTOS_CONNECT_BASE_URL = "https://aptosconnect.app";

/** The URL to the Aptos Connect account page if the user is signed in to Aptos Connect. */
export const APTOS_CONNECT_ACCOUNT_URL =
  "https://aptosconnect.app/dashboard/main-account";

/** Returns `true` if the provided wallet is an Aptos Connect wallet. */
export function isAptosConnectWallet(wallet: WalletInfo | AnyAptosWallet) {
  return wallet.url.includes(APTOS_CONNECT_BASE_URL);
}
