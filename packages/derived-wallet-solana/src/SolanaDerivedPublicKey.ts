import { computeDomainAuthenticationKey, parseAptosSigningMessage } from '@aptos-labs/derived-wallet-base';
import {
  AccountPublicKey,
  AuthenticationKey,
  Deserializer,
  Ed25519PublicKey,
  Ed25519Signature,
  hashValues,
  Serializer,
  VerifySignatureArgs,
} from '@aptos-labs/ts-sdk';
import { createSignInMessage as createSolanaSignInMessage } from '@solana/wallet-standard-util';
import { PublicKey as SolanaPublicKey } from '@solana/web3.js';
import { createSiwsEnvelopeForAptosStructuredMessage } from './createSiwsEnvelopeForStructuredMessage';
import { createSiwsEnvelopeForAptosTransaction } from './createSiwsEnvelopeForTransaction';

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

    const utf8EncodedDomain = new TextEncoder().encode(domain);
    const solanaPublicKeyBytes = solanaPublicKey.toBytes();

    const serializer = new Serializer();
    serializer.serializeBytes(utf8EncodedDomain);
    serializer.serializeFixedBytes(solanaPublicKeyBytes); // fixed length 32 bytes
    const accountIdentifier = serializer.toUint8Array();

    this._authKey = computeDomainAuthenticationKey(
      authenticationFunction,
      accountIdentifier,
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

    const signingMessageDigest = hashValues([message]);

    // Obtain SIWS envelope input for the signing message
    const siwsEnvelopeInput = parsedSigningMessage.type === 'structuredMessage'
      ? createSiwsEnvelopeForAptosStructuredMessage({
        solanaPublicKey: this.solanaPublicKey,
        structuredMessage: parsedSigningMessage.structuredMessage,
        digest: signingMessageDigest,
      })
      : createSiwsEnvelopeForAptosTransaction({
        solanaPublicKey: this.solanaPublicKey,
        rawTransaction: parsedSigningMessage.rawTransaction,
        digest: signingMessageDigest,
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
