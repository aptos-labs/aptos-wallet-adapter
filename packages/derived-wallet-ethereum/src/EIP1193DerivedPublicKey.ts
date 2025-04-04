import { computeDerivableAuthenticationKey, parseAptosSigningMessage } from '@aptos-labs/derived-wallet-base';
import {
  AccountPublicKey,
  AptosConfig,
  AuthenticationKey,
  Deserializer,
  hashValues,
  Hex,
  HexInput,
  Serializer,
  Signature,
  VerifySignatureArgs,
} from '@aptos-labs/ts-sdk';
import { verifyMessage as verifyEthereumMessage } from 'ethers';
import {
  createSiweEnvelopeForAptosStructuredMessage,
  createSiweEnvelopeForAptosTransaction,
} from './createSiweEnvelope';
import { EIP1193DerivedSignature } from './EIP1193DerivedSignature';
import { EthereumAddress } from './shared';

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

    this._authKey = computeDerivableAuthenticationKey(
      authenticationFunction,
      ethereumAddress,
      domain
    );
  }

  authKey(): AuthenticationKey {
    return this._authKey;
  }

  verifySignature({ message, signature }: VerifySignatureArgs): boolean {
    const parsedSigningMessage = parseAptosSigningMessage(message);
    if (!parsedSigningMessage || !(signature instanceof EIP1193DerivedSignature)) {
      return false;
    }

    const { chainId, issuedAt, siweSignature } = signature;
    const signingMessageDigest = hashValues([message]);

    // Obtain SIWE envelope for the signing message
    const envelopeInput = {
      ethereumAddress: this.ethereumAddress,
      chainId,
      signingMessageDigest,
      issuedAt,
    };

    const siweMessage = parsedSigningMessage.type === 'structuredMessage'
      ? createSiweEnvelopeForAptosStructuredMessage({
        ...parsedSigningMessage,
        ...envelopeInput,
      })
      : createSiweEnvelopeForAptosTransaction({
        ...parsedSigningMessage,
        ...envelopeInput,
      });

    const recoveredAddress = verifyEthereumMessage(siweMessage, siweSignature);
    return recoveredAddress === this.ethereumAddress;
  }

  async verifySignatureAsync(args: { aptosConfig: AptosConfig, message: HexInput, signature: Signature }): Promise<boolean> {
    return this.verifySignature({message: args.message, signature: args.signature});
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
