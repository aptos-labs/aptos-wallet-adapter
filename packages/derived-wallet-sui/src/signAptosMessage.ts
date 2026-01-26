import {
  encodeStructuredMessage,
  mapUserResponse,
  StructuredMessage,
  StructuredMessageInput,
} from "@aptos-labs/derived-wallet-base";
import {
  AptosSignMessageOutput,
  UserResponse,
} from "@aptos-labs/wallet-standard";
import type {
  SuiSignPersonalMessageInput,
  SuiSignPersonalMessageOutput,
  Wallet,
  WalletAccount,
} from "@mysten/wallet-standard";
import { parseSerializedSignature } from "@mysten/sui/cryptography";
import { fromBase64 } from "@mysten/bcs";
import { SuiDerivedPublicKey } from "./SuiDerivedPublicKey";
import { wrapSuiUserResponse } from "./shared";
import { SuiDerivedEd25519Signature } from "./SuiDerivedSignature";

export interface StructuredMessageInputWithChainId extends StructuredMessageInput {
  chainId?: number;
}

export interface SignAptosMessageWithSuiInput {
  suiWallet: Wallet;
  suiAccount: WalletAccount;
  authenticationFunction: string;
  messageInput: StructuredMessageInputWithChainId;
  domain: string;
}

export async function signAptosMessageWithSui(
  input: SignAptosMessageWithSuiInput,
): Promise<UserResponse<AptosSignMessageOutput>> {
  const {
    suiWallet,
    suiAccount,
    authenticationFunction,
    messageInput,
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

  const suiAccountAddress = suiAccount.address;

  if (!suiAccountAddress) {
    throw new Error("Account not connected");
  }

  const aptosPublicKey = new SuiDerivedPublicKey({
    domain,
    suiAccountAddress: suiAccount.address,
    authenticationFunction,
  });

  const { message, nonce, chainId, ...flags } = messageInput;
  const aptosAddress = flags.address
    ? aptosPublicKey.authKey().derivedAddress()
    : undefined;
  const application = flags.application ? window.location.origin : undefined;
  const structuredMessage: StructuredMessage = {
    address: aptosAddress?.toString(),
    application,
    chainId,
    message,
    nonce,
  };
  const signingMessage = encodeStructuredMessage(structuredMessage);

  const response = await wrapSuiUserResponse(
    signPersonalMessageFeature.signPersonalMessage({
      message: signingMessage,
      account: suiAccount,
    }),
  );

  return mapUserResponse(response, (output): AptosSignMessageOutput => {
    // The signature is returned as a serialized base64 signature, so we need to parse it
    const parsedSignature = parseSerializedSignature(output.signature);
    const { signatureScheme } = parsedSignature;

    // TODO: add support for other signature schemes
    if (signatureScheme !== "ED25519") {
      throw new Error(`Unsupported signature scheme: ${signatureScheme}`);
    }

    const signature = new SuiDerivedEd25519Signature(output.signature);

    // Decode the message bytes as it is returned as a base64 encoded string
    const fullMessage = new TextDecoder().decode(fromBase64(output.bytes));

    return {
      prefix: "APTOS",
      fullMessage,
      message,
      nonce,
      signature,
    };
  });
}
