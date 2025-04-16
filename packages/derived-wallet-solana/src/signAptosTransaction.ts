import {
  mapUserResponse,
  DerivableAbstractPublicKey,
} from "@aptos-labs/derived-wallet-base";
import {
  AccountAuthenticator,
  AccountAuthenticatorAbstraction,
  AnyRawTransaction,
  Ed25519Signature,
  generateSigningMessageForTransaction,
  hashValues,
  Serializer,
} from "@aptos-labs/ts-sdk";
import { StandardWalletAdapter as SolanaWalletAdapter } from "@solana/wallet-standard-wallet-adapter-base";
import { createSiwsEnvelopeForAptosTransaction } from "./createSiwsEnvelope";
import { wrapSolanaUserResponse } from "./shared";

/**
 * A first byte of the signature that indicates the "message type", this is defined in the
 * authentication function on chain, and lets us identify the type of the message and to make
 * changes in the future if needed.
 */
export const SIGNATURE_TYPE = 0;
export interface SignAptosTransactionWithSolanaInput {
  solanaWallet: SolanaWalletAdapter;
  authenticationFunction: string;
  rawTransaction: AnyRawTransaction;
  domain: string;
}

export async function signAptosTransactionWithSolana(
  input: SignAptosTransactionWithSolanaInput,
) {
  const { solanaWallet, authenticationFunction, rawTransaction, domain } =
    input;
  if (!solanaWallet.signIn) {
    throw new Error("solana:signIn not available");
  }

  const solanaPublicKey = solanaWallet.publicKey;
  if (!solanaPublicKey) {
    throw new Error("Account not connected");
  }

  const signingMessage = generateSigningMessageForTransaction(rawTransaction);
  const signingMessageDigest = hashValues([signingMessage]);

  const siwsInput = createSiwsEnvelopeForAptosTransaction({
    solanaPublicKey,
    rawTransaction,
    signingMessageDigest,
    domain,
  });

  const response = await wrapSolanaUserResponse(
    solanaWallet.signIn!(siwsInput),
  );
  return mapUserResponse(response, (output): AccountAuthenticator => {
    if (output.signatureType && output.signatureType !== "ed25519") {
      throw new Error("Unsupported signature type");
    }

    // The wallet might change some of the fields in the SIWS input, so we
    // might need to include the finalized input in the signature.
    // For now, we can assume the input is unchanged.
    const signature = new Ed25519Signature(output.signature);

    // Serialize the signature with the signature type as the first byte.
    const serializer = new Serializer();
    serializer.serializeU8(SIGNATURE_TYPE);
    serializer.serializeBytes(signature.toUint8Array());
    const abstractSignature = serializer.toUint8Array();

    // Serialize the abstract public key.
    const abstractPublicKey = new DerivableAbstractPublicKey(
      solanaPublicKey.toBase58(),
      domain,
    );

    return new AccountAuthenticatorAbstraction(
      authenticationFunction,
      signingMessageDigest,
      abstractSignature,
      abstractPublicKey.bcsToBytes(),
    );
  });
}
