import { AptosStandardWallet } from "../AIP62StandardWallets";
import { WalletInfo } from "../LegacyWalletPlugins";
import { AnyAptosWallet } from "../WalletCore";
import { APTOS_CONNECT_BASE_URL, WalletReadyState } from "../constants";
import { isRedirectable } from "./helpers";

/**
 * A function that will partition the provided wallets into two list — `defaultWallets` and `moreWallets`.
 * By default, the wallets will be partitioned by whether or not they are installed or loadable.
 * You can pass your own partition function if you wish to customize this behavior.
 */
export function partitionWallets(
  wallets: ReadonlyArray<AnyAptosWallet>,
  partitionFunction: (wallet: AnyAptosWallet) => boolean = isInstalledOrLoadable
) {
  const defaultWallets: Array<AnyAptosWallet> = [];
  const moreWallets: Array<AnyAptosWallet> = [];

  for (const wallet of wallets) {
    if (partitionFunction(wallet)) defaultWallets.push(wallet);
    else moreWallets.push(wallet);
  }

  return { defaultWallets, moreWallets };
}

/** Returns true if the wallet is installed or loadable. */
export function isInstalledOrLoadable(wallet: AnyAptosWallet) {
  return (
    wallet.readyState === WalletReadyState.Installed ||
    wallet.readyState === WalletReadyState.Loadable
  );
}

/**
 * Returns true if the user is on desktop and the provided wallet requires installation of a browser extension.
 * This can be used to decide whether to show a "Connect" button or "Install" link in the UI.
 */
export function isInstallRequired(wallet: AnyAptosWallet) {
  const isWalletReady = isInstalledOrLoadable(wallet);
  const isMobile = !isWalletReady && isRedirectable();

  return !isMobile && !isWalletReady;
}

/** Truncates the provided wallet address at the middle with an ellipsis. */
export function truncateAddress(address: string | undefined) {
  if (!address) return;
  return `${address.slice(0, 6)}...${address.slice(-5)}`;
}

/** Returns `true` if the provided wallet is an Aptos Connect wallet. */
export function isAptosConnectWallet(
  wallet: WalletInfo | AnyAptosWallet | AptosStandardWallet
) {
  if (!wallet.url) return false;
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

export interface WalletSortingOptions {
  /** An optional function for sorting Aptos Connect wallets. */
  sortAptosConnectWallets?: (a: AnyAptosWallet, b: AnyAptosWallet) => number;
  /** An optional function for sorting wallets that are currently installed or loadable. */
  sortAvailableWallets?: (a: AnyAptosWallet, b: AnyAptosWallet) => number;
  /** An optional function for sorting wallets that are NOT currently installed or loadable. */
  sortInstallableWallets?: (a: AnyAptosWallet, b: AnyAptosWallet) => number;
}

/**
 * Partitions the `wallets` array into three distinct groups:
 *
 * `aptosConnectWallets` - Wallets that use social login to create accounts on
 * the blockchain via Aptos Connect.
 *
 * `availableWallets` - Wallets that are currently installed or loadable by the client.
 *
 * `installableWallets` - Wallets that are NOT current installed or loadable and
 * require the client to install a browser extension first.
 *
 * Additionally, these wallet groups can be sorted by passing sort functions via the `options` argument.
 */
export function groupAndSortWallets(
  wallets: ReadonlyArray<AnyAptosWallet>,
  options?: WalletSortingOptions
) {
  const { aptosConnectWallets, otherWallets } = getAptosConnectWallets(wallets);
  const { defaultWallets, moreWallets } = partitionWallets(otherWallets);

  if (options?.sortAptosConnectWallets) {
    aptosConnectWallets.sort(options.sortAptosConnectWallets);
  }
  if (options?.sortAvailableWallets) {
    defaultWallets.sort(options.sortAvailableWallets);
  }
  if (options?.sortInstallableWallets) {
    moreWallets.sort(options.sortInstallableWallets);
  }

  return {
    /** Wallets that use social login to create an account on the blockchain */
    aptosConnectWallets,
    /** Wallets that are currently installed or loadable. */
    availableWallets: defaultWallets,
    /** Wallets that are NOT currently installed or loadable. */
    installableWallets: moreWallets,
  };
}
