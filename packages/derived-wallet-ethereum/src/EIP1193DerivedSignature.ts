import { Deserializer, Hex, HexInput, Serializer, Signature } from '@aptos-labs/ts-sdk';

export class EIP1193DerivedSignature extends Signature {
  static readonly LENGTH = 65;

  // The signature of the message
  private readonly _siweSignature: Uint8Array;
  // The date and time when the signature was issued
  readonly issuedAt: Date;
  // The scheme in the URI of the message, e.g. the scheme of the website that requested the signature (http, https, etc.)
  readonly scheme: string;

  constructor(scheme: string, issuedAt: Date, siweSignature: HexInput) {
    super();
    this._siweSignature = Hex.fromHexInput(siweSignature).toUint8Array();
    if (this._siweSignature.length !== EIP1193DerivedSignature.LENGTH) {
      throw new Error(`Expected signature length to be ${EIP1193DerivedSignature.LENGTH} bytes`);
    }
    this.issuedAt = issuedAt;
    this.scheme = scheme;
  }

  get siweSignature() {
    return Hex.fromHexInput(this._siweSignature).toString();
  }

  serialize(serializer: Serializer) {
    serializer.serializeStr(this.scheme);
    serializer.serializeStr(this.issuedAt.toISOString());
    serializer.serializeBytes(this._siweSignature);
  }

  static deserialize(deserializer: Deserializer) {
    const scheme = deserializer.deserializeStr();
    const issuedAt = new Date(deserializer.deserializeStr());
    const siweSignature = deserializer.deserializeBytes();
    return new EIP1193DerivedSignature(scheme, issuedAt, siweSignature);
  }
}
