import { AptosStandardWallet } from "../AIP62StandardWallets";
import { Wallet } from "../LegacyWalletPlugins";

/** The base URL for all Aptos Connect wallets. */
export const APTOS_CONNECT_BASE_URL = "https://aptosconnect.app";

/** The URL to the Aptos Connect account page if the user is signed in to Aptos Connect. */
export const APTOS_CONNECT_ACCOUNT_URL =
  "https://aptosconnect.app/dashboard/main-account";

/** Returns `true` if the provided wallet is an Aptos Connect wallet. */
export function isAptosConnectWallet(wallet: AptosStandardWallet | Wallet) {
  return wallet.url.startsWith(APTOS_CONNECT_BASE_URL);
}
