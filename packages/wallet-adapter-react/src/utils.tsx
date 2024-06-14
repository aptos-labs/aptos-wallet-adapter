import {
  AnyAptosWallet,
  WalletReadyState,
  isRedirectable,
} from "@aptos-labs/wallet-adapter-core";

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

/** Partitions the `wallets` array so that Aptos Connect wallets are grouped separately from the rest. */
export function getAptosConnectWallets(wallets: ReadonlyArray<AnyAptosWallet>) {
  const { defaultWallets, moreWallets } = partitionWallets(wallets, (wallet) =>
    wallet.url.includes("aptosconnect.app")
  );
  return { aptosConnectWallets: defaultWallets, otherWallets: moreWallets };
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
