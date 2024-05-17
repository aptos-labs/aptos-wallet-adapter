import { WALLET_ADAPTER_CORE_VERSION } from "./version";

export { WalletCore } from "./WalletCore";
export * from "./LegacyWalletPlugins";
export * from "./constants";
export * from "./utils";
export * from "./AIP62StandardWallets";

if (typeof window !== "undefined") {
  (window as any).WALLET_ADAPTER_CORE_VERSION = WALLET_ADAPTER_CORE_VERSION;
}
