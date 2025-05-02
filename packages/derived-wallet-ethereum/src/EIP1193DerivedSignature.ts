import { Deserializer, Hex, HexInput, Serializer, Signature } from '@aptos-labs/ts-sdk';

export class EIP1193DerivedSignature extends Signature {
  static readonly LENGTH = 65;

  // The signature of the message
  private readonly _siweSignature: Uint8Array;
  // The date and time when the signature was issued
  readonly issuedAt: Date;
  // The origin of the message, e.g. the domain of the website that requested the signature
  readonly origin: string;

  constructor(origin: string, issuedAt: Date, siweSignature: HexInput) {
    super();
    this._siweSignature = Hex.fromHexInput(siweSignature).toUint8Array();
    if (this._siweSignature.length !== EIP1193DerivedSignature.LENGTH) {
      throw new Error('Expected signature length to be 65 bytes');
    }
    this.issuedAt = issuedAt;
    this.origin = origin;
  }

  get siweSignature() {
    return Hex.fromHexInput(this._siweSignature).toString();
  }

  serialize(serializer: Serializer) {
    serializer.serializeStr(this.origin);
    serializer.serializeStr(this.issuedAt.toISOString());
    serializer.serializeBytes(this._siweSignature);
  }

  static deserialize(deserializer: Deserializer) {
    const origin = deserializer.deserializeStr();
    const issuedAt = new Date(deserializer.deserializeStr());
    const siweSignature = deserializer.deserializeBytes();
    return new EIP1193DerivedSignature(origin, issuedAt, siweSignature);
  }
}
