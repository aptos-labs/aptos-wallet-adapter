import { Deserializer, Hex, HexInput, Serializer, Signature } from '@aptos-labs/ts-sdk';

export class EIP1193DerivedSignature extends Signature {
  static readonly LENGTH = 65;

  private readonly _siweSignature: Uint8Array;
  readonly issuedAt: Date;

  constructor(siweSignature: HexInput, issuedAt: Date) {
    super();
    this._siweSignature = Hex.fromHexInput(siweSignature).toUint8Array();
    if (this._siweSignature.length !== EIP1193DerivedSignature.LENGTH) {
      throw new Error('Expected signature length to be 65 bytes');
    }
    this.issuedAt = issuedAt;
  }

  get siweSignature() {
    return Hex.fromHexInput(this._siweSignature).toString();
  }

  serialize(serializer: Serializer) {
    serializer.serializeFixedBytes(this._siweSignature);
    serializer.serializeU64(this.issuedAt.getTime());
  }

  static deserialize(deserializer: Deserializer) {
    const siweSignature = deserializer.deserializeFixedBytes(EIP1193DerivedSignature.LENGTH);
    // Number can safely contain a unix timestamp
    const issuedAt = new Date(Number(deserializer.deserializeU64()));
    return new EIP1193DerivedSignature(siweSignature, issuedAt);
  }
}
