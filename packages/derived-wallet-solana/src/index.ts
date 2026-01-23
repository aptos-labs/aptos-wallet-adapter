// Core classes
export * from "./SolanaDerivedPublicKey";
export * from "./SolanaDerivedWallet";

// Signing utilities
export * from "./signAptosMessage";
export * from "./signAptosTransaction";
export * from "./createSiwsEnvelope";

// Wallet extension utilities
export * from "./extendSolanaWallet";
export * from "./setupAutomaticDerivation";

// Shared utilities and constants
export { defaultAuthenticationFunction } from "./shared";

// Re-export utilities from dependencies for downstream consumers
export { createSignInMessage } from "@solana/wallet-standard-util";
export {
  getChainName,
  getEntryFunctionName,
  createTransactionStatement,
} from "@aptos-labs/derived-wallet-base";
