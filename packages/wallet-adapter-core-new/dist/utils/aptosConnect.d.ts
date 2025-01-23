import { AptosStandardWallet } from "../AIP62StandardWallets";
import { WalletInfo } from "../LegacyWalletPlugins";
import { AnyAptosWallet } from "../WalletCore";
/** The base URL for all Aptos Connect wallets. */
export declare const APTOS_CONNECT_BASE_URL = "https://aptosconnect.app";
/** The URL to the Aptos Connect account page if the user is signed in to Aptos Connect. */
export declare const APTOS_CONNECT_ACCOUNT_URL = "https://aptosconnect.app/dashboard/main-account";
/** Returns `true` if the provided wallet is an Aptos Connect wallet. */
export declare function isAptosConnectWallet(wallet: WalletInfo | AnyAptosWallet | AptosStandardWallet): boolean;
/**
 * Partitions the `wallets` array so that Aptos Connect wallets are grouped separately from the rest.
 * Aptos Connect is a web wallet that uses social login to create accounts on the blockchain.
 */
export declare function getAptosConnectWallets(wallets: ReadonlyArray<AnyAptosWallet>): {
    aptosConnectWallets: AnyAptosWallet[];
    otherWallets: AnyAptosWallet[];
};
//# sourceMappingURL=aptosConnect.d.ts.map