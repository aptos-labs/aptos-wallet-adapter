import { TxnBuilderTypes, Types } from "aptos";
import EventEmitter from "eventemitter3";

import {
  WalletSignAndSubmitMessageError,
  WalletSignTransactionError,
} from "./error";
import { Wallet, WalletCoreEvents, TransactionOptions } from "./types";

export class WalletCoreV1 extends EventEmitter<WalletCoreEvents> {
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
   Sign transaction (doesnt submit to chain).
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
}
