import { mapUserResponse } from '@aptos-labs/derived-wallet-base';
import {
  AccountAuthenticator,
  AccountAuthenticatorAbstraction,
  AnyRawTransaction,
  generateSigningMessageForTransaction,
  hashValues,
} from '@aptos-labs/ts-sdk';
import { UserResponse } from "@aptos-labs/wallet-standard";
import { BrowserProvider, Eip1193Provider } from 'ethers';
import { createSiweEnvelopeForAptosTransaction } from './createSiweEnvelope';
import { EIP1193DerivedSignature } from './EIP1193DerivedSignature';
import { EthereumAddress, wrapEthersUserResponse } from './shared';

export interface SignAptosTransactionWithEthereumInput {
  eip1193Provider: Eip1193Provider | BrowserProvider;
  ethereumAddress?: EthereumAddress;
  authenticationFunction: string;
  rawTransaction: AnyRawTransaction;
}

export async function signAptosTransactionWithEthereum(input: SignAptosTransactionWithEthereumInput): Promise<UserResponse<AccountAuthenticator>> {
  const { authenticationFunction, rawTransaction } = input;
  const eip1193Provider = input.eip1193Provider instanceof BrowserProvider
    ? input.eip1193Provider
    : new BrowserProvider(input.eip1193Provider);

  const accounts = await eip1193Provider.listAccounts();
  const ethereumAccount = input.ethereumAddress
    ? accounts.find((account) => account.address === input.ethereumAddress)
    : accounts[0];
  if (!ethereumAccount) {
    throw new Error('Account not connected');
  }
  const ethereumAddress = ethereumAccount.address as EthereumAddress;

  const signingMessage = generateSigningMessageForTransaction(rawTransaction);
  const signingMessageDigest = hashValues([signingMessage]);

  const chainId = rawTransaction.rawTransaction.chain_id.chainId;

  // We need to provide `issuedAt` externally so that we can match it with the signature
  const issuedAt = new Date();

  const siweMessage = createSiweEnvelopeForAptosTransaction({
    ethereumAddress,
    chainId,
    rawTransaction,
    signingMessageDigest,
    issuedAt,
  });

  const response = await wrapEthersUserResponse(ethereumAccount.signMessage(siweMessage));

  return mapUserResponse(response, (siweSignature) => {
    const signature = new EIP1193DerivedSignature(siweSignature, chainId, issuedAt);
    const authenticator = signature.bcsToBytes();
    return new AccountAuthenticatorAbstraction(
      authenticationFunction,
      signingMessageDigest,
      authenticator,
    );
  });
}
