import {
  DerivableAbstractPublicKey,
  mapUserResponse,
} from "@aptos-labs/derived-wallet-base";
import {
  AbstractedAccount,
  type AccountAuthenticator,
  AccountAuthenticatorAbstraction,
  type AnyRawTransaction,
  Ed25519Signature,
  generateSigningMessageForTransaction,
  hashValues,
  Serializer,
} from "@aptos-labs/ts-sdk";
import { WalletError } from "@solana/wallet-adapter-base";
import { createSignInMessage } from "@solana/wallet-standard-util";
import type { StandardWalletAdapter as SolanaWalletAdapter } from "@solana/wallet-standard-wallet-adapter-base";
import type { PublicKey as SolanaPublicKey } from "@solana/web3.js";
import { createSiwsEnvelopeForAptosTransaction } from "./createSiwsEnvelope";
import { wrapSolanaUserResponse } from "./shared";

/**
 * A first byte of the signature that indicates the "message type", this is defined in the
 * authentication function on chain, and lets us identify the type of the message and to make
 * changes in the future if needed.
 */
export const SIGNATURE_TYPE = 0;

/**
 * Signature type for delegated signing (cross-domain).
 * The abstractSignature includes the delegated_domain used for SIWS signing.
 */
export const DELEGATED_SIGNATURE_TYPE = 1;

export interface SignAptosTransactionWithSolanaInput {
  solanaWallet: SolanaWalletAdapter;
  authenticationFunction: string;
  rawTransaction: AnyRawTransaction;
  /** Domain used for address derivation / abstractPublicKey. Defaults to window.location.host. */
  accountDomain?: string;
  /** Domain used for SIWS signing envelope. Defaults to window.location.host. */
  signingDomain?: string;
  /** @deprecated Use accountDomain instead */
  domain?: string;
}

export async function signAptosTransactionWithSolana(
  input: SignAptosTransactionWithSolanaInput,
) {
  const { solanaWallet, authenticationFunction, rawTransaction } = input;

  const solanaPublicKey = solanaWallet.publicKey;
  if (!solanaPublicKey) {
    throw new Error("Account not connected");
  }

  const signingDomain =
    input.signingDomain ?? input.domain ?? window.location.host;
  const accountDomain = input.accountDomain ?? signingDomain;

  const { siwsInput, signingMessageDigest } = createMessageForSolanaTransaction(
    {
      rawTransaction,
      authenticationFunction,
      solanaPublicKey,
      domain: signingDomain,
    },
  );

  // Try SIWS (signIn) first, fall back to signMessage if it throws.
  // Some wallets (e.g. Trust) declare signIn but throw at runtime.
  // Re-throw WalletError instances — they represent wallet-level issues
  // (e.g. user rejections with non-standard messages) and must not silently
  // fall back to signMessage, which would double-prompt the user.
  if (solanaWallet.signIn) {
    // Invoke signIn inside .then() so synchronous throws become rejections
    // that .catch() can handle uniformly with async failures.
    const signInResponse = await wrapSolanaUserResponse(
      Promise.resolve().then(() => solanaWallet.signIn!(siwsInput)),
    ).catch((error) => {
      if (error instanceof WalletError || !solanaWallet.signMessage)
        throw error;
      return undefined;
    });
    if (signInResponse) {
      return mapUserResponse(signInResponse, (output): AccountAuthenticator => {
        if (output.signatureType && output.signatureType !== "ed25519") {
          throw new Error("Unsupported signature type");
        }

        // The wallet might change some of the fields in the SIWS input, so we
        // might need to include the finalized input in the signature.
        // For now, we can assume the input is unchanged.
        return createAccountAuthenticatorForSolanaTransaction(
          output.signature,
          solanaPublicKey,
          accountDomain,
          authenticationFunction,
          signingMessageDigest,
          signingDomain,
        );
      });
    }
  }

  if (solanaWallet.signMessage) {
    const response = await wrapSolanaUserResponse(
      solanaWallet.signMessage(createSignInMessage(siwsInput)),
    );
    return mapUserResponse(response, (output): AccountAuthenticator => {
      return createAccountAuthenticatorForSolanaTransaction(
        output,
        solanaPublicKey,
        accountDomain,
        authenticationFunction,
        signingMessageDigest,
        signingDomain,
      );
    });
  }

  throw new Error(`${solanaWallet.name} does not support SIWS or signMessage`);
}

export function createAccountAuthenticatorForSolanaTransaction(
  signatureBytes: Uint8Array<ArrayBufferLike>,
  solanaPublicKey: SolanaPublicKey,
  accountDomain: string,
  authenticationFunction: string,
  signingMessageDigest: Uint8Array,
  signingDomain?: string,
): AccountAuthenticatorAbstraction {
  const isDelegated =
    signingDomain !== undefined && signingDomain !== accountDomain;

  const signature = new Ed25519Signature(signatureBytes);
  const serializer = new Serializer();
  if (isDelegated) {
    serializer.serializeU8(DELEGATED_SIGNATURE_TYPE);
    serializer.serializeStr(signingDomain);
  } else {
    serializer.serializeU8(SIGNATURE_TYPE);
  }
  serializer.serializeBytes(signature.toUint8Array());
  const abstractSignature = serializer.toUint8Array();

  const abstractPublicKey = new DerivableAbstractPublicKey(
    solanaPublicKey.toBase58(),
    accountDomain,
  );

  return new AccountAuthenticatorAbstraction(
    authenticationFunction,
    signingMessageDigest,
    abstractSignature,
    abstractPublicKey.bcsToBytes(),
  );
}

export interface CreateMessageForSolanaTransactionInput {
  rawTransaction: AnyRawTransaction;
  authenticationFunction: string;
  solanaPublicKey: SolanaPublicKey;
  domain: string;
}
// A helper function to create a message for a Solana transaction
export function createMessageForSolanaTransaction(
  input: CreateMessageForSolanaTransactionInput,
) {
  const { rawTransaction, authenticationFunction, solanaPublicKey, domain } =
    input;
  const signingMessage = generateSigningMessageForTransaction(rawTransaction);
  const message = AbstractedAccount.generateAccountAbstractionMessage(
    signingMessage,
    authenticationFunction,
  );

  const signingMessageDigest = hashValues([message]);

  const siwsInput = createSiwsEnvelopeForAptosTransaction({
    solanaPublicKey,
    rawTransaction,
    signingMessageDigest,
    domain,
  });

  return { siwsInput, signingMessageDigest };
}
