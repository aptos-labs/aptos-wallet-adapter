export {
  SolanaDerivedAccount,
  type SolanaDerivedAccountParams,
} from "./SolanaDerivedAccount";

// Re-export common utilities for convenience
export {
  SolanaDerivedPublicKey,
  type SolanaDerivedPublicKeyParams,
} from "../SolanaDerivedPublicKey";
export { defaultAuthenticationFunction } from "../shared";
export {
  createMessageForSolanaTransaction,
  createAccountAuthenticatorForSolanaTransaction,
  type CreateMessageForSolanaTransactionInput,
} from "../signAptosTransaction";

