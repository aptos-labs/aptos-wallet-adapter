import {
  computeDerivableAuthenticationKey,
  encodeStructuredMessage,
  parseAptosSigningMessage,
} from "@aptos-labs/derived-wallet-base";
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
} from "@aptos-labs/ts-sdk";
import { verifyMessage as verifyEthereumMessage } from "ethers";
import { createSiweEnvelopeForAptosTransaction } from "./createSiweEnvelope";
import {
  EIP1193DerivedSignature,
  EIP1193Signature,
} from "./EIP1193DerivedSignature";
import { EthereumAddress } from "./shared";

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

  constructor({
    domain,
    ethereumAddress,
    authenticationFunction,
  }: EIP1193DerivedPublicKeyParams) {
    super();
    this.domain = domain;
    this.ethereumAddress = ethereumAddress;
    this.authenticationFunction = authenticationFunction;

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

    if (!parsedSigningMessage) {
      return false;
    }

    let messageBytes: Uint8Array | string;
    // Handle structured message, i.e. a message signed withAptosSignMessageInput
    if (parsedSigningMessage.type === "structuredMessage") {
      if (!(signature instanceof EIP1193Signature)) return false;

      messageBytes = encodeStructuredMessage(
        parsedSigningMessage.structuredMessage
      );
    } else {
      // Handle transaction
      if (!(signature instanceof EIP1193DerivedSignature)) return false;
      const { issuedAt } = signature;
      const signingMessageDigest = hashValues([message]);
      // Obtain SIWE envelope for the signing message
      const envelopeInput = {
        ethereumAddress: this.ethereumAddress,
        signingMessageDigest,
        issuedAt,
      };

      messageBytes = createSiweEnvelopeForAptosTransaction({
        ...parsedSigningMessage,
        ...envelopeInput,
        chainId:
          parsedSigningMessage.rawTransaction.rawTransaction.chain_id.chainId,
      });
    }

    // Verify the signature
    const { siweSignature } = signature;

    const recoveredAddress = verifyEthereumMessage(messageBytes, siweSignature);
    return recoveredAddress === this.ethereumAddress;
  }

  async verifySignatureAsync(args: {
    aptosConfig: AptosConfig;
    message: HexInput;
    signature: Signature;
  }): Promise<boolean> {
    return this.verifySignature({
      message: args.message,
      signature: args.signature,
    });
  }

  // region Serialization

  serialize(serializer: Serializer) {
    serializer.serializeStr(this.domain);
    serializer.serializeFixedBytes(
      Hex.fromHexInput(this.ethereumAddress).toUint8Array()
    );
    serializer.serializeStr(this.authenticationFunction);
  }

  static deserialize(deserializer: Deserializer) {
    const domain = deserializer.deserializeStr();
    const ethereumAddressBytes = deserializer.deserializeFixedBytes(20);
    const ethereumAddress = Hex.fromHexInput(
      ethereumAddressBytes
    ).toString() as EthereumAddress;
    const authenticationFunction = deserializer.deserializeStr();
    return new EIP1193DerivedPublicKey({
      domain,
      ethereumAddress,
      authenticationFunction,
    });
  }

  // endregion
}
