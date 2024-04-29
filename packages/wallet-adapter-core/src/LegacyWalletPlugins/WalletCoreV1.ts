import { HexString, TxnBuilderTypes, Types } from "aptos";
import EventEmitter from "eventemitter3";
import { Buffer } from "buffer";
import {
  InputEntryFunctionDataWithRemoteABI,
  InputGenerateTransactionPayloadData,
  generateTransactionPayload,
} from "@aptos-labs/ts-sdk";
import nacl from "tweetnacl";
import {
  WalletNotSupportedMethod,
  WalletSignAndSubmitMessageError,
  WalletSignMessageAndVerifyError,
  WalletSignTransactionError,
} from "../error";
import {
  Wallet,
  WalletCoreEvents,
  TransactionOptions,
  NetworkInfo,
  InputTransactionData,
  AccountInfo,
  SignMessagePayload,
  SignMessageResponse,
} from "./types";

import {
  convertV2PayloadToV1JSONPayload,
  convertV2TransactionPayloadToV1BCSPayload,
} from "./conversion";
import {
  areBCSArguments,
  generalizedErrorMessage,
  getAptosConfig,
} from "../utils";

export class WalletCoreV1 extends EventEmitter<WalletCoreEvents> {
  async connect(wallet: Wallet) {
    const account = await wallet.connect();
    return account;
  }

  /**
   * Resolve the transaction type (BCS arguments or Simple arguments)
   *
   * @param payloadData
   * @param network
   * @param wallet
   * @param transactionInput
   *
   * @returns
   */
  async resolveSignAndSubmitTransaction(
    payloadData: InputGenerateTransactionPayloadData,
    network: NetworkInfo | null,
    wallet: Wallet,
    transactionInput: InputTransactionData
  ) {
    // first check if each argument is a BCS serialized argument
    if (areBCSArguments(payloadData.functionArguments)) {
      const aptosConfig = getAptosConfig(network);
      const newPayload = await generateTransactionPayload({
        ...(payloadData as InputEntryFunctionDataWithRemoteABI),
        aptosConfig: aptosConfig,
      });
      const oldTransactionPayload =
        convertV2TransactionPayloadToV1BCSPayload(newPayload);
      // Call and return signAndSubmitBCSTransaction response
      return await this.signAndSubmitBCSTransaction(
        oldTransactionPayload,
        wallet!,
        {
          max_gas_amount: transactionInput.options?.maxGasAmount
            ? BigInt(transactionInput.options?.maxGasAmount)
            : undefined,
          gas_unit_price: transactionInput.options?.gasUnitPrice
            ? BigInt(transactionInput.options?.gasUnitPrice)
            : undefined,
        }
      );
    }

    // if it is not a bcs serialized arguments transaction, convert to the old
    // json format
    const oldTransactionPayload = convertV2PayloadToV1JSONPayload(payloadData);
    return await this.signAndSubmitTransaction(oldTransactionPayload, wallet!, {
      max_gas_amount: transactionInput.options?.maxGasAmount
        ? BigInt(transactionInput.options?.maxGasAmount)
        : undefined,
      gas_unit_price: transactionInput.options?.gasUnitPrice
        ? BigInt(transactionInput.options?.gasUnitPrice)
        : undefined,
    });
  }

  /**
  Sign and submit an entry (not bcs serialized) transaction type to chain.
  @param transaction a non-bcs serialized transaction
  @param options max_gas_amount and gas_unit_limit
  @return response from the wallet's signAndSubmitTransaction function
  @throws WalletSignAndSubmitMessageError
  */
  async signAndSubmitTransaction(
    transaction: Types.TransactionPayload,
    wallet: Wallet,
    options?: TransactionOptions
  ): Promise<any> {
    try {
      const response = await (wallet as any).signAndSubmitTransaction(
        transaction,
        options
      );
      return response;
    } catch (error: any) {
      const errMsg =
        typeof error == "object" && "message" in error ? error.message : error;
      throw new WalletSignAndSubmitMessageError(errMsg).message;
    }
  }

