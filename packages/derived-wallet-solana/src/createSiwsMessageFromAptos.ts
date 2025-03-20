import { aptosChainIdToNetwork, encodeStructuredMessage, StructuredMessage } from '@aptos-labs/derived-wallet-base';
import {
  AccountAddressInput,
  AnyRawTransaction,
  generateSigningMessageForTransaction,
  hashValues,
  Hex,
} from '@aptos-labs/ts-sdk';
import { SolanaSignInInputWithRequiredFields } from '@solana/wallet-standard-util';
import { PublicKey as SolanaPublicKey } from '@solana/web3.js';

export interface CreateSiwsMessageFromAptosStructuredMessageInput {
  solanaPublicKey: SolanaPublicKey;
  structuredMessage: StructuredMessage;
}

export function createSiwsInputFromAptosStructuredMessage(
  input: CreateSiwsMessageFromAptosStructuredMessageInput,
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

export interface CreateSiwsMessageFromAptosTransaction {
  solanaPublicKey: SolanaPublicKey;
  aptosAddress: AccountAddressInput;
  rawTransaction: AnyRawTransaction;
}

export function createSiwsInputFromAptosTransaction(
  input: CreateSiwsMessageFromAptosTransaction,
): SolanaSignInInputWithRequiredFields {
  const { solanaPublicKey, aptosAddress, rawTransaction } = input;
  const signingMessage = generateSigningMessageForTransaction(rawTransaction);
  const messageHash = hashValues([signingMessage]);
  const messageHashHex = Hex.fromHexInput(messageHash).toStringWithoutPrefix();

  // TODO: consider using b58 or b64 instead
  const requestId = messageHashHex;
  const nonce = messageHashHex;

  const chainId = rawTransaction.rawTransaction.chain_id.chainId;

  // Attempt to convert chainId into a human-readable identifier
  const networkId = aptosChainIdToNetwork(chainId) ?? `chainId: ${chainId}`;

  const onAptosNetwork = ` on Aptos (${networkId})`;
  const asAccount = ` with account ${aptosAddress.toString()}`;
  // TODO: define a good way to display the transaction
  const statement = `Sign the following transaction${onAptosNetwork}${asAccount}: TODO`;

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
