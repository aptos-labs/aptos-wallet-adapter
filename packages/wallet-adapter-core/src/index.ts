import { WALLET_ADAPTER_CORE_VERSION } from "./version";

export { type AnyAptosWallet, WalletCore } from "./WalletCore";
export * from "./LegacyWalletPlugins";
export * from "./constants";
export * from "./utils";
export * from "./AIP62StandardWallets";

// inject adapter core version to the window
if (typeof window !== "undefined") {
  (window as any).WALLET_ADAPTER_CORE_VERSION = WALLET_ADAPTER_CORE_VERSION;
}
