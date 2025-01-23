import { AptosStandardWallet } from "../AIP62StandardWallets";
import { WalletInfo } from "../LegacyWalletPlugins";
import { AdapterNotDetectedWallet, AdapterWallet } from "../WalletCoreNew";
/**
 * A function that will partition the provided wallets into two list — `defaultWallets` and `moreWallets`.
 * By default, the wallets will be partitioned by whether or not they are installed or loadable.
 * You can pass your own partition function if you wish to customize this behavior.
 */
export declare function partitionWallets(wallets: ReadonlyArray<AdapterWallet | AdapterNotDetectedWallet>, partitionFunction?: (wallet: AdapterWallet | AdapterNotDetectedWallet) => boolean): {
    defaultWallets: AdapterWallet[];
    moreWallets: AdapterNotDetectedWallet[];
};
/** Returns true if the wallet is installed. */
export declare function isInstalled(wallet: AdapterWallet | AdapterNotDetectedWallet): boolean;
/**
 * Returns true if the user is on desktop and the provided wallet requires installation of a browser extension.
 * This can be used to decide whether to show a "Connect" button or "Install" link in the UI.
 */
export declare function isInstallRequired(wallet: AdapterWallet | AdapterNotDetectedWallet): boolean;
/** Truncates the provided wallet address at the middle with an ellipsis. */
export declare function truncateAddress(address: string | undefined): string | undefined;
/** Returns `true` if the provided wallet is an Aptos Connect wallet. */
export declare function isAptosConnectWallet(wallet: WalletInfo | AdapterWallet | AptosStandardWallet | AdapterNotDetectedWallet): boolean;
/**
 * Partitions the `wallets` array so that Aptos Connect wallets are grouped separately from the rest.
 * Aptos Connect is a web wallet that uses social login to create accounts on the blockchain.
 */
export declare function getAptosConnectWallets(wallets: ReadonlyArray<AdapterWallet | AdapterNotDetectedWallet>): {
    aptosConnectWallets: AdapterWallet[];
    otherWallets: AdapterNotDetectedWallet[];
};
export interface WalletSortingOptions {
    /** An optional function for sorting Aptos Connect wallets. */
    sortAptosConnectWallets?: (a: AdapterWallet, b: AdapterWallet) => number;
    /** An optional function for sorting wallets that are currently installed or loadable. */
    sortAvailableWallets?: (a: AdapterWallet, b: AdapterWallet) => number;
    /** An optional function for sorting wallets that are NOT currently installed or loadable. */
    sortInstallableWallets?: (a: AdapterNotDetectedWallet, b: AdapterNotDetectedWallet) => number;
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
export declare function groupAndSortWallets(wallets: ReadonlyArray<AdapterWallet | AdapterNotDetectedWallet>, options?: WalletSortingOptions): {
    /** Wallets that use social login to create an account on the blockchain */
    aptosConnectWallets: AdapterWallet[];
    /** Wallets that are currently installed or loadable. */
    availableWallets: AdapterWallet[];
    /** Wallets that are NOT currently installed or loadable. */
    installableWallets: AdapterNotDetectedWallet[];
};
//# sourceMappingURL=walletSelector.d.ts.map