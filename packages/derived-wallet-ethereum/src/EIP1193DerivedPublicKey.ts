import { computeDomainAuthenticationKey, parseAptosSigningMessage } from '@aptos-labs/derived-wallet-base';
import {
  AccountPublicKey,
  AuthenticationKey,
  Deserializer,
  hashValues,
  Hex,
  Serializer,
  VerifySignatureArgs,
} from '@aptos-labs/ts-sdk';
import { verifyMessage } from 'ethers';
import { Address as EthereumAddress } from 'viem';
import {
  createSiweMessageFromAptosStructuredMessage,
  createSiweMessageFromAptosTransaction,
} from './createSiweMessageFromAptos';
import { EIP1193DerivedSignature } from './EIP1193DerivedSignature';

export interface EIP1193DerivedPublicKeyParams {
  domain: string;
  ethereumAddress: EthereumAddress;
  authenticationFunction: string;
}

export class EIP1193DerivedPublicKey extends AccountPublicKey {
  readonly domain: string;
  readonly ethereumAddress: EthereumAddress;
  readonly authenticationFunction: string;

  private readonly _authKey: AuthenticationKey;

  constructor({ domain, ethereumAddress, authenticationFunction }: EIP1193DerivedPublicKeyParams) {
    super();
    this.domain = domain;
    this.ethereumAddress = ethereumAddress;
    this.authenticationFunction = authenticationFunction;

    const utf8EncodedDomain = new TextEncoder().encode(domain);
    const ethereumAddressBytes = Hex.fromHexInput(ethereumAddress).toUint8Array();

    const serializer = new Serializer();
    serializer.serializeBytes(utf8EncodedDomain);
    serializer.serializeBytes(ethereumAddressBytes);
    const accountIdentifier = hashValues([serializer.toUint8Array()]);

    this._authKey = computeDomainAuthenticationKey(
      authenticationFunction,
      accountIdentifier,
    );
  }

  authKey(): AuthenticationKey {
    return this._authKey;
  }

  verifySignature({ message, signature }: VerifySignatureArgs): boolean {
    const parsed = parseAptosSigningMessage(message);
    if (!parsed || !(signature instanceof EIP1193DerivedSignature)) {
      return false;
    }

    const siweMessage = parsed.type === 'structuredMessage'
      ? createSiweMessageFromAptosStructuredMessage({
        ethereumAddress: this.ethereumAddress,
        structuredMessage: parsed.structuredMessage,
        issuedAt: signature.issuedAt,
      })
      : createSiweMessageFromAptosTransaction({
        ethereumAddress: this.ethereumAddress,
        aptosAddress: this._authKey.derivedAddress(),
        rawTransaction: parsed.rawTransaction,
        issuedAt: signature.issuedAt,
      });

    // This function is the only reason we have `ethers` as dependency, as `viem`
    // unfortunately only provides an asynchronous `verifyMessage` that can't be used here.
    // We might consider dropping `viem` and only using `ethers` but not worth it at this time.
    const recoveredAddress = verifyMessage(siweMessage, signature.siweSignature);
    return recoveredAddress === this.ethereumAddress;
  }

  // region Serialization

  serialize(serializer: Serializer) {
    serializer.serializeStr(this.domain);
    serializer.serializeFixedBytes(Hex.fromHexInput(this.ethereumAddress).toUint8Array());
    serializer.serializeStr(this.authenticationFunction);
  }

  static deserialize(deserializer: Deserializer) {
    const domain = deserializer.deserializeStr();
    const ethereumAddressBytes = deserializer.deserializeFixedBytes(20);
    const ethereumAddress = Hex.fromHexInput(ethereumAddressBytes).toString() as EthereumAddress;
    const authenticationFunction = deserializer.deserializeStr();
    return new EIP1193DerivedPublicKey({ domain, ethereumAddress, authenticationFunction });
  }

  // endregion
}
