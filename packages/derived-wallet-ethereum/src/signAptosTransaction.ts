import { DerivableAbstractPublicKey, mapUserResponse } from '@aptos-labs/derived-wallet-base';
import {
  AccountAuthenticator,
  AccountAuthenticatorAbstraction,
  AnyRawTransaction,
  generateSigningMessageForTransaction,
  hashValues,
  Hex,
  Serializer,
} from '@aptos-labs/ts-sdk';
import { UserResponse } from "@aptos-labs/wallet-standard";
import { BrowserProvider, Eip1193Provider, keccak256,getBytes, id, SigningKey, toUtf8Bytes, verifyMessage } from 'ethers';
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
  console.log("siweMessage",siweMessage)

  const response = await wrapEthersUserResponse(ethereumAccount.signMessage(siweMessage));

  return mapUserResponse(response, (siweSignature) => {
    console.log("response",response)
    console.log("siweSignature",siweSignature)

    const prefix = `\x19Ethereum Signed Message:\n${siweMessage.length}`;
    const fullMessage = prefix + siweMessage;

    const metamaskMessage = keccak256(toUtf8Bytes(fullMessage));
    console.log("metamaskMessage",metamaskMessage)
    
    const publicKey = SigningKey.recoverPublicKey(metamaskMessage, siweSignature);
    console.log("Public Key:", publicKey);

    const publicKeyBytes = getBytes(publicKey);
    // 1. Hash with keccak256
    const kexHash = keccak256(publicKeyBytes); // returns a hex string
    console.log("kexHash",kexHash)

    // 2. Slice last 20 bytes (same as vector::slice(&kexHash, 12, 32))
    const kexHashBytes = getBytes(kexHash); // convert hash to bytes
    console.log("kexHashBytes",kexHashBytes)
    const keccak = keccak256(publicKeyBytes.slice(1)); // skip 0x04 prefix
    const address = "0x" + keccak.slice(-40);
    console.log("address",address)
    // 3. Convert to address (optional)
    //const recoveredAddressHex = "0x" + Buffer.from(recoveredAddressBytes).toString("hex");
    //console.log("Recovered address:", recoveredAddressHex);

    const recoveredAddress = verifyMessage(siweMessage, siweSignature);
    console.log("Recovered address:", recoveredAddress);

    // Serialize the signature with the signature type as the first byte.
    const serializer = new Serializer();
    serializer.serializeU8(0);
    const signature = new EIP1193DerivedSignature(issuedAt, siweSignature);
    signature.serialize(serializer)
    const abstractSignature = serializer.toUint8Array();

    // Serialize the abstract public key.
    const abstractPublicKey = new DerivableAbstractPublicKey(ethereumAddress, window.location.host);
    
    return new AccountAuthenticatorAbstraction(
      authenticationFunction,
      signingMessageDigest,
      abstractSignature,
      abstractPublicKey.bcsToBytes()
    );
  });
}
