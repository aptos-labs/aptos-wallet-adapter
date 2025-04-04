import {
  createStructuredMessageStatement,
  createTransactionStatement,
  StructuredMessage,
} from '@aptos-labs/derived-wallet-base';
import { AnyRawTransaction, Hex, HexInput } from '@aptos-labs/ts-sdk';
import { SolanaSignInInputWithRequiredFields } from '@solana/wallet-standard-util';
import { PublicKey as SolanaPublicKey } from '@solana/web3.js';

export interface CreateSiwsEnvelopeInput {
  solanaPublicKey: SolanaPublicKey;
  signingMessageDigest: HexInput;
  domain: string;
}

function createSiwsEnvelope(input: CreateSiwsEnvelopeInput & {
  statement: string
}): SolanaSignInInputWithRequiredFields {
  const { solanaPublicKey, signingMessageDigest, statement, domain } = input;
  const digestHex = Hex.fromHexInput(signingMessageDigest).toString();
  return {
    address: solanaPublicKey.toString(),
    domain,
    nonce: digestHex,
    statement,
  };
}

/**
 * Create a SIWS envelope for an Aptos structured message.
 * A signature on the Solana blockchain by `solanaPublicKey` will be
 * considered as valid signature on the Aptos blockchain for the provided message.
 */
export function createSiwsEnvelopeForAptosStructuredMessage(
  input: CreateSiwsEnvelopeInput & { structuredMessage: StructuredMessage },
): SolanaSignInInputWithRequiredFields {
  const { structuredMessage, ...rest } = input;
  const statement = createStructuredMessageStatement(structuredMessage);
  return createSiwsEnvelope({ ...rest, statement });
}

/**
 * Create a SIWS envelope for an Aptos transaction.
 * A signature on the Solana blockchain by `solanaPublicKey` will be
 * considered as valid signature on the Aptos blockchain for the provided transaction.
 */
export function createSiwsEnvelopeForAptosTransaction(
  input: CreateSiwsEnvelopeInput & { rawTransaction: AnyRawTransaction },
): SolanaSignInInputWithRequiredFields {
  const { rawTransaction, ...rest } = input;
  const statement = createTransactionStatement(rawTransaction);
  return createSiwsEnvelope({ ...rest, statement });
}
