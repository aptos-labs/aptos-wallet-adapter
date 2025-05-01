import {
  Deserializer,
  Hex,
  HexInput,
  Serializer,
  Signature,
} from "@aptos-labs/ts-sdk";
import { fromBase64, toBase64 } from "@mysten/bcs";

/**
 * Current support is for Ed25519 signatures.
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

// export class SuiDerivedSignature extends Signature {
//   static readonly LENGTH = 64;

//   // The signature scheme of the signature - "ED25519" | "Secp256k1" | "Secp256r1" | "MULTISIG"
//   private readonly signatureScheme: number;
//   // The signature of the message
//   private readonly signature: Uint8Array<ArrayBuffer>;
//   // The public key of the signature
//   private readonly publicKey: Uint8Array<ArrayBuffer>;

//   constructor(
//     signatureScheme: number,
//     signature: HexInput,
//     publicKey: HexInput
//   ) {
//     super();
//     this.signatureScheme = signatureScheme;
//     this.signature = Hex.fromHexInput(signature).toUint8Array();
//     this.publicKey = Hex.fromHexInput(publicKey).toUint8Array();
//   }

//   toUint8Array() {
//     const signatureBytes = new Uint8Array(this.signature);
//     const publicKeyBytes = new Uint8Array(this.publicKey);

//     const result = new Uint8Array(
//       1 + signatureBytes.length + publicKeyBytes.length
//     );
//     result[0] = this.signatureScheme;
//     result.set(signatureBytes, 1);
//     result.set(publicKeyBytes, 1 + signatureBytes.length);

//     return result;
//   }

//   get suiSignature() {
//     return Hex.fromHexInput(this.signature).toString();
//   }

//   serialize(serializer: Serializer) {
//     serializer.serializeU8(this.signatureScheme);
//     serializer.serializeBytes(this.signature);
//     serializer.serializeBytes(this.publicKey);
//   }

//   static deserialize(deserializer: Deserializer) {
//     const signatureScheme = deserializer.deserializeU8();
//     const signature = deserializer.deserializeBytes();
//     const publicKey = deserializer.deserializeBytes();
//     return new SuiDerivedSignature(signatureScheme, signature, publicKey);
//   }
// }
