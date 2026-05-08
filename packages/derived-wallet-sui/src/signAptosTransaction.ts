import {
  DerivableAbstractPublicKey,
  mapUserResponse,
} from "@aptos-labs/derived-wallet-base";
import {
  AbstractedAccount,
  type AccountAuthenticator,
  AccountAuthenticatorAbstraction,
  type AnyRawTransaction,
  generateSigningMessageForTransaction,
  hashValues,
  Serializer,
} from "@aptos-labs/ts-sdk";
import type { UserResponse } from "@aptos-labs/wallet-standard";
import { parseSerializedSignature } from "@mysten/sui/cryptography";
import type {
  SuiSignPersonalMessageInput,
  SuiSignPersonalMessageOutput,
  Wallet,
  WalletAccount,
} from "@mysten/wallet-standard";
import { createSuiEnvelopeForAptosTransaction } from "./createSuiEnvelope";
import { SuiDerivedEd25519Signature } from "./SuiDerivedSignature";
import { wrapSuiUserResponse } from "./shared";

/**
 * A first byte of the signature that indicates the "message type", this is defined in the
 * authentication function on chain, and lets us identify the type of the message and to make
 * changes in the future if needed.
 */
export const SIGNATURE_TYPE = 0;

/**
 * Signature type for delegated signing (cross-domain).
 * The abstractSignature includes the delegated_domain used for signing.
 */
export const DELEGATED_SIGNATURE_TYPE = 1;

export interface SignAptosTransactionWithSuiInput {
  suiWallet: Wallet;
  suiAccount: WalletAccount;
  authenticationFunction: string;
  rawTransaction: AnyRawTransaction;
  /** Domain used for address derivation / abstractPublicKey. Defaults to window.location.host. */
  accountDomain?: string;
  /** Domain used for Sui signing envelope. Defaults to window.location.host. */
  signingDomain?: string;
  /** @deprecated Use accountDomain instead */
  domain?: string;
}

export async function signAptosTransactionWithSui(
  input: SignAptosTransactionWithSuiInput,
): Promise<UserResponse<AccountAuthenticator>> {
  const { suiWallet, suiAccount, authenticationFunction, rawTransaction } =
    input;

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

  const signingDomain =
    input.signingDomain ?? input.domain ?? window.location.host;
  const accountDomain = input.accountDomain ?? signingDomain;

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
    domain: signingDomain,
  });

  const response = await wrapSuiUserResponse(
    signPersonalMessageFeature.signPersonalMessage({
      message: new TextEncoder().encode(suiInput),
      account: suiAccount,
    }),
  );
  return mapUserResponse(response, (output): AccountAuthenticator => {
    const parsedSignature = parseSerializedSignature(output.signature);
    const { signatureScheme } = parsedSignature;

    // TODO: add support for other signature schemes
    if (signatureScheme !== "ED25519") {
      throw new Error(`Unsupported signature scheme: ${signatureScheme}`);
    }
    const signature = new SuiDerivedEd25519Signature(output.signature);

    return createAccountAuthenticatorForSuiTransaction(
      signature,
      suiAccount.address,
      accountDomain,
      authenticationFunction,
      signingMessageDigest,
      signingDomain,
    );
  });
}

export function createAccountAuthenticatorForSuiTransaction(
  signature: SuiDerivedEd25519Signature,
  suiAddress: string,
  accountDomain: string,
  authenticationFunction: string,
  signingMessageDigest: Uint8Array,
  signingDomain?: string,
): AccountAuthenticatorAbstraction {
  const isDelegated =
    signingDomain !== undefined && signingDomain !== accountDomain;

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
    suiAddress,
    accountDomain,
  );

  return new AccountAuthenticatorAbstraction(
    authenticationFunction,
    signingMessageDigest,
    abstractSignature,
    abstractPublicKey.bcsToBytes(),
  );
}
