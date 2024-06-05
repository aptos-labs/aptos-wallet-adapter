import {
  UserResponse,
  AptosSignTransactionOutput,
  AptosSignMessageOutput,
  AptosSignMessageInput,
  AptosWallet,
  UserResponseStatus,
  AptosSignAndSubmitTransactionOutput,
  AccountInfo as StandardAccountInfo,
  AptosConnectOutput,
} from "@aptos-labs/wallet-standard";
import {
  AnyRawTransaction,
  PendingTransactionResponse,
  Aptos,
  MultiEd25519Signature,
  MultiEd25519PublicKey,
} from "@aptos-labs/ts-sdk";

import { WalletReadyState } from "../constants";
import {
  WalletConnectionError,
  WalletSignAndSubmitMessageError,
  WalletSignMessageAndVerifyError,
  WalletSignMessageError,
} from "../error";
import {
  AccountInfo,
  InputTransactionData,
  Wallet,
} from "../LegacyWalletPlugins";
import { generalizedErrorMessage } from "../utils";

export type AptosStandardWallet = AptosWallet & {
  readyState?: WalletReadyState;
};

export class WalletStandardCore {
  async connect(wallet: Wallet) {
    const response =
      (await wallet.connect()) as UserResponse<AptosConnectOutput>;

    if (response.status === UserResponseStatus.REJECTED) {
      throw new WalletConnectionError("User has rejected the request").message;
    }
    return response.args;
  }

  /**
   * Signs and submits a transaction to chain
   *
   * @param transactionInput InputTransactionData
   * @returns PendingTransactionResponse
   */
  async signAndSubmitTransaction(
    transactionInput: InputTransactionData,
    aptos: Aptos,
    account: AccountInfo,
    wallet: Wallet,
    standardWallets: ReadonlyArray<AptosStandardWallet>
  ): Promise<AptosSignAndSubmitTransactionOutput> {
    try {
      // need to find the standard wallet type to do the
      // next features check
      const standardWallet = standardWallets.find(
        (standardWallet: AptosStandardWallet) =>
          wallet.name === standardWallet.name
      );

      // check for backward compatibility. before version 1.1.0 the standard expected
      // AnyRawTransaction input so the adapter built the transaction before sending it to the wallet
      if (
        standardWallet?.features["aptos:signAndSubmitTransaction"]?.version !==
        "1.1.0"
      ) {
        const transaction = await aptos.transaction.build.simple({
          sender: account.address.toString(),
          data: transactionInput.data,
          options: transactionInput.options,
        });
        const response = (await wallet.signAndSubmitTransaction!(
          transaction
        )) as UserResponse<AptosSignAndSubmitTransactionOutput>;

        if (response.status === UserResponseStatus.REJECTED) {
          throw new WalletConnectionError("User has rejected the request")
            .message;
        }

        return response.args;
      }

      // build standard json format
      const transaction = {
        gasUnitPrice: transactionInput.options?.gasUnitPrice,
        maxGasAmount: transactionInput.options?.maxGasAmount,
        payload: transactionInput.data,
      };
      const response = (await wallet.signAndSubmitTransaction!(
        transaction
      )) as UserResponse<AptosSignAndSubmitTransactionOutput>;

      if (response.status === UserResponseStatus.REJECTED) {
        throw new WalletConnectionError("User has rejected the request")
          .message;
      }

      return response.args;
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignAndSubmitMessageError(errMsg).message;
    }
  }

  /**
   * Signs a transaction
   *
   * To support both existing wallet adapter V1 and V2, we support 2 input types
   *
   * @param transactionOrPayload AnyRawTransaction
   * @param options asFeePayer. To sign a transaction as the fee payer sponsor
   *
   * @returns AptosSignTransactionOutput
   */
  async signTransaction(
    transaction: AnyRawTransaction,
    wallet: Wallet,
    asFeePayer?: boolean
  ): Promise<AptosSignTransactionOutput> {
    const response = (await wallet.signTransaction!(
      transaction,
      asFeePayer
    )) as UserResponse<AptosSignTransactionOutput>;
    if (response.status === UserResponseStatus.REJECTED) {
      throw new WalletConnectionError("User has rejected the request").message;
    }
    return response.args;
  }

  /**
   * Sign message
   *
   * @param message AptosSignMessageInput
   * @return AptosSignMessageOutput
   * @throws WalletSignMessageError
   */
  async signMessage(
    message: AptosSignMessageInput,
    wallet: Wallet
  ): Promise<AptosSignMessageOutput> {
    try {
      const response = (await wallet.signMessage(
        message
      )) as UserResponse<AptosSignMessageOutput>;
      if (response.status === UserResponseStatus.REJECTED) {
        throw new WalletConnectionError("User has rejected the request")
          .message;
      }
      return response.args;
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignMessageError(errMsg).message;
    }
  }

  /**
   * Signs a message and verifies the signer
   * @param message AptosSignMessageInput
   * @returns boolean
   */
  async signMessageAndVerify(
    message: AptosSignMessageInput,
    wallet: Wallet
  ): Promise<boolean> {
    try {
      // sign the message
      const response = (await wallet.signMessage(
        message
      )) as UserResponse<AptosSignMessageOutput>;
      // standard wallet account() method is a required method
      const account = (await wallet.account!()) as StandardAccountInfo;

      if (response.status === UserResponseStatus.REJECTED) {
        throw new WalletConnectionError("Failed to sign a message").message;
      }

      let verified = false;
      // if is a multi sig wallet with a MultiEd25519Signature type
      if (response.args.signature instanceof MultiEd25519Signature) {
        if (!(account.publicKey instanceof MultiEd25519PublicKey)) {
          throw new WalletSignMessageAndVerifyError(
            "Public key and Signature type mismatch"
          ).message;
        }
        const { fullMessage, signature } = response.args;
        const bitmap = signature.bitmap;
        if (bitmap) {
          const minKeysRequired = account.publicKey.threshold;
          if (signature.signatures.length < minKeysRequired) {
            verified = false;
          } else {
            verified = account.publicKey.verifySignature({
              message: new TextEncoder().encode(fullMessage),
              signature,
            });
          }
        }
      } else {
        verified = account.publicKey.verifySignature({
          message: new TextEncoder().encode(response.args.fullMessage),
          signature: response.args.signature,
        });
      }
      return verified;
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignMessageAndVerifyError(errMsg).message;
    }
  }
}
