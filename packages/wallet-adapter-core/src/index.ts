import { WALLET_ADAPTER_CORE_VERSION } from "./version";

export type {
  AptosSignInOutput,
  AptosSignInInput,
  AptosSignInRequiredFields,
} from "@aptos-labs/wallet-standard";

export * from "./WalletCore";
export * from "./constants";
export * from "./utils";
export * from "./sdkWallets";
export * from "./registry";

// inject adapter core version to the window
if (typeof window !== "undefined") {
  (window as any).WALLET_ADAPTER_CORE_VERSION = WALLET_ADAPTER_CORE_VERSION;
}