  /**
   Sign and submit a bsc serialized transaction type to chain.
   @param transaction a bcs serialized transaction
   @param options max_gas_amount and gas_unit_limit
   @return response from the wallet's signAndSubmitBCSTransaction function
   @throws WalletSignAndSubmitMessageError
   */
  async signAndSubmitBCSTransaction(
    transaction: TxnBuilderTypes.TransactionPayload,
    wallet: Wallet,
    options?: TransactionOptions
  ): Promise<any> {
    if (!("signAndSubmitBCSTransaction" in wallet)) {
      throw new WalletNotSupportedMethod(
        `Submit a BCS Transaction is not supported by ${wallet.name}`
      ).message;
    }
    try {
      const response = await (wallet as any).signAndSubmitBCSTransaction(
        transaction,
        options
      );
      return response;
    } catch (error: any) {
      const errMsg =
        typeof error == "object" && "message" in error ? error.message : error;
      throw new WalletSignAndSubmitMessageError(errMsg).message;
    }
  }

  /**
   Sign transaction
   @param transaction
   @param options max_gas_amount and gas_unit_limit
   @return response from the wallet's signTransaction function
   @throws WalletSignTransactionError
   */
  async signTransaction(
    transaction: Types.TransactionPayload,
    wallet: Wallet,
    options?: TransactionOptions
  ): Promise<Uint8Array | null> {
    try {
      const response = await (wallet as any).signTransaction(
        transaction,
        options
      );
      return response;
    } catch (error: any) {
      const errMsg =
        typeof error == "object" && "message" in error ? error.message : error;
      throw new WalletSignTransactionError(errMsg).message;
    }
  }

  /**
   * Signs a message and verifies the signer
   * @param message SignMessagePayload
   * @returns boolean
   */
  async signMessageAndVerify(
    message: SignMessagePayload,
    wallet: Wallet,
    account: AccountInfo
  ): Promise<boolean> {
    try {
      const response = await wallet.signMessage(message);
      if (!response)
        throw new WalletSignMessageAndVerifyError("Failed to sign a message")
          .message;
      console.log("signMessageAndVerify signMessage response", response);

      // Verify that the bytes were signed using the private key that matches the known public key
      let verified = false;
      if (Array.isArray((response as SignMessageResponse).signature)) {
        // multi sig wallets
        const { fullMessage, signature, bitmap } =
          response as SignMessageResponse;
        if (bitmap) {
          const minKeysRequired = account.minKeysRequired as number;
          if ((signature as string[]).length < minKeysRequired) {
            verified = false;
          } else {
            // Getting an array which marks the keys signing the message with 1, while marking 0 for the keys not being used.
            const bits = Array.from(bitmap).flatMap((n) =>
              Array.from({ length: 8 }).map((_, i) => (n >> i) & 1)
            );
            // Filter out indexes of the keys we need
            const index = bits.map((_, i) => i).filter((i) => bits[i]);

            const publicKeys = account.publicKey as string[];
            const matchedPublicKeys = publicKeys.filter(
              (_: string, i: number) => index.includes(i)
            );

            verified = true;
            for (let i = 0; i < (signature as string[]).length; i++) {
              const isSigVerified = nacl.sign.detached.verify(
                Buffer.from(fullMessage),
                Buffer.from((signature as string[])[i], "hex"),
                Buffer.from(matchedPublicKeys[i], "hex")
              ); // `isSigVerified` should be `true` for every signature

              if (!isSigVerified) {
                verified = false;
                break;
              }
            }
          }
        } else {
          throw new WalletSignMessageAndVerifyError("Failed to get a bitmap")
            .message;
        }
      } else {
        // single sig wallets
        // support for when address doesnt have hex prefix (0x)
        const currentAccountPublicKey = new HexString(
          account.publicKey as string
        );
        // support for when address doesnt have hex prefix (0x)
        const signature = new HexString(
          (response as SignMessageResponse).signature as string
        );
        verified = nacl.sign.detached.verify(
          Buffer.from((response as SignMessageResponse).fullMessage),
          Buffer.from(signature.noPrefix(), "hex"),
          Buffer.from(currentAccountPublicKey.noPrefix(), "hex")
        );
      }
      return verified;
    } catch (error: any) {
      const errMsg = generalizedErrorMessage(error);
      throw new WalletSignMessageAndVerifyError(errMsg).message;
    }
  }
}
