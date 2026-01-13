import { AvailableWallets, WalletInfo } from "./types";
import { AdapterNotDetectedWallet, AdapterWallet } from "../WalletCore";
import {
  APTOS_CONNECT_BASE_URL,
  PETRA_WEB_BASE_URL,
  PETRA_WEB_GENERIC_WALLET_NAME,
  WalletReadyState,
} from "../constants";
import { isRedirectable } from "./helpers";

/**
 * A function that will partition the provided wallets into two list — `defaultWallets` and `moreWallets`.
 * By default, the wallets will be partitioned by whether or not they are installed or loadable.
 * You can pass your own partition function if you wish to customize this behavior.
 */
export function partitionWallets(
  wallets: ReadonlyArray<AdapterWallet | AdapterNotDetectedWallet>,
  partitionFunction: (
    wallet: AdapterWallet | AdapterNotDetectedWallet
  ) => boolean = isInstalledOrLoadable
) {
  const defaultWallets: Array<AdapterWallet> = [];
  const moreWallets: Array<AdapterNotDetectedWallet> = [];

  for (const wallet of wallets) {
    if (partitionFunction(wallet)) {
      defaultWallets.push(wallet as AdapterWallet);
    } else {
      moreWallets.push(wallet as AdapterNotDetectedWallet);
    }
  }

  return { defaultWallets, moreWallets };
}

/** Returns true if the wallet is installed or loadable. */
export function isInstalledOrLoadable(
  wallet: AdapterWallet | AdapterNotDetectedWallet
): wallet is AdapterWallet {
  return wallet.readyState === WalletReadyState.Installed;
}

/**
 * Returns true if the user is on desktop and the provided wallet requires installation of a browser extension.
 * This can be used to decide whether to show a "Connect" button or "Install" link in the UI.
 */
export function isInstallRequired(
  wallet: AdapterWallet | AdapterNotDetectedWallet
) {
  const isWalletReady = isInstalledOrLoadable(wallet);
  const isMobile = !isWalletReady && isRedirectable();

  return !isMobile && !isWalletReady;
}

export function shouldUseFallbackWallet(
  wallet: AdapterWallet | AdapterNotDetectedWallet
): boolean {
  return (
    !!wallet.fallbackWallet &&
    isInstallRequired(wallet) &&
    isInstalledOrLoadable(wallet.fallbackWallet)
  );
}

/** Truncates the provided wallet address at the middle with an ellipsis. */
export function truncateAddress(address: string | undefined) {
  if (!address) return;
  return `${address.slice(0, 6)}...${address.slice(-5)}`;
}

/**
 * Returns `true` if the provided wallet is an Aptos Connect wallet.
 *
 * @deprecated Use {@link isPetraWebWallet} instead.
 */
export function isAptosConnectWallet(wallet: WalletInfo | AdapterWallet) {
  return isPetraWebWallet(wallet);
}

/** Returns `true` if the provided wallet is a Petra Web wallet. This will automatically exclude the generic wallet. */
export function isPetraWebWallet(
  wallet: WalletInfo | AdapterWallet,
  ignoreGenericWallet: boolean = true
) {
  if (!wallet.url) return false;
  if (ignoreGenericWallet && isPetraWebGenericWallet(wallet)) {
    return false;
  }
  return (
    wallet.url.startsWith(APTOS_CONNECT_BASE_URL) ||
    wallet.url.startsWith(PETRA_WEB_BASE_URL)
  );
}

/** Returns true if the wallet is a generic wallet. */
export function isPetraWebGenericWallet(
  wallet: AdapterWallet | AdapterNotDetectedWallet | WalletInfo
) {
  return wallet.name === PETRA_WEB_GENERIC_WALLET_NAME;
}

/**
 * Partitions the `wallets` array so that Aptos Connect wallets are grouped separately from the rest.
 * Petra Web is a web wallet that uses social login to create accounts on the blockchain.
 *
 * @deprecated Use {@link getPetraWebWallets} instead.
 */
export function getAptosConnectWallets(
  wallets: ReadonlyArray<AdapterWallet | AdapterNotDetectedWallet>
) {
  const { defaultWallets, moreWallets } = partitionWallets(
    wallets,
    isAptosConnectWallet
  );
  return {
    aptosConnectWallets: defaultWallets,
    otherWallets: moreWallets,
  };
}

/**
 * Partitions the `wallets` array so that Petra Web wallets are grouped separately from the rest.
 * Petra Web is a web wallet that uses social login to create accounts on the blockchain.
 */
export function getPetraWebWallets(
  wallets: ReadonlyArray<AdapterWallet | AdapterNotDetectedWallet>
) {
  const { defaultWallets, moreWallets } = partitionWallets(
    wallets,
    isPetraWebWallet
  );
  return {
    petraWebWallets: defaultWallets,
    otherWallets: moreWallets,
  };
}

