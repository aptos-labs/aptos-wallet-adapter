import {
  AccountAddressInput,
  InputGenerateTransactionOptions,
  InputTransactionPluginData,
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
  // A flag to indicate that this AptosStandardSupportedWallet is an Aptos native wallet.
  isAptosNativeWallet?: boolean;
}

// Update this with the name of your wallet when you create a new wallet plugin.
export type AvailableWallets =
  | "Continue with Apple"
  | "Continue with Google"
  | "OKX Wallet"
  | "Petra"
  | "Nightly"
  | "Pontem Wallet"
  | "Backpack"
  | "MSafe";

type InputTransactionDataInner = {
  sender?: AccountAddressInput;
  data: InputGenerateTransactionPayloadData;
  options?: InputGenerateTransactionOptions & {
    expirationSecondsFromNow?: number;
    expirationTimestamp?: number;
  };
  /** This will always be set to true if a custom transaction submitter is provided. */
  withFeePayer?: boolean;
};

/**
 * If `transactionSubmitter` is set it will be used, and override any transaction
 * submitter configured in the DappConfig.
 *
 * The `pluginParams` parameter is used to provide additional parameters to a
 * transaction submitter plugin, whether provided here or configured in the
 * DappConfig.
 */
export type InputTransactionData = InputTransactionDataInner &
  InputTransactionPluginData;

export type WalletInfo = {
  name: string;
  icon: string;
  url: string;
};
