// Core classes

export * from "./createSiweEnvelope";
export * from "./EIP1193DerivedAccount";
export * from "./EIP1193DerivedPublicKey";
export * from "./EIP1193DerivedSignature";
export * from "./EIP1193DerivedWallet";
// Wallet extension utilities
export * from "./setupAutomaticDerivation";
// Shared utilities and constants
export {
  defaultEthereumAuthenticationFunction,
  type EthereumAddress,
} from "./shared";
// Signing utilities
export * from "./signAptosMessage";
export * from "./signAptosTransaction";
