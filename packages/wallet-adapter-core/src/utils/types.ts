import {
  AccountAddressInput,
  InputGenerateTransactionOptions,
} from "@aptos-labs/ts-sdk";
import { InputGenerateTransactionPayloadData } from "@aptos-labs/ts-sdk";
import { WalletReadyState } from "../constants";

export interface AptosStandardSupportedWallet {
  // The name of your wallet cast to WalletName (Ex. "Petra" as WalletName<"Petra">)
  name: string;
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
  // An optional deeplink provider for the wallet. If the wallet is not installed, we can redirect the user to the wallet's deeplink provider
  // @example "https://myWallet.app/explore?link="
  deeplinkProvider?: string;
}

// Update this with the name of your wallet when you create a new wallet plugin.
export type AvailableWallets =
  | "Continue with Apple"
  | "Continue with Google"
  | "MSafe"
  | "Mizu Wallet"
  | "Nightly"
  | "OKX Wallet"
  | "Petra"
  | "Pontem Wallet"
  | "Rimosafe"
  | "T wallet";

export type InputTransactionData = {
  sender?: AccountAddressInput;
  data: InputGenerateTransactionPayloadData;
  options?: InputGenerateTransactionOptions & {
    expirationSecondsFromNow?: number;
    expirationTimestamp?: number;
  };
  withFeePayer?: boolean;
};

export type WalletInfo = {
  name: string;
  icon: string;
  url: string;
};
