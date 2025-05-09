import {
  Deserializer,
  Hex,
  HexInput,
  Serializer,
  Signature,
} from "@aptos-labs/ts-sdk";

/**
 * A classs representing a signature of a message signed with EIP1193
 */
export class EIP1193Signature extends Signature {
  static readonly LENGTH = 65;
  protected readonly _siweSignature: Uint8Array;

  constructor(siweSignature: HexInput) {
    super();
    this._siweSignature = Hex.fromHexInput(siweSignature).toUint8Array();
  }

  get siweSignature() {
    return Hex.fromHexInput(this._siweSignature).toString();
  }

  serialize(serializer: Serializer) {
    serializer.serializeBytes(this._siweSignature);
  }

  static deserialize(deserializer: Deserializer) {
    const signature = deserializer.deserializeBytes();
    return new EIP1193Signature(signature);
  }
}

/**
 * A class representing a signature of a message signed with EIP1193 and following the SIWE standard
 */
export class EIP1193DerivedSignature extends EIP1193Signature {
  // The date and time when the signature was issued
  readonly issuedAt: Date;
  // The scheme in the URI of the message, e.g. the scheme of the website that requested the signature (http, https, etc.)
  readonly scheme: string;

  constructor(scheme: string, issuedAt: Date, siweSignature: HexInput) {
    super(siweSignature);
    this.issuedAt = issuedAt;
    this.scheme = scheme;
  }

  override serialize(serializer: Serializer) {
    serializer.serializeStr(this.scheme);
    serializer.serializeStr(this.issuedAt.toISOString());
    serializer.serializeBytes(this._siweSignature);
  }

  static override deserialize(deserializer: Deserializer) {
    const scheme = deserializer.deserializeStr();
    const issuedAt = new Date(deserializer.deserializeStr());
    const siweSignature = deserializer.deserializeBytes();
    return new EIP1193DerivedSignature(scheme, issuedAt, siweSignature);
  }
}
