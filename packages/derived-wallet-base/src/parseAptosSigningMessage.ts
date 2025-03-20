import {
  AnyRawTransaction,
  Deserializer, FeePayerRawTransaction,
  hashValues, Hex, HexInput, MultiAgentRawTransaction, MultiAgentTransaction,
  RAW_TRANSACTION_SALT,
  RAW_TRANSACTION_WITH_DATA_SALT,
  RawTransaction,
  RawTransactionWithData, SimpleTransaction,
} from '@aptos-labs/ts-sdk';
import { decodeStructuredMessage, StructuredMessage } from './StructuredMessage';

function bufferStartsWith(buffer: Uint8Array, search: Uint8Array) {
  return buffer.slice(0, search.length) === search;
}

const transactionSigningMessagePrefix = hashValues([RAW_TRANSACTION_SALT]);
const transactionWithDataSigningMessagePrefix = hashValues([RAW_TRANSACTION_WITH_DATA_SALT]);

export function parseRawTransaction(message: Uint8Array) {
  if (bufferStartsWith(message, transactionSigningMessagePrefix)) {
    const serialized = message.slice(transactionSigningMessagePrefix.length);
    const deserializer = new Deserializer(serialized);
    return RawTransaction.deserialize(deserializer);
  } else if (bufferStartsWith(message, transactionWithDataSigningMessagePrefix)) {
    const serialized = message.slice(transactionWithDataSigningMessagePrefix.length);
    const deserializer = new Deserializer(serialized);
    return RawTransactionWithData.deserialize(deserializer);
  }
  return undefined;
}

export interface ParseSigningMessageTransactionResult {
  type: 'transaction',
  rawTransaction: AnyRawTransaction;
}

export interface ParseSigningMessageStructuredMessageResult {
  type: 'structuredMessage',
  structuredMessage: StructuredMessage;
}

export type ParseSigningMessageResult =
  | ParseSigningMessageTransactionResult
  | ParseSigningMessageStructuredMessageResult;

export function parseAptosSigningMessage(message: HexInput): ParseSigningMessageResult | undefined {
  const messageBytes = Hex.fromHexInput(message).toUint8Array();

  const parsedRawTransaction = parseRawTransaction(messageBytes);
  if (parsedRawTransaction) {
    let rawTransaction: AnyRawTransaction;
    if (parsedRawTransaction instanceof RawTransaction) {
      rawTransaction = new SimpleTransaction(parsedRawTransaction);
    } else if (parsedRawTransaction instanceof MultiAgentRawTransaction) {
      rawTransaction = new MultiAgentTransaction(
        parsedRawTransaction.raw_txn,
        parsedRawTransaction.secondary_signer_addresses,
      );
    } else if (parsedRawTransaction instanceof FeePayerRawTransaction) {
      const { raw_txn, secondary_signer_addresses, fee_payer_address } = parsedRawTransaction;
      rawTransaction = secondary_signer_addresses.length > 0
        ? new MultiAgentTransaction(raw_txn, secondary_signer_addresses, fee_payer_address)
        : new SimpleTransaction(raw_txn, fee_payer_address);
    } else {
      throw new Error('Unsupported raw transaction');
    }
    return {
      type: 'transaction',
      rawTransaction
    };
  }

  try {
    const structuredMessage = decodeStructuredMessage(messageBytes);
    return {
      type: 'structuredMessage',
      structuredMessage,
    };
  } catch (err) {
    return undefined;
  }
}
