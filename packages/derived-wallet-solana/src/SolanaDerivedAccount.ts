import {
  AbstractedAccount,
  type AccountAuthenticatorAbstraction,
  type AnyRawTransaction,
} from "@aptos-labs/ts-sdk";
import { createSignInMessage } from "@solana/wallet-standard-util";
import type { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { SolanaDerivedPublicKey } from "./SolanaDerivedPublicKey";
import { defaultSolanaAuthenticationFunction } from "./shared";
import {
  createMessageForSolanaTransaction,
  createAccountAuthenticatorForSolanaTransaction,
} from "./signAptosTransaction";

export interface SolanaDerivedAccountParams {
  /** The Solana keypair to sign with */
  solanaKeypair: Keypair;
  /** The domain (e.g., "my-dapp.com") */
  domain: string;
  /** Optional custom authentication function */
  authenticationFunction?: string;
}

/**
 * Programmatic Aptos account derived from a Solana keypair.
 *
 * Use this for server-side or script-based signing where you have
 * direct access to the Solana keypair (no user interaction needed).
 *
 * For browser signing with wallet adapters, use `SolanaDerivedWallet` or
 * the `useSolanaDerivedWallet` React hook instead.
 *
 * @example
 * ```typescript
 * import { Keypair } from "@solana/web3.js";
 * import { SolanaDerivedAccount } from "@aptos-labs/derived-wallet-solana";
 *
 * const solanaKeypair = Keypair.generate();
 * const account = new SolanaDerivedAccount({
 *   solanaKeypair,
 *   domain: "my-dapp.com",
 * });
 *
 * // Get the derived Aptos address
 * console.log(account.accountAddress.toString());
 *
 * // Sign a transaction
 * const authenticator = account.signTransactionWithAuthenticator(rawTransaction);
 * ```
 */
export class SolanaDerivedAccount extends AbstractedAccount {
  readonly solanaKeypair: Keypair;
  readonly domain: string;
  readonly authenticationFunction: string;
  readonly derivedPublicKey: SolanaDerivedPublicKey;

  constructor(params: SolanaDerivedAccountParams) {
    const {
      solanaKeypair,
      domain,
      authenticationFunction = defaultSolanaAuthenticationFunction,
    } = params;

    const derivedPublicKey = new SolanaDerivedPublicKey({
      domain,
      solanaPublicKey: solanaKeypair.publicKey,
      authenticationFunction,
    });

    super({
      accountAddress: derivedPublicKey.authKey().derivedAddress(),
      authenticationFunction,
      signer: (digest) =>
        nacl.sign.detached(digest as Uint8Array, solanaKeypair.secretKey),
    });

    this.solanaKeypair = solanaKeypair;
    this.domain = domain;
    this.authenticationFunction = authenticationFunction;
    this.derivedPublicKey = derivedPublicKey;
  }

  /**
   * Sign a transaction using the SIWS envelope format.
   * This produces signatures compatible with the on-chain authentication function.
   *
   * @param transaction - The Aptos transaction to sign
   * @returns The account authenticator for the transaction
   */
  signTransactionWithAuthenticator(
    transaction: AnyRawTransaction,
  ): AccountAuthenticatorAbstraction {
    const { siwsInput, signingMessageDigest } =
      createMessageForSolanaTransaction({
        rawTransaction: transaction,
        authenticationFunction: this.authenticationFunction,
        solanaPublicKey: this.solanaKeypair.publicKey,
        domain: this.domain,
      });

    const messageToSign = createSignInMessage(siwsInput);
    const signatureBytes = nacl.sign.detached(
      messageToSign,
      this.solanaKeypair.secretKey,
    );

    return createAccountAuthenticatorForSolanaTransaction(
      signatureBytes,
      this.solanaKeypair.publicKey,
      this.domain,
      this.authenticationFunction,
      signingMessageDigest,
    );
  }
}

