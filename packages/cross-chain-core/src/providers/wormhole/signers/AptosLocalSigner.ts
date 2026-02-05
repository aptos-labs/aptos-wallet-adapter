import {
  AccountAuthenticator,
  AnyRawTransaction,
  Aptos,
  AptosConfig,
  Network as AptosNetwork,
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
import { GasStationApiKey } from "../types";

export class AptosLocalSigner<
  N extends Network,
  C extends Chain,
> implements SignAndSendSigner<N, C> {
  _chain: C;
  _options: any;
  _wallet: Account;
  _sponsorAccount: Account | GasStationApiKey | undefined;
  _claimedTransactionHashes: string;
  _dappNetwork: AptosNetwork;
  constructor(
    chain: C,
    options: any,
    wallet: Account,
    feePayerAccount: Account | GasStationApiKey | undefined,
    dappNetwork: AptosNetwork,
  ) {
    this._chain = chain;
    this._options = options;
    this._wallet = wallet;
    this._sponsorAccount = feePayerAccount;
    this._claimedTransactionHashes = "";
    this._dappNetwork = dappNetwork;
  }

  chain(): C {
    return this._chain;
  }
  address(): string {
    return this._wallet.accountAddress.toString();
  }

  claimedTransactionHashes(): string {
    return this._claimedTransactionHashes;
  }

  async signAndSend(txs: UnsignedTransaction<N, C>[]): Promise<TxHash[]> {
    const txHashes: TxHash[] = [];

    for (const tx of txs) {
      const txId = await signAndSendTransaction(
        tx as AptosUnsignedTransaction<Network, AptosChains>,
        this._wallet,
        this._sponsorAccount,
        this._dappNetwork,
      );
      txHashes.push(txId);
      this._claimedTransactionHashes = txId;
    }
    return txHashes;
  }
}

export async function signAndSendTransaction(
  request: UnsignedTransaction<Network, AptosChains>,
  wallet: Account,
  sponsorAccount: Account | GasStationApiKey | undefined,
  dappNetwork: AptosNetwork,
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

  const aptosConfig = new AptosConfig({
    network: dappNetwork,
  });
  const aptos = new Aptos(aptosConfig);

  const txnToSign = await aptos.transaction.build.simple({
    data: payload,
    sender: wallet.accountAddress.toString(),
    withFeePayer: sponsorAccount ? true : false,
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
    if (typeof sponsorAccount === "string") {
      // TODO: handle gas station integration
    } else {
      const feePayerSignerAuthenticator = aptos.transaction.signAsFeePayer({
        signer: sponsorAccount as Account,
        transaction: txnToSign,
      });
      txnToSubmit.feePayerAuthenticator = feePayerSignerAuthenticator;
    }
  }
  const response = await aptos.transaction.submit.simple(txnToSubmit);

  const tx = await aptos.waitForTransaction({
    transactionHash: response.hash,
  });

  return tx.hash;
}
