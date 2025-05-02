import {
  createStructuredMessageStatement,
  createTransactionStatement,
  StructuredMessage,
} from '@aptos-labs/derived-wallet-base';
import { AnyRawTransaction, Hex, HexInput } from '@aptos-labs/ts-sdk';
import { createSiweMessage } from 'viem/siwe';
import { EthereumAddress } from './shared';

export interface CreateSiweEnvelopeInput {
  ethereumAddress: EthereumAddress;
  chainId: number;
  signingMessageDigest: HexInput;
  issuedAt: Date;
}

function createSiweEnvelope(input: CreateSiweEnvelopeInput & { statement: string }) {
  const { ethereumAddress, chainId, signingMessageDigest, issuedAt, statement } = input;
  const digestHex = Hex.fromHexInput(signingMessageDigest).toString();
  return createSiweMessage({
    address: ethereumAddress,
    domain: window.location.host,
    uri: window.location.origin,
    chainId,
    nonce: digestHex,
    statement,
    version: '1',
    issuedAt,
  });
}

export function createSiweEnvelopeForAptosStructuredMessage(
  input: CreateSiweEnvelopeInput & { structuredMessage: StructuredMessage },
) {
  const { structuredMessage, ...rest } = input;
  const statement = createStructuredMessageStatement(structuredMessage);
  return createSiweEnvelope({ ...rest, statement });
}

export function createSiweEnvelopeForAptosTransaction(input: CreateSiweEnvelopeInput & {
  rawTransaction: AnyRawTransaction
}) {
  const { rawTransaction, ...rest } = input;
  const statement = createTransactionStatement(rawTransaction);
  return createSiweEnvelope({ ...rest, statement });

}

