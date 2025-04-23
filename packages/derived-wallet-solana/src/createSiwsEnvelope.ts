import {
  createStructuredMessageStatement,
  createTransactionStatement,
  getChainName,
  getEntryFunctionName,
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


/**
 * Create the message to be used with the wallet `signMessage` function.
 * Note: this message format matches the SIWS message format, so it can be used with SIWS as well.
 * 
 * <domain> wants you to sign in with your Solana account:
 * <base58_public_key>
 * 
 * Please confirm you explicitly initiated this request from <domain>. You are approving to execute transaction <entry_function> on Aptos blockchain (<network_name>).
 * 
 * Nonce: <aptos_txn_digest>
 */
export function createSolanaSignMessageStatementForAptosTransaction(args:{accountAddress:string, signingMessageDigest: HexInput, rawTransaction: AnyRawTransaction  } ) {
  const {accountAddress, signingMessageDigest, rawTransaction} = args;
  
  const domain = window.location.host;
  const digestHex = Hex.fromHexInput(signingMessageDigest).toString();

  const messageStatementPrefix = `${domain} wants you to sign in with your Solana account:\n${accountAddress}`;
  const messageStatementBody = createTransactionStatement(rawTransaction);

  return `${messageStatementPrefix}\n\n${messageStatementBody}\n\nNonce: ${digestHex}`
}
