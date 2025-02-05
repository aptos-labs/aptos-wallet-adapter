import {
  ChainId,
  DEFAULT_MAX_GAS_AMOUNT,
  MultiAgentTransaction,
  Network,
  NetworkToChainId,
  RawTransaction, SimpleTransaction,
} from '@aptos-labs/ts-sdk';
import { AptosSignTransactionInputV1_1 } from '@aptos-labs/wallet-standard';

/**
 * Build a transaction from a transaction input, without async calls.
 * Most wallets require browser popups, that might be blocked if a delay is introduced
 * after the user interaction.
 */
export function buildTransaction(input: AptosSignTransactionInputV1_1) {
  const senderAddress = input.sender?.address ?? input.signerAddress;
  // could use active account if available
  if (!senderAddress) {
    throw new Error('Cannot determine sender address');
  }

  if (input.sequenceNumber === undefined) {
    throw new Error('Cannot determine sequence number');
  }

  if (!('serialize' in input.payload)) {
    throw new Error('Cannot generate payload from input');
  }

  const expirationTimestamp = input.expirationSecondsFromNow
    ? Math.ceil(Date.now() / 1000) + input.expirationSecondsFromNow
    : (input.expirationTimestamp ?? 0);

  // Can use active network if available
  const chainId = NetworkToChainId[input.network ?? Network.MAINNET];

  const rawTransaction = new RawTransaction(
    senderAddress,
    BigInt(input.sequenceNumber),
    input.payload,
    BigInt(input.maxGasAmount ?? DEFAULT_MAX_GAS_AMOUNT),
    BigInt(input.gasUnitPrice ?? 100),
    BigInt(expirationTimestamp),
    new ChainId(chainId),
  );

  const secondarySignersAddresses = input.secondarySigners?.map((signer) => signer.address) ?? [];
  return secondarySignersAddresses.length > 0
    ? new MultiAgentTransaction(rawTransaction, secondarySignersAddresses, input.feePayer?.address)
    : new SimpleTransaction(rawTransaction, input.feePayer?.address);
}
