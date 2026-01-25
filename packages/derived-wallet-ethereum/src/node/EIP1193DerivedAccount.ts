import {
  AbstractedAccount,
  AccountAuthenticatorAbstraction,
  AnyRawTransaction,
} from "@aptos-labs/ts-sdk";
import { hashMessage, Signature, Wallet } from "ethers";
import { EIP1193DerivedPublicKey } from "../EIP1193DerivedPublicKey";
import { defaultEthereumAuthenticationFunction, EthereumAddress } from "../shared";
import {
  createMessageForEthereumTransaction,
  createAccountAuthenticatorForEthereumTransaction,
} from "../signAptosTransaction";

export interface EIP1193DerivedAccountParams {
  /** The Ethereum wallet (with private key) to sign with */
  ethereumWallet: Wallet;
  /** The domain (e.g., "my-dapp.com") */
  domain: string;
  /** The URI scheme (e.g., "https") - defaults to "https" */
  scheme?: string;
  /** Optional custom authentication function */
  authenticationFunction?: string;
}

/**
 * Programmatic Aptos account derived from an Ethereum wallet.
 *
 * Use this for server-side or script-based signing where you have
 * direct access to the Ethereum private key (no user interaction needed).
 *
 * For browser signing with wallet providers, use `EIP1193DerivedWallet` instead.
 *
 * @example
 * ```typescript
 * import { Wallet } from "ethers";
 * import { EIP1193DerivedAccount } from "@aptos-labs/derived-wallet-ethereum/node";
 *
 * const ethereumWallet = new Wallet("0x...");
 * const account = new EIP1193DerivedAccount({
 *   ethereumWallet,
 *   domain: "my-dapp.com",
 * });
 *
 * // Get the derived Aptos address
 * console.log(account.accountAddress.toString());
 *
 * // Submit a transaction
 * const transaction = await aptos.transaction.build.simple({
 *   sender: account.accountAddress,
 *   data: {
 *     function: "0x1::aptos_account::transfer",
 *     functionArguments: ["0xtea, 100],
 *   },
 * });

 * const response = await aptos.signAndSubmitTransaction({
 *   signer: account,
 *   transaction,
 * });
 * console.log("Transaction hash:", response.hash);
 * ```
 */
export class EIP1193DerivedAccount extends AbstractedAccount {
  readonly ethereumWallet: Wallet;
  readonly domain: string;
  readonly scheme: string;
  readonly authenticationFunction: string;
  readonly derivedPublicKey: EIP1193DerivedPublicKey;

  constructor(params: EIP1193DerivedAccountParams) {
    const {
      ethereumWallet,
      domain,
      scheme = "https",
      authenticationFunction = defaultEthereumAuthenticationFunction,
    } = params;

    const ethereumAddress = ethereumWallet.address as EthereumAddress;

    const derivedPublicKey = new EIP1193DerivedPublicKey({
      domain,
      ethereumAddress,
      authenticationFunction,
    });

    super({
      accountAddress: derivedPublicKey.authKey().derivedAddress(),
      authenticationFunction,
      // Note: signer is not used for SIWE-based signing
      signer: () => new Uint8Array(),
    });

    this.ethereumWallet = ethereumWallet;
    this.domain = domain;
    this.scheme = scheme;
    this.authenticationFunction = authenticationFunction;
    this.derivedPublicKey = derivedPublicKey;
  }

  /**
   * Sign a transaction using the SIWE envelope format.
   * This produces signatures compatible with the on-chain authentication function.
   *
   * @param transaction - The Aptos transaction to sign
   * @returns The account authenticator for the transaction
   */
  signTransactionWithAuthenticator(
    transaction: AnyRawTransaction,
  ): AccountAuthenticatorAbstraction {
    const ethereumAddress = this.ethereumWallet.address as EthereumAddress;
    const issuedAt = new Date();

    const { siweMessage, signingMessageDigest } =
      createMessageForEthereumTransaction({
        rawTransaction: transaction,
        authenticationFunction: this.authenticationFunction,
        ethereumAddress,
        domain: this.domain,
        uri: `${this.scheme}://${this.domain}`,
        issuedAt,
      });

    // Sign synchronously using the signing key (personal_sign format)
    const messageHash = hashMessage(siweMessage);
    const sig = this.ethereumWallet.signingKey.sign(messageHash);
    const siweSignature = Signature.from(sig).serialized;

    return createAccountAuthenticatorForEthereumTransaction(
      siweSignature,
      ethereumAddress,
      this.domain,
      this.scheme,
      this.authenticationFunction,
      signingMessageDigest,
      issuedAt,
    );
  }
}