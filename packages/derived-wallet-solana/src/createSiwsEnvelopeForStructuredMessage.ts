import { aptosChainIdToNetwork, StructuredMessage } from '@aptos-labs/derived-wallet-base';
import { Hex, HexInput } from '@aptos-labs/ts-sdk';
import { SolanaSignInInputWithRequiredFields } from '@solana/wallet-standard-util';
import { PublicKey as SolanaPublicKey } from '@solana/web3.js';

export interface CreateSiwsEnvelopeForAptosStructuredMessageInput {
  solanaPublicKey: SolanaPublicKey;
  structuredMessage: StructuredMessage;
  digest: HexInput;
}

/**
 * Create a SIWS envelope for an Aptos structured message.
 * A signature on the Solana blockchain by `solanaPublicKey` will be
 * considered as valid signature on the Aptos blockchain for the provided message.
 */
export function createSiwsEnvelopeForAptosStructuredMessage(
  input: CreateSiwsEnvelopeForAptosStructuredMessageInput,
): SolanaSignInInputWithRequiredFields {
  const { solanaPublicKey, structuredMessage, digest } = input;
  const { chainId, message } = structuredMessage;

  // `statement` does not allow newlines, so we escape them
  const escapedMessage = message.replaceAll('\n', '\\n');

  // Attempt to convert chainId into a human-readable identifier
  const network = chainId ? aptosChainIdToNetwork(chainId) : undefined;
  const chain = network ?? (chainId ? `chainId: ${chainId}` : undefined);
  const onAptosChain = ` on Aptos blockchain${chain ? ` (${chain})` : ''}`;

  const statement = `To sign the following message${onAptosChain}: ${escapedMessage}`;
  const nonce = Hex.fromHexInput(digest).toString();

  return {
    address: solanaPublicKey.toString(),
    domain: window.location.host,
    uri: window.location.origin,
    nonce,
    statement,
    version: '1',
  };
}
