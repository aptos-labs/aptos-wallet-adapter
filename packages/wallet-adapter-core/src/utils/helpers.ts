import {
  Aptos,
  AptosConfig,
  EntryFunctionArgumentTypes,
  Network,
  NetworkToNodeAPI,
  Serializable,
  SimpleEntryFunctionArgumentTypes,
} from "@aptos-labs/ts-sdk";
import { NetworkInfo as StandardNetworkInfo } from "@aptos-labs/wallet-standard";
import { convertNetwork } from "../LegacyWalletPlugins/conversion";
import { NetworkInfo } from "../LegacyWalletPlugins/types";
import { AnyAptosWallet } from "../WalletCore";
import { WalletReadyState } from "../constants";

export function isMobile(): boolean {
  return /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i.test(
    navigator.userAgent
  );
}

export function isInAppBrowser(): boolean {
  const isIphone = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
    navigator.userAgent
  );

  const isAndroid = /(Android).*Version\/[\d.]+.*Chrome\/[^\s]+ Mobile/i.test(
    navigator.userAgent
  );

  return isIphone || isAndroid;
}

export function isRedirectable(): boolean {
  // SSR: return false
  if (typeof navigator === "undefined" || !navigator) return false;

  // if we are on mobile and NOT in a in-app browser we will redirect to a wallet app

  return isMobile() && !isInAppBrowser();
}

export function generalizedErrorMessage(error: any): string {
  return typeof error === "object" && "message" in error
    ? error.message
    : error;
}

// Helper function to check if input arguments are BCS serialized arguments.
// In @aptos-labs/ts-sdk each move representative class extends
// Serializable, so if each argument is of an instance of a class
// the extends Serializable - we know these are BCS arguments
export const areBCSArguments = (
  args: Array<EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes>
): boolean => {
  // `every` returns true if the array is empty, so
  // first check the array length
  if (args.length === 0) return false;
  return args.every(
    (arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes) =>
      arg instanceof Serializable
  );
};

/**
 * Helper function to get AptosConfig that supports Aptos and Custom networks
 *
 * @param networkInfo
 * @returns AptosConfig
 */
export const getAptosConfig = (
  networkInfo: NetworkInfo | StandardNetworkInfo | null
): AptosConfig => {
  if (!networkInfo) {
    throw new Error("Undefined network");
  }
  if (isAptosNetwork(networkInfo)) {
    return new AptosConfig({
      network: convertNetwork(networkInfo),
    });
  }
  return new AptosConfig({
    network: Network.CUSTOM,
    fullnode: networkInfo.url,
  });
};

/**
 * Helper function to resolve if the current connected network is an Aptos network
 *
 * @param networkInfo
 * @returns boolean
 */
export const isAptosNetwork = (
  networkInfo: NetworkInfo | StandardNetworkInfo | null
): boolean => {
  if (!networkInfo) {
    throw new Error("Undefined network");
  }
  return NetworkToNodeAPI[networkInfo.name] !== undefined;
};

/**
 * Helper function to fetch Devnet chain id
 */
export const fetchDevnetChainId = async (): Promise<number> => {
  const aptos = new Aptos(); // default to devnet
  return await aptos.getChainId();
};

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
