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
import { createSuiEnvelopeForAptosTransaction } from "./createSuiEnvelope";
import { verifyPersonalMessageSignature } from "@mysten/sui/verify";
import { SuiDerivedEd25519Signature } from "./SuiDerivedSignature";

export interface SuiDerivedPublicKeyParams {
  domain: string;
  suiAccountAddress: string;
  authenticationFunction: string;
}

export class SuiDerivedPublicKey extends AccountPublicKey {
  static readonly SUI_PUBLIC_KEY_LENGTH = 32;

  readonly domain: string;
  readonly suiAccountAddress: string;
  readonly authenticationFunction: string;

  private readonly _authKey: AuthenticationKey;

  constructor({
    domain,
    suiAccountAddress,
    authenticationFunction,
  }: SuiDerivedPublicKeyParams) {
    super();
    this.domain = domain;
    this.suiAccountAddress = suiAccountAddress;
    this.authenticationFunction = authenticationFunction;

    this._authKey = computeDerivableAuthenticationKey(
      authenticationFunction,
      this.suiAccountAddress,
      domain,
    );
  }

  authKey(): AuthenticationKey {
    return this._authKey;
  }

  verifySignature({ message, signature }: VerifySignatureArgs): boolean {
    throw new Error("Use verifySignatureAsync instead");
  }

  async verifySignatureAsync(args: {
    aptosConfig: AptosConfig;
    message: HexInput;
    signature: Signature;
  }): Promise<boolean> {
    const { message, signature } = args;

    const parsedSigningMessage = parseAptosSigningMessage(message);
    if (
      !parsedSigningMessage ||
      !(signature instanceof SuiDerivedEd25519Signature)
    ) {
      return false;
    }

    const commonInput = {
      suiAddress: this.authKey().derivedAddress().toString(),
      signingMessageDigest: hashValues([message]),
    };

    let messageBytes: Uint8Array;

    if (parsedSigningMessage.type === "structuredMessage") {
      messageBytes = encodeStructuredMessage(
        parsedSigningMessage.structuredMessage,
      );
    } else {
      // Handle transaction message
      const suiEnvelopeInput = createSuiEnvelopeForAptosTransaction({
        ...parsedSigningMessage,
        ...commonInput,
        domain: this.domain,
      });
      messageBytes = new TextEncoder().encode(suiEnvelopeInput);
    }

    try {
      await verifyPersonalMessageSignature(
        messageBytes,
        signature.signatureBase64,
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  // region Serialization

  serialize(serializer: Serializer) {
    serializer.serializeStr(this.domain);
    serializer.serializeFixedBytes(
      Hex.fromHexInput(this.suiAccountAddress).toUint8Array(),
    );
    serializer.serializeStr(this.authenticationFunction);
  }

  static deserialize(deserializer: Deserializer) {
    const domain = deserializer.deserializeStr();
    const suiAccountAddressBytes = deserializer.deserializeFixedBytes(
      SuiDerivedPublicKey.SUI_PUBLIC_KEY_LENGTH,
    );
    const suiAccountAddress = Hex.fromHexInput(
      suiAccountAddressBytes,
    ).toString();
    const authenticationFunction = deserializer.deserializeStr();
    return new SuiDerivedPublicKey({
      domain,
      suiAccountAddress,
      authenticationFunction,
    });
  }

  // endregion
}
