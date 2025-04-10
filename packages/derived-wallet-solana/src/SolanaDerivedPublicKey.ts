import { computeDerivableAuthenticationKey, parseAptosSigningMessage } from '@aptos-labs/derived-wallet-base';
import {
  AccountPublicKey,
  AptosConfig,
  AuthenticationKey,
  Deserializer,
  Ed25519PublicKey,
  Ed25519Signature,
  hashValues,
  HexInput,
  Serializer,
  Signature,
  VerifySignatureArgs,
} from '@aptos-labs/ts-sdk';
import { createSignInMessage as createSolanaSignInMessage } from '@solana/wallet-standard-util';
import { PublicKey as SolanaPublicKey } from '@solana/web3.js';
import {
  createSiwsEnvelopeForAptosStructuredMessage,
  createSiwsEnvelopeForAptosTransaction,
} from './createSiwsEnvelope';

export interface SolanaDerivedPublicKeyParams {
  domain: string;
  solanaPublicKey: SolanaPublicKey;
  authenticationFunction: string;
}

export class SolanaDerivedPublicKey extends AccountPublicKey {
  readonly domain: string;
  readonly solanaPublicKey: SolanaPublicKey;
  readonly authenticationFunction: string;

  readonly _authKey: AuthenticationKey;

  constructor(params: SolanaDerivedPublicKeyParams) {
    super();
    const { domain, solanaPublicKey, authenticationFunction } = params;
    this.domain = domain;
    this.solanaPublicKey = solanaPublicKey;
    this.authenticationFunction = authenticationFunction;

    this._authKey = computeDerivableAuthenticationKey(
      authenticationFunction,
      solanaPublicKey.toBase58(),
      domain
    );
  }

  authKey(): AuthenticationKey {
    return this._authKey;
  }

  verifySignature({ message, signature }: VerifySignatureArgs): boolean {
    const parsedSigningMessage = parseAptosSigningMessage(message);
    if (!parsedSigningMessage || !(signature instanceof Ed25519Signature)) {
      return false;
    }

    const commonInput = {
      solanaPublicKey: this.solanaPublicKey,
      signingMessageDigest: hashValues([message]),
    };

    // Obtain SIWS envelope input for the signing message
    const siwsEnvelopeInput = parsedSigningMessage.type === 'structuredMessage'
      ? createSiwsEnvelopeForAptosStructuredMessage({
        ...parsedSigningMessage,
        ...commonInput,
        domain: this.domain,
      })
      : createSiwsEnvelopeForAptosTransaction({
        ...parsedSigningMessage,
        ...commonInput,
        domain: this.domain,
      });

    // Matching the signature will ensure that the following fields are matching:
    // - domain
    // - solanaPublicKey
    // - signing message digest
    // - chain
    // - message and nonce (structured message)
    // - entry function name (transaction)

    // Match solana signature
    const siwsEnvelopeBytes = createSolanaSignInMessage(siwsEnvelopeInput);
    const ed25519PublicKey = new Ed25519PublicKey(this.solanaPublicKey.toBytes());
    return ed25519PublicKey.verifySignature({ message: siwsEnvelopeBytes, signature });
  }

  async verifySignatureAsync(args: { aptosConfig: AptosConfig, message: HexInput, signature: Signature }): Promise<boolean> {
    return this.verifySignature({message: args.message, signature: args.signature});
  }

  serialize(serializer: Serializer) {
    serializer.serializeStr(this.domain);
    serializer.serializeFixedBytes(this.solanaPublicKey.toBytes());
    serializer.serializeStr(this.authenticationFunction);
  }

  static deserialize(deserializer: Deserializer) {
    const domain = deserializer.deserializeStr();
    const solanaPublicKeyBytes = deserializer.deserializeFixedBytes(32);
    const solanaPublicKey = new SolanaPublicKey(solanaPublicKeyBytes)
    const authenticationFunction = deserializer.deserializeStr();
    return new SolanaDerivedPublicKey({ domain, solanaPublicKey, authenticationFunction });
  }
}
