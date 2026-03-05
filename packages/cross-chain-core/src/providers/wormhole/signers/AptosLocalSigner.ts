import {
  AccountAuthenticator,
  AnyRawTransaction,
  Aptos,
  AptosConfig,
  Account,
} from "@aptos-labs/ts-sdk";

import {
  Chain,
  Network,
  SignAndSendSigner,
  TxHash,
  UnsignedTransaction,
} from "@wormhole-foundation/sdk";
import {
  AptosUnsignedTransaction,
  AptosChains,
} from "@wormhole-foundation/sdk-aptos";
import {
  OnTransactionSigned,
  validateExpireTimestamp,
} from "../types";
import { CrossChainCore } from "../../../CrossChainCore";

export class AptosLocalSigner<
  N extends Network,
  C extends Chain,
> implements SignAndSendSigner<N, C> {
  _chain: C;
  _options: any;
  _wallet: Account;
  _sponsorAccount: Account | undefined;
  _onTransactionSigned: OnTransactionSigned | undefined;
  _crossChainCore: CrossChainCore;
  _claimedTransactionHashes: string[] = [];
  constructor(
    chain: C,
    options: any,
    wallet: Account,
    feePayerAccount: Account | undefined,
    crossChainCore: CrossChainCore,
    onTransactionSigned?: OnTransactionSigned,
  ) {
    this._chain = chain;
    this._options = options;
    this._wallet = wallet;
    this._sponsorAccount = feePayerAccount;
    this._crossChainCore = crossChainCore;
    this._onTransactionSigned = onTransactionSigned;
  }

  chain(): C {
    return this._chain;
  }
  address(): string {
    return this._wallet.accountAddress.toString();
  }

  claimedTransactionHashes(): string {
    return this._claimedTransactionHashes.join(",");
  }

  async signAndSend(txs: UnsignedTransaction<N, C>[]): Promise<TxHash[]> {
    const txHashes: TxHash[] = [];
    this._claimedTransactionHashes = [];

    for (const tx of txs) {
      this._onTransactionSigned?.(tx.description, null);
      const txId = await signAndSendTransaction(
        tx as AptosUnsignedTransaction<Network, AptosChains>,
        this._wallet,
        this._sponsorAccount,
        this._crossChainCore,
      );
      this._onTransactionSigned?.(tx.description, txId);
      txHashes.push(txId);
      this._claimedTransactionHashes.push(txId);
    }
    return txHashes;
  }
}

export async function signAndSendTransaction(
  request: UnsignedTransaction<Network, AptosChains>,
  wallet: Account,
  sponsorAccount: Account | undefined,
  crossChainCore: CrossChainCore,
) {
  if (!wallet) {
    throw new Error("Wallet is undefined");
  }

  const payload = request.transaction;
  // The wallets do not handle Uint8Array serialization
  payload.functionArguments = payload.functionArguments.map((a: any) => {
    if (a instanceof Uint8Array) {
      return Array.from(a);
    } else if (typeof a === "bigint") {
      return a.toString();
    } else {
      return a;
    }
  });

  const dappNetwork = crossChainCore._dappConfig.aptosNetwork;
  const aptosConfig = new AptosConfig({
    network: dappNetwork,
  });
  const aptos = new Aptos(aptosConfig);

  const expireTimestamp = crossChainCore._dappConfig.getExpireTimestamp?.();
  if (typeof expireTimestamp !== "undefined") {
    validateExpireTimestamp(expireTimestamp);
  }
  const txnToSign = await aptos.transaction.build.simple({
    data: payload,
    sender: wallet.accountAddress.toString(),
    withFeePayer: sponsorAccount ? true : false,
    ...(typeof expireTimestamp !== "undefined"
      ? { options: { expireTimestamp } }
      : {}),
  });

  const senderAuthenticator = await aptos.transaction.sign({
    signer: wallet,
    transaction: txnToSign,
  });

  const txnToSubmit: {
    transaction: AnyRawTransaction;
    senderAuthenticator: AccountAuthenticator;
    feePayerAuthenticator?: AccountAuthenticator;
  } = {
    transaction: txnToSign,
    senderAuthenticator,
  };

  if (sponsorAccount) {
    const feePayerSignerAuthenticator = aptos.transaction.signAsFeePayer({
      signer: sponsorAccount,
      transaction: txnToSign,
    });
    txnToSubmit.feePayerAuthenticator = feePayerSignerAuthenticator;
  }
  const response = await aptos.transaction.submit.simple(txnToSubmit);

  const tx = await aptos.waitForTransaction({
    transactionHash: response.hash,
  });

  return tx.hash;
}
