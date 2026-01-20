import { Deserializer, Hex, Serializer, Signature } from "@aptos-labs/ts-sdk";
import { fromBase64, toBase64 } from "@mysten/bcs";

/**
 * Current Sui DAA support is only for Ed25519 signatures.
 */

export class SuiDerivedEd25519Signature extends Signature {
  // 1 byte (scheme flag) + 64 bytes (signature) + 32 bytes (public key)
  static readonly SIGNATURE_LENGTH = 97;

  // The signature is `scheme flag + signature + public key` as base64 string
  private readonly signature: string;

  constructor(signature: string) {
    super();
    this.signature = signature;
  }

  toUint8Array() {
    return fromBase64(this.signature);
  }

  get signatureBase64() {
    return this.signature;
  }

  get signatureHex(): Hex {
    return Hex.fromHexInput(fromBase64(this.signature));
  }

  serialize(serializer: Serializer) {
    serializer.serializeBytes(this.toUint8Array());
  }

  static deserialize(deserializer: Deserializer) {
    const signature = deserializer.deserializeBytes();
    return new SuiDerivedEd25519Signature(toBase64(signature));
  }
}
