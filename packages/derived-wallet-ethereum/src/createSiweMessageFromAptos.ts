import { aptosChainIdToNetwork, encodeStructuredMessage, StructuredMessage } from '@aptos-labs/derived-wallet-base';
import {
  AccountAddressInput,
  AnyRawTransaction,
  generateSigningMessageForTransaction,
  hashValues,
  Hex,
} from '@aptos-labs/ts-sdk';
import type { Address as EthereumAddress } from 'viem';
import { createSiweMessage } from 'viem/siwe';

// The Ethereum chainId is required for SIWE, although it shouldn't matter
// for the purpose of signing Aptos messages. Using mainnet is a safe choice.
const ethereumMainnetChainId = 1;

export interface CreateSiweMessageFromAptosStructuredMessageInput {
  ethereumAddress: EthereumAddress;
  structuredMessage: StructuredMessage;
  issuedAt: Date;
}

export function createSiweMessageFromAptosStructuredMessage(
  input: CreateSiweMessageFromAptosStructuredMessageInput,
) {
  const { ethereumAddress, structuredMessage, issuedAt } = input;

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

  return createSiweMessage({
    address: ethereumAddress,
    domain: window.location.host,
    uri: window.location.origin,
    chainId: ethereumMainnetChainId,
    nonce,
    requestId,
    statement,
    version: '1',
    issuedAt,
  });
}

interface CreateSiweMessageFromAptosTransactionInput {
  ethereumAddress: EthereumAddress;
  aptosAddress: AccountAddressInput;
  rawTransaction: AnyRawTransaction;
  issuedAt: Date;
}

export function createSiweMessageFromAptosTransaction(input: CreateSiweMessageFromAptosTransactionInput) {
  const { ethereumAddress, aptosAddress, rawTransaction, issuedAt } = input;
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

  return createSiweMessage({
    address: ethereumAddress,
    domain: window.location.host,
    uri: window.location.origin,
    chainId: ethereumMainnetChainId,
    nonce,
    requestId,
    statement,
    version: '1',
    issuedAt,
  });
}
