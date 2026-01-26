import {
  createStructuredMessageStatement,
  createTransactionStatement,
  StructuredMessage,
} from "@aptos-labs/derived-wallet-base";
import { AnyRawTransaction, Hex, HexInput } from "@aptos-labs/ts-sdk";
import { createSiweMessage } from "viem/siwe";
import { EthereumAddress } from "./shared";

export interface CreateSiweEnvelopeInput {
  ethereumAddress: EthereumAddress;
  chainId: number;
  signingMessageDigest: HexInput;
  issuedAt: Date;
  /** Optional domain - defaults to window.location.host in browser */
  domain?: string;
  /** Optional URI - defaults to window.location.origin in browser */
  uri?: string;
}

function createSiweEnvelope(
  input: CreateSiweEnvelopeInput & { statement: string },
) {
  const {
    ethereumAddress,
    chainId,
    signingMessageDigest,
    issuedAt,
    statement,
    domain = window.location.host,
    uri = window.location.origin,
  } = input;
  const digestHex = Hex.fromHexInput(signingMessageDigest).toString();
  return createSiweMessage({
    address: ethereumAddress,
    domain,
    uri,
    chainId,
    nonce: digestHex,
    statement,
    version: "1",
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

export function createSiweEnvelopeForAptosTransaction(
  input: CreateSiweEnvelopeInput & {
    rawTransaction: AnyRawTransaction;
  },
) {
  const { rawTransaction, ...rest } = input;
  const statement = createTransactionStatement(rawTransaction);
  return createSiweEnvelope({ ...rest, statement });
}
