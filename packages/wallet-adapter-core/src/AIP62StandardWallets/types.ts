import { WalletName } from "../LegacyWalletPlugins/types";
import { WalletReadyState } from "../constants";

export interface AptosStandardSupportedWallet<Name extends string = string> {
  // The name of your wallet cast to WalletName (Ex. "Petra" as WalletName<"Petra">)
  name: WalletName<Name>;
  // The link to your chrome extension or main website where new users can create an account with your wallet.
  url: string;
  // An icon for your wallet. Can be one of 4 data types. Be sure to follow the below format exactly (including the "," after base64).
  icon: `data:image/${"svg+xml" | "webp" | "png" | "gif"};base64,${string}`;
  // NOTE: Copy these two fields exactly when creating a new instance of this interface
  // What state the Wallet is in currently. Defaults to NotDetected.
  readyState: WalletReadyState.NotDetected;
  // A flag to indicate that this AptosStandardSupportedWallet implements the AIP-62 Wallet Standard.
  // See https://github.com/aptos-foundation/AIPs/blob/main/aips/aip-62.md for more details.
  isAIP62Standard: true;
}

// Update this with the name of your wallet when you create a new wallet plugin.
export type AvailableWallets =
  | "Nightly"
  | "Petra"
  | "T wallet"
  | "Pontem Wallet"
  | "Mizu Wallet";
