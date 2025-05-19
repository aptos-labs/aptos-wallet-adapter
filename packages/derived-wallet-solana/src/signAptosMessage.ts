import {
  encodeStructuredMessage,
  mapUserResponse,
  StructuredMessage,
  StructuredMessageInput,
} from "@aptos-labs/derived-wallet-base";
import { Ed25519Signature } from "@aptos-labs/ts-sdk";
import { AptosSignMessageOutput } from "@aptos-labs/wallet-standard";
import { StandardWalletAdapter as SolanaWalletAdapter } from "@solana/wallet-standard-wallet-adapter-base";
import { wrapSolanaUserResponse } from "./shared";
import { SolanaDerivedPublicKey } from "./SolanaDerivedPublicKey";

export interface StructuredMessageInputWithChainId
  extends StructuredMessageInput {
  chainId?: number;
}

export interface SignAptosMessageWithSolanaInput {
  solanaWallet: SolanaWalletAdapter;
  authenticationFunction: string;
  messageInput: StructuredMessageInputWithChainId;
  domain: string;
}

export async function signAptosMessageWithSolana(
  input: SignAptosMessageWithSolanaInput
) {
  const { solanaWallet, authenticationFunction, messageInput, domain } = input;

  if (!solanaWallet.signMessage) {
    throw new Error("solana:signMessage not available");
  }

  const solanaPublicKey = solanaWallet.publicKey;
  if (!solanaPublicKey) {
    throw new Error("Account not connected");
  }

  const aptosPublicKey = new SolanaDerivedPublicKey({
    domain,
    solanaPublicKey,
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

  const response = await wrapSolanaUserResponse(
    solanaWallet.signMessage(signingMessage)
  );

  return mapUserResponse(response, (output): AptosSignMessageOutput => {
    // Solana signMessage standard always returns a Ed25519 signature type
    const signature = new Ed25519Signature(output);
    const fullMessage = new TextDecoder().decode(signingMessage);

    return {
      prefix: "APTOS",
      fullMessage,
      message,
      nonce,
      signature,
    };
  });
}
