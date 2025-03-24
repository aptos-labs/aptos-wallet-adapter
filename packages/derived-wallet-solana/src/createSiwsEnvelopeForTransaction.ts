import { aptosChainIdToNetwork } from '@aptos-labs/derived-wallet-base';
import {
  AnyRawTransaction,
  Hex,
  HexInput,
  TransactionPayload,
  TransactionPayloadEntryFunction,
} from '@aptos-labs/ts-sdk';
import { SolanaSignInInputWithRequiredFields } from '@solana/wallet-standard-util';
import { PublicKey as SolanaPublicKey } from '@solana/web3.js';

function getEntryFunctionName(payload: TransactionPayload) {
  if (!(payload instanceof TransactionPayloadEntryFunction)) {
    return undefined;
  }
  const moduleAddress = payload.entryFunction.module_name.address.toString();
  const moduleName = payload.entryFunction.module_name.name.identifier;
  const functionName = payload.entryFunction.function_name.identifier;
  return `${moduleAddress}::${moduleName}::${functionName}`;
}

export interface CreateSiwsEnvelopeForAptosTransactionInput {
  solanaPublicKey: SolanaPublicKey;
  rawTransaction: AnyRawTransaction;
  digest: HexInput;
}

/**
 * Create a SIWS envelope for an Aptos transaction.
 * A signature on the Solana blockchain by `solanaPublicKey` will be
 * considered as valid signature on the Aptos blockchain for the provided transaction.
 */
export function createSiwsEnvelopeForAptosTransaction(
  input: CreateSiwsEnvelopeForAptosTransactionInput,
): SolanaSignInInputWithRequiredFields {
  const { solanaPublicKey, rawTransaction, digest } = input;

  const entryFunctionName = getEntryFunctionName(rawTransaction.rawTransaction.payload);
  const humanReadableEntryFunction = entryFunctionName ? ` ${entryFunctionName}` : '';
  const withHash = ` with hash ${Hex.fromHexInput(digest).toString()}`;

  // Attempt to convert chainId into a human-readable identifier
  const chainId = rawTransaction.rawTransaction.chain_id.chainId;
  const chain = aptosChainIdToNetwork(chainId) ?? `chainId: ${chainId}`;
  const onAptosChain = ` on Aptos blockchain (${chain})`;

  const statement = `To execute transaction${humanReadableEntryFunction}${withHash}${onAptosChain}.`;

  return {
    address: solanaPublicKey.toString(),
    domain: window.location.host,
    uri: window.location.origin,
    statement,
    version: '1',
  };
}
