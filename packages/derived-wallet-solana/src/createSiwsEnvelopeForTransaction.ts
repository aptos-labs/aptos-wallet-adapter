import { aptosChainIdToNetwork } from '@aptos-labs/derived-wallet-base';
import {
  AccountAddressInput,
  AnyRawTransaction,
  generateSigningMessageForTransaction,
  hashValues,
  Hex,
} from '@aptos-labs/ts-sdk';
import { SolanaSignInInputWithRequiredFields } from '@solana/wallet-standard-util';
import { PublicKey as SolanaPublicKey } from '@solana/web3.js';

export interface CreateSiwsEnvelopeForAptosTransactionInput {
  solanaPublicKey: SolanaPublicKey;
  aptosAddress: AccountAddressInput;
  rawTransaction: AnyRawTransaction;
}

/**
 * Create a SIWS envelope for an Aptos transaction.
 * A signature on the Solana blockchain by `solanaPublicKey` will be
 * considered as valid signature on the Aptos blockchain for the provided transaction.
 */
export function createSiwsEnvelopeForAptosTransaction(
  input: CreateSiwsEnvelopeForAptosTransactionInput,
): SolanaSignInInputWithRequiredFields & { requestId: string } {
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
