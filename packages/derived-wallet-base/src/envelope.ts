import {
  AnyRawTransaction,
  NetworkToChainId,
  TransactionPayload,
  TransactionPayloadEntryFunction,
} from '@aptos-labs/ts-sdk';
import { StructuredMessage } from './StructuredMessage';

/**
 * Attempt to convert the specified chainId into a human-readable identifier.
 */
function getChainName(chainId: number) {
  // Obtain the network name if available
  for (const [network, otherChainId] of Object.entries(NetworkToChainId)) {
    if (otherChainId === chainId) {
      return network;
    }
  }
  // Otherwise return a chain id descriptor
  return `custom network: ${chainId}`;
}

/**
 * Extract the fully-qualified entry function name from the transaction payload, when applicable
 */
export function getEntryFunctionName(payload: TransactionPayload) {
  if (!(payload instanceof TransactionPayloadEntryFunction)) {
    return undefined;
  }
  const moduleAddress = payload.entryFunction.module_name.address.toString();
  const moduleName = payload.entryFunction.module_name.name.identifier;
  const functionName = payload.entryFunction.function_name.identifier;
  return `${moduleAddress}::${moduleName}::${functionName}`;
}

/**
 * Create a human-readable statement for the specified Aptos message,
 * suitable to be included into a "Sign in with ..." envelope
 */
export function createStructuredMessageStatement({ message, chainId }: StructuredMessage) {
  // `statement` does not allow newlines, so we escape them
  const escapedMessage = message.replaceAll('\n', '\\n');

  const onAptosChainSuffix = chainId ? ` (${getChainName(chainId)})` : '';
  const onAptosChain = ` on Aptos blockchain${onAptosChainSuffix}`;

  return `To sign the following message${onAptosChain}: ${escapedMessage}`;
}

/**
 * Create a human-readable statement for the specified Aptos transaction,
 * suitable to be included into a "Sign in with ..." envelope.
 */
export function createTransactionStatement(rawTransaction: AnyRawTransaction) {
  const entryFunctionName = getEntryFunctionName(rawTransaction.rawTransaction.payload);
  const humanReadableEntryFunction = entryFunctionName ? ` ${entryFunctionName}` : '';

  const chainId = rawTransaction.rawTransaction.chain_id.chainId;
  const chainName = getChainName(chainId);
  const onAptosChain = ` on Aptos blockchain (${chainName})`;

  return `To execute transaction${humanReadableEntryFunction}${onAptosChain}.`;
}
