import {
  DerivableAbstractPublicKey,
  mapUserResponse,
} from "@aptos-labs/derived-wallet-base";
import {
  AbstractedAccount,
  type AccountAuthenticator,
  AccountAuthenticatorAbstraction,
  type AnyRawTransaction,
  generateSigningMessageForTransaction,
  hashValues,
  Serializer,
} from "@aptos-labs/ts-sdk";
import type { UserResponse } from "@aptos-labs/wallet-standard";
import { BrowserProvider, type Eip1193Provider } from "ethers";
import { createSiweEnvelopeForAptosTransaction } from "./createSiweEnvelope";
import { EIP1193SiweSignature } from "./EIP1193DerivedSignature";
import { type EthereumAddress, wrapEthersUserResponse } from "./shared";

/**
 * A first byte of the signature that indicates the "message type", this is defined in the
 * authentication function on chain, and lets us identify the type of the message and to make
 * changes in the future if needed.
 */
export const SIGNATURE_TYPE = 1;

/**
 * Signature type for delegated signing (cross-domain).
 * The abstractSignature includes the delegated_domain used for SIWE signing.
 */
export const DELEGATED_SIGNATURE_TYPE = 2;

export interface CreateMessageForEthereumTransactionInput {
  rawTransaction: AnyRawTransaction;
  authenticationFunction: string;
  ethereumAddress: EthereumAddress;
  domain: string;
  uri: string;
  issuedAt: Date;
}

/**
 * Helper function to create a SIWE message for an Ethereum transaction.
 * This is useful for Node.js environments where window.location is not available.
 */
export function createMessageForEthereumTransaction(
  input: CreateMessageForEthereumTransactionInput,
) {
  const {
    rawTransaction,
    authenticationFunction,
    ethereumAddress,
    domain,
    uri,
    issuedAt,
  } = input;

  const signingMessage = generateSigningMessageForTransaction(rawTransaction);
  const message = AbstractedAccount.generateAccountAbstractionMessage(
    signingMessage,
    authenticationFunction,
  );
  const signingMessageDigest = hashValues([message]);

  const chainId = rawTransaction.rawTransaction.chain_id.chainId;

  const siweMessage = createSiweEnvelopeForAptosTransaction({
    ethereumAddress,
    chainId,
    rawTransaction,
    signingMessageDigest,
    issuedAt,
    domain,
    uri,
  });

  return { siweMessage, signingMessageDigest };
}

/**
 * Helper function to create an AccountAuthenticator from an Ethereum signature.
 * This is useful for Node.js environments.
 */
export function createAccountAuthenticatorForEthereumTransaction(
  siweSignature: string,
  ethereumAddress: EthereumAddress,
  accountDomain: string,
  scheme: string,
  authenticationFunction: string,
  signingMessageDigest: Uint8Array,
  issuedAt: Date,
  signingDomain?: string,
): AccountAuthenticatorAbstraction {
  const isDelegated =
    signingDomain !== undefined && signingDomain !== accountDomain;
  const serializer = new Serializer();
  if (isDelegated) {
    serializer.serializeU8(DELEGATED_SIGNATURE_TYPE);
    serializer.serializeStr(signingDomain);
  } else {
    serializer.serializeU8(SIGNATURE_TYPE);
  }
  const signature = new EIP1193SiweSignature(scheme, issuedAt, siweSignature);
  signature.serialize(serializer);
  const abstractSignature = serializer.toUint8Array();

  const abstractPublicKey = new DerivableAbstractPublicKey(
    ethereumAddress,
    accountDomain,
  );

  return new AccountAuthenticatorAbstraction(
    authenticationFunction,
    signingMessageDigest,
    abstractSignature,
    abstractPublicKey.bcsToBytes(),
  );
}

export interface SignAptosTransactionWithEthereumInput {
  eip1193Provider: Eip1193Provider | BrowserProvider;
  ethereumAddress?: EthereumAddress;
  authenticationFunction: string;
  rawTransaction: AnyRawTransaction;
  /** Domain used for address derivation / abstractPublicKey. Defaults to window.location.host. */
  accountDomain?: string;
  /** Domain used for SIWE signing envelope. Defaults to window.location.host. */
  signingDomain?: string;
}

export async function signAptosTransactionWithEthereum(
  input: SignAptosTransactionWithEthereumInput,
): Promise<UserResponse<AccountAuthenticator>> {
  const { authenticationFunction, rawTransaction } = input;
  const eip1193Provider =
    input.eip1193Provider instanceof BrowserProvider
      ? input.eip1193Provider
      : new BrowserProvider(input.eip1193Provider);

  const accounts = await eip1193Provider.listAccounts();
  const ethereumAccount = input.ethereumAddress
    ? accounts.find((account) => account.address === input.ethereumAddress)
    : accounts[0];
  if (!ethereumAccount) {
    throw new Error("Account not connected");
  }
  const ethereumAddress = ethereumAccount.address as EthereumAddress;

  const issuedAt = new Date();
  const signingDomain = input.signingDomain ?? window.location.host;
  const accountDomain = input.accountDomain ?? signingDomain;
  const uri = `${window.location.protocol}//${signingDomain}`;
  const scheme = window.location.protocol.slice(0, -1);

  const { siweMessage, signingMessageDigest } =
    createMessageForEthereumTransaction({
      rawTransaction,
      authenticationFunction,
      ethereumAddress,
      domain: signingDomain,
      uri,
      issuedAt,
    });

  const response = await wrapEthersUserResponse(
    ethereumAccount.signMessage(siweMessage),
  );

  return mapUserResponse(response, (siweSignature) => {
    return createAccountAuthenticatorForEthereumTransaction(
      siweSignature,
      ethereumAddress,
      accountDomain,
      scheme,
      authenticationFunction,
      signingMessageDigest,
      issuedAt,
      signingDomain,
    );
  });
}
