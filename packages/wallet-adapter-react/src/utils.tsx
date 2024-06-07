import {
  AptosStandardSupportedWallet,
  Wallet,
  WalletReadyState,
  isRedirectable,
} from "@aptos-labs/wallet-adapter-core";

export type AptosWallet = Wallet | AptosStandardSupportedWallet<string>;

export function partitionWallets(
  wallets: ReadonlyArray<AptosWallet>,
  partitionFunction: (wallet: AptosWallet) => boolean = isInstalledOrLoadable
) {
  const defaultWallets: Array<AptosWallet> = [];
  const moreWallets: Array<AptosWallet> = [];

  for (const wallet of wallets) {
    if (partitionFunction(wallet)) defaultWallets.push(wallet);
    else moreWallets.push(wallet);
  }

  return { defaultWallets, moreWallets };
}

function isInstalledOrLoadable(wallet: AptosWallet) {
  return (
    wallet.readyState === WalletReadyState.Installed ||
    wallet.readyState === WalletReadyState.Loadable
  );
}

export function isInstallRequired(wallet: AptosWallet) {
  const isWalletReady =
    wallet.readyState === WalletReadyState.Installed ||
    wallet.readyState === WalletReadyState.Loadable;

  const isMobile = !isWalletReady && isRedirectable();

  return !isMobile && !isWalletReady;
}

export function truncateAddress(address: string | undefined) {
  if (!address) return;
  return `${address.slice(0, 6)}...${address.slice(-5)}`;
}
