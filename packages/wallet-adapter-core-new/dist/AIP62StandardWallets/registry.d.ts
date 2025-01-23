import { AdapterNotDetectedWallet } from "../WalletCoreNew";
/**
 * Registry of AIP-62 wallet standard supported wallets.
 * This list is used to show supported wallets even if they are not installed on the user machine.
 *
 * AIP-62 compatible wallets are required to add their wallet info here if they want to be detected by the adapter
 *
 * name - The name of your wallet cast to WalletName (Ex. "Petra" as WalletName<"Petra">)
 * url - TThe link to your chrome extension or main website where new users can create an account with your wallet.
 * icon - An icon for your wallet. Can be one of 4 data types. Be sure to follow the below format exactly (including the literal "," after base64).
 *        Format: `data:image/${"svg+xml" | "webp" | "png" | "gif"};base64,${string}`
 *        Note: ${...} data in the above format should be replaced. Other characters are literals (ex. ";")
 */
export declare const aptosStandardSupportedWalletList: Array<AdapterNotDetectedWallet>;
//# sourceMappingURL=registry.d.ts.map