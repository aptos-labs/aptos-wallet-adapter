import {
  encodeStructuredMessage,
  mapUserResponse,
  StructuredMessage,
  StructuredMessageInput,
} from '@aptos-labs/derived-wallet-base';
import { Ed25519Signature, hashValues } from '@aptos-labs/ts-sdk';
import { AptosSignMessageOutput } from '@aptos-labs/wallet-standard';
import { StandardWalletAdapter as SolanaWalletAdapter } from "@solana/wallet-standard-wallet-adapter-base";
import { createSiwsEnvelopeForAptosStructuredMessage } from './createSiwsEnvelope';
import { wrapSolanaUserResponse } from './shared';
import { SolanaDerivedPublicKey } from './SolanaDerivedPublicKey';

export interface StructuredMessageInputWithChainId extends StructuredMessageInput {
  chainId?: number;
}

export interface SignAptosMessageWithSolanaInput {
  solanaWallet: SolanaWalletAdapter;
  authenticationFunction: string;
  messageInput: StructuredMessageInputWithChainId;
  domain: string;
}

export async function signAptosMessageWithSolana(input: SignAptosMessageWithSolanaInput) {
  const { solanaWallet, authenticationFunction, messageInput, domain } = input;

  if (!solanaWallet.signIn) {
    throw new Error('solana:signIn not available');
  }

  const solanaPublicKey = solanaWallet.publicKey;
  if (!solanaPublicKey) {
    throw new Error('Account not connected');
  }

  const aptosPublicKey = new SolanaDerivedPublicKey({
    domain,
    solanaPublicKey,
    authenticationFunction,
  });

  const { message, nonce, chainId, ...flags } = messageInput;
  const aptosAddress = flags.address ? aptosPublicKey.authKey().derivedAddress() : undefined;
  const application = flags.application ? window.location.origin : undefined;
  const structuredMessage: StructuredMessage = {
    address: aptosAddress?.toString(),
    application,
    chainId,
    message,
    nonce,
  };

  const signingMessage = encodeStructuredMessage(structuredMessage);
  const signingMessageDigest = hashValues([signingMessage]);

  const siwsInput = createSiwsEnvelopeForAptosStructuredMessage({
    solanaPublicKey: aptosPublicKey.solanaPublicKey,
    structuredMessage,
    signingMessageDigest,
    domain,
  });

  const response = await wrapSolanaUserResponse(solanaWallet.signIn(siwsInput));

  return mapUserResponse(response, (output): AptosSignMessageOutput => {
    if (output.signatureType && output.signatureType !== 'ed25519') {
      throw new Error('Unsupported signature type');
    }

    // The wallet might change some of the fields in the SIWS input, so we
    // might need to include the finalized input in the signature.
    // For now, we can assume the input is unchanged.
    const signature = new Ed25519Signature(output.signature);
    const fullMessage = new TextDecoder().decode(signingMessage);

    return {
      prefix: 'APTOS',
      fullMessage,
      message,
      nonce,
      signature,
    };
  });
}
