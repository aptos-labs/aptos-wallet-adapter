import { aptosChainIdToNetwork, encodeStructuredMessage, StructuredMessage } from '@aptos-labs/derived-wallet-base';
import { hashValues, Hex } from '@aptos-labs/ts-sdk';
import { SolanaSignInInputWithRequiredFields } from '@solana/wallet-standard-util';
import { PublicKey as SolanaPublicKey } from '@solana/web3.js';

export interface CreateSiwsEnvelopeForAptosStructuredMessageInput {
  solanaPublicKey: SolanaPublicKey;
  structuredMessage: StructuredMessage;
}

/**
 * Create a SIWS envelope for an Aptos structured message.
 * A signature on the Solana blockchain by `solanaPublicKey` will be
 * considered as valid signature on the Aptos blockchain for the provided message.
 */
export function createSiwsEnvelopeForAptosStructuredMessage(
  input: CreateSiwsEnvelopeForAptosStructuredMessageInput,
): SolanaSignInInputWithRequiredFields {
  const { solanaPublicKey, structuredMessage } = input;
  const {
    // display in the statement
    address,
    // automatically displayed as domain and URI
    // application,
    // displayed in the statement
    chainId,
    // escaped and displayed in the statement
    message,
    // displayed as nonce
    nonce,
  } = structuredMessage;

  // `statement` does not allow newlines, so we escape them
  const escapedMessage = message.replaceAll('\n', '\\n');

  // Attempt to convert chainId into a human-readable identifier
  const network = chainId ? aptosChainIdToNetwork(chainId) : undefined;
  const networkId = network ?? (chainId ? `chainId: ${chainId}` : undefined);

  const onAptosNetwork = networkId ? ` on Aptos (${networkId})` : " on Aptos";
  const asAccount = address ? ` with account ${address}` : '';
  const statement = `Sign the following message${onAptosNetwork}${asAccount}: ${escapedMessage}`;

  const encodedMessage = encodeStructuredMessage(structuredMessage);
  const messageHash = hashValues([encodedMessage]);
  // TODO: consider using b58 or b64 instead
  const requestId = Hex.fromHexInput(messageHash).toStringWithoutPrefix();

  return {
    address: solanaPublicKey.toString(),
    domain: window.location.host,
    uri: window.location.origin,
    nonce,
    requestId,
    statement,
    version: '1',
  };
}
