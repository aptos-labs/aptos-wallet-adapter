// Core classes
export * from "./EIP1193DerivedPublicKey";
export * from "./EIP1193DerivedSignature";
export * from "./EIP1193DerivedWallet";
export * from "./EIP1193DerivedAccount";

// Signing utilities
export * from "./signAptosMessage";
export * from "./signAptosTransaction";
export * from "./createSiweEnvelope";

// Wallet extension utilities
export * from "./setupAutomaticDerivation";

// Shared utilities and constants
export {
  defaultEthereumAuthenticationFunction,
  type EthereumAddress,
} from "./shared";
