// Core classes

export {
  createTransactionStatement,
  getChainName,
  getEntryFunctionName,
} from "@aptos-labs/derived-wallet-base";
// Re-export utilities from dependencies for downstream consumers
export { createSignInMessage } from "@solana/wallet-standard-util";
export * from "./createSiwsEnvelope";
// Wallet extension utilities
export * from "./extendSolanaWallet";
export * from "./SolanaDerivedAccount";
export * from "./SolanaDerivedPublicKey";
export * from "./SolanaDerivedWallet";
export * from "./setupAutomaticDerivation";

// Shared utilities and constants
export { defaultSolanaAuthenticationFunction } from "./shared";
// Signing utilities
export * from "./signAptosMessage";
export * from "./signAptosTransaction";
