import { createTransactionStatement } from "@aptos-labs/derived-wallet-base";
import { AnyRawTransaction, Hex, HexInput } from "@aptos-labs/ts-sdk";

export interface createSuiEnvelopeInput {
  suiAddress: string;
  signingMessageDigest: HexInput;
  domain: string;
}

function createSuiEnvelope(
  input: createSuiEnvelopeInput & {
    statement: string;
  }
): string {
  const { suiAddress, signingMessageDigest, statement, domain } = input;
  const digestHex = Hex.fromHexInput(signingMessageDigest).toString();

  const prefix = `${domain} wants you to sign in with your Sui account:\n${suiAddress}\n\n${statement}`;

  let suffix = `Nonce: ${digestHex}`;

  return `${prefix}\n\n${suffix}`;
}

/**
 * Create a Sui envelope for an Aptos transaction.
 * A signature on the Sui blockchain by `suiAddress` will be
 * considered as valid signature on the Aptos blockchain for the provided transaction.
 */
export function createSuiEnvelopeForAptosTransaction(
  input: createSuiEnvelopeInput & { rawTransaction: AnyRawTransaction }
): string {
  const { rawTransaction, ...rest } = input;
  const statement = createTransactionStatement(rawTransaction);
  return createSuiEnvelope({ ...rest, statement });
}
