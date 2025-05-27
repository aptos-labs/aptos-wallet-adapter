import { AptosSignInBoundFields } from "@aptos-labs/wallet-standard";
import { WALLET_ADAPTER_CORE_VERSION } from "./version";

export type {
  AptosSignInOutput,
  AptosSignInInput,
  AptosSignInBoundFields,
} from "@aptos-labs/wallet-standard";
/**
 * @deprecated Use `AptosSignInBoundFields` instead. This will be removed in future versions.
 */
export type AptosSignInRequiredFields = AptosSignInBoundFields;

export * from "./WalletCore";
export * from "./constants";
export * from "./utils";
export * from "./sdkWallets";
export * from "./registry";

// inject adapter core version to the window
if (typeof window !== "undefined") {
  (window as any).WALLET_ADAPTER_CORE_VERSION = WALLET_ADAPTER_CORE_VERSION;
}
