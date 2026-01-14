import { parseSerializedSignature } from "@mysten/sui/cryptography";
import type {
  SuiSignPersonalMessageInput,
  SuiSignPersonalMessageOutput,
  Wallet,
  WalletAccount,
} from "@mysten/wallet-standard";
import {
  mapUserResponse,
  DerivableAbstractPublicKey,
} from "@aptos-labs/derived-wallet-base";
import {
  AbstractedAccount,
  AccountAuthenticator,
  AccountAuthenticatorAbstraction,
  AnyRawTransaction,
  generateSigningMessageForTransaction,
  hashValues,
  Serializer,
} from "@aptos-labs/ts-sdk";
import { UserResponse } from "@aptos-labs/wallet-standard";
import { createSuiEnvelopeForAptosTransaction } from "./createSuiEnvelope";
import { wrapSuiUserResponse } from "./shared";
import { SuiDerivedEd25519Signature } from "./SuiDerivedSignature";

/**
 * A first byte of the signature that indicates the "message type", this is defined in the
 * authentication function on chain, and lets us identify the type of the message and to make
 * changes in the future if needed.
 */
export const SIGNATURE_TYPE = 0;
export interface SignAptosTransactionWithSuiInput {
  suiWallet: Wallet;
  suiAccount: WalletAccount;
  authenticationFunction: string;
  rawTransaction: AnyRawTransaction;
  domain: string;
}

export async function signAptosTransactionWithSui(
  input: SignAptosTransactionWithSuiInput,
): Promise<UserResponse<AccountAuthenticator>> {
  const {
    suiWallet,
    suiAccount,
    authenticationFunction,
    rawTransaction,
    domain,
  } = input;

  const signPersonalMessageFeature = suiWallet.features[
    "sui:signPersonalMessage"
  ] as {
    signPersonalMessage: (
      input: SuiSignPersonalMessageInput,
    ) => Promise<SuiSignPersonalMessageOutput>;
  };
  if (!signPersonalMessageFeature) {
    throw new Error("sui:signPersonalMessage not available");
  }

  const suiAddress = suiAccount.address;
  if (!suiAddress) {
    throw new Error("Account not connected");
  }

  const signingMessage = generateSigningMessageForTransaction(rawTransaction);
  const message = AbstractedAccount.generateAccountAbstractionMessage(
    signingMessage,
    authenticationFunction,
  );
  const signingMessageDigest = hashValues([message]);

  const suiInput = createSuiEnvelopeForAptosTransaction({
    suiAddress,
    rawTransaction,
    signingMessageDigest,
    domain,
  });

  const response = await wrapSuiUserResponse(
    signPersonalMessageFeature.signPersonalMessage({
      message: new TextEncoder().encode(suiInput),
      account: suiAccount,
    }),
  );
  return mapUserResponse(response, (output): AccountAuthenticator => {
    // The signature is returned as a serialized base64 signature
    // represents `1 byte (scheme flag) + 64 bytes (signature) + 32 bytes (public key)` as base64 string
    // so we need to parse it
    const parsedSignature = parseSerializedSignature(output.signature);
    const { signatureScheme } = parsedSignature;

    // TODO: add support for other signature schemes
    if (signatureScheme !== "ED25519") {
      throw new Error(`Unsupported signature scheme: ${signatureScheme}`);
    }
    const signature = new SuiDerivedEd25519Signature(output.signature);

    // Serialize the signature with the signature type as the first byte.
    const serializer = new Serializer();
    serializer.serializeU8(SIGNATURE_TYPE);
    serializer.serializeBytes(signature.toUint8Array());
    const abstractSignature = serializer.toUint8Array();

    // Serialize the abstract public key.
    const abstractPublicKey = new DerivableAbstractPublicKey(
      suiAccount.address,
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