export interface WalletSortingOptions {
  /**
   * An optional function for sorting Aptos Connect wallets.
   *
   * @deprecated Use {@link sortPetraWebWallets} instead.
   */
  sortAptosConnectWallets?: (a: AdapterWallet, b: AdapterWallet) => number;
  /** An optional function for sorting Petra Web wallets. */
  sortPetraWebWallets?: (a: AdapterWallet, b: AdapterWallet) => number;
  /** An optional function for sorting wallets that are currently installed or loadable. */
  sortAvailableWallets?: (
    a: AdapterWallet | AdapterNotDetectedWallet,
    b: AdapterWallet | AdapterNotDetectedWallet
  ) => number;
  /** An optional function for sorting wallets that are NOT currently installed or loadable. */
  sortInstallableWallets?: (
    a: AdapterWallet | AdapterNotDetectedWallet,
    b: AdapterWallet | AdapterNotDetectedWallet
  ) => number;
  /** An optional array of wallets that are available but not intended for display. These wallets will only be shown if there is logic to explictly show them (e.g. `fallbacks`) */
  hiddenWallets?: ReadonlyArray<AdapterWallet>;
  /**
   * A map of wallet names to fallback wallet names.
   * If a wallet is not installed and has a fallback wallet that IS installed,
   * the fallback wallet will be attached to the not-installed wallet and it will
   * be moved to the available wallets list.
   *
   * @example
   * ```ts
   * // Override the default fallbacks
   * fallbacks: { connections: { "Petra": "Petra Web", "OtherWallet": "OtherFallback" } }
   * ```
   */
  fallbacks?: {
    /** A map of wallet names to fallback wallet names. */
    connections: Record<string | AvailableWallets, string | AvailableWallets>;
    /** An optional array of wallets that are available but not intended for display. These wallets will only be shown if there is logic to explictly show them (e.g. `fallbacks`) */
    additionalFallbackWallets?: ReadonlyArray<AdapterWallet>;
  };
}

/**
 * Partitions the `wallets` array into three distinct groups:
 *
 * `aptosConnectWallets` - Use {@link petraWebWallets} instead.
 *
 * `petraWebWallets` - Wallets that use social login to create accounts on
 * the blockchain via Petra Web.
 *
 * `availableWallets` - Wallets that are currently installed or loadable by the client.
 *
 * `availableWalletsWithFallbacks` - Wallets that are currently uninstalled that have a fallback wallet.
 *
 * `installableWallets` - Wallets that are NOT current installed or loadable and
 * require the client to install a browser extension first.
 *
 * Additionally, these wallet groups can be sorted by passing sort functions via the `options` argument.
 */
export function groupAndSortWallets(
  wallets: ReadonlyArray<AdapterWallet | AdapterNotDetectedWallet>,
  options?: WalletSortingOptions
) {
  const {
    fallbacks: {
      connections: fallbackConnections,
      additionalFallbackWallets,
    } = {},
  } = options ?? {};
  const { aptosConnectWallets } = getAptosConnectWallets(wallets);
  const { otherWallets, petraWebWallets } = getPetraWebWallets(wallets);
  const { defaultWallets, moreWallets } = partitionWallets(otherWallets);

  // Attach fallback wallets to not-installed wallets and move them to available wallets if the fallback is installed
  // TODO: Deprecate this and combine this with `availableWallets` in the next major version.
  const availableWalletsWithFallbacks: Array<
    AdapterWallet | AdapterNotDetectedWallet
  > = [];

  if (fallbackConnections && Object.keys(fallbackConnections).length > 0) {
    for (let i = moreWallets.length - 1; i >= 0; i--) {
      const wallet = moreWallets[i];
      const fallbackName = fallbackConnections[wallet.name];

      if (fallbackName) {
        const fallbackWallet = [
          ...wallets,
          ...(additionalFallbackWallets ?? []),
        ].find((w) => w.name === fallbackName && isInstalledOrLoadable(w)) as
          | AdapterWallet
          | undefined;

        // If we found an installed fallback, attach it and move to available wallets
        if (fallbackWallet) {
          const walletWithFallback: AdapterNotDetectedWallet = {
            ...wallet,
            fallbackWallet,
          };

          // Remove from installable wallets
          moreWallets.splice(i, 1);

          // Add to the list to be added to available wallets
          availableWalletsWithFallbacks.push(walletWithFallback);
        }
      }
    }
  }

  if (options?.sortAptosConnectWallets) {
    aptosConnectWallets.sort(options.sortAptosConnectWallets);
  }
  if (options?.sortPetraWebWallets) {
    petraWebWallets.sort(options.sortPetraWebWallets);
  }
  if (options?.sortAvailableWallets) {
    defaultWallets.sort(options.sortAvailableWallets);
  }
  if (options?.sortInstallableWallets) {
    moreWallets.sort(options.sortInstallableWallets);
  }

  return {
    /** @deprecated Use {@link petraWebWallets} instead. */
    aptosConnectWallets,
    /** Wallets that use social login to create an account on the blockchain */
    petraWebWallets,
    /** Wallets that are currently installed or loadable. */
    availableWallets: defaultWallets,
    /** Wallets that are currently uninstalled that have a fallback wallet. */
    availableWalletsWithFallbacks,
    /** Wallets that are NOT currently installed or loadable. */
    installableWallets: moreWallets,
  };
}
