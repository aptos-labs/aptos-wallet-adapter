import { AptosStandardWallet } from "../AIP62StandardWallets";
import { WalletInfo } from "../LegacyWalletPlugins";
import { AnyAptosWallet } from "../WalletCore";
import { partitionWallets } from "./helpers";

/** The base URL for all Aptos Connect wallets. */
export const APTOS_CONNECT_BASE_URL = "https://aptosconnect.app";

/** The URL to the Aptos Connect account page if the user is signed in to Aptos Connect. */
export const APTOS_CONNECT_ACCOUNT_URL =
  "https://aptosconnect.app/dashboard/main-account";

/** Returns `true` if the provided wallet is an Aptos Connect wallet. */
export function isAptosConnectWallet(
  wallet: WalletInfo | AnyAptosWallet | AptosStandardWallet
) {
  return wallet.url.startsWith(APTOS_CONNECT_BASE_URL);
}

/**
 * Partitions the `wallets` array so that Aptos Connect wallets are grouped separately from the rest.
 * Aptos Connect is a web wallet that uses social login to create accounts on the blockchain.
 */
export function getAptosConnectWallets(wallets: ReadonlyArray<AnyAptosWallet>) {
  const { defaultWallets, moreWallets } = partitionWallets(
    wallets,
    isAptosConnectWallet
  );
  return { aptosConnectWallets: defaultWallets, otherWallets: moreWallets };
}
