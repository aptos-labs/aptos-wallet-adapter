import type { AptosSignInBoundFields } from "@aptos-labs/wallet-standard";
import { WALLET_ADAPTER_CORE_VERSION } from "./version";

export type {
  AptosSignInBoundFields,
  AptosSignInInput,
  AptosSignInOutput,
} from "@aptos-labs/wallet-standard";
/**
 * @deprecated Use `AptosSignInBoundFields` instead. This will be removed in future versions.
 */
export type AptosSignInRequiredFields = AptosSignInBoundFields;

export * from "./constants";
export * from "./registry";
export * from "./sdkWallets";
export * from "./utils";
export * from "./WalletCore";

// inject adapter core version to the window
if (typeof window !== "undefined") {
  (window as any).WALLET_ADAPTER_CORE_VERSION = WALLET_ADAPTER_CORE_VERSION;
}
