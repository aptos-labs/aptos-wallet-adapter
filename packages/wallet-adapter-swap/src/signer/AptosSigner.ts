import { AptosWallet } from "@xlabs-libs/wallet-aggregator-aptos";
import {
  Account,
  AccountAuthenticator,
  AnyRawTransaction,
  Aptos,
  AptosConfig,
  Network as AptosNetwork,
  Ed25519Account,
  Ed25519PrivateKey,
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
import { WalletContextState } from "@aptos-labs/wallet-adapter-react";

export class AptosSigner<N extends Network, C extends Chain>
  implements SignAndSendSigner<N, C>
{
  _chain: C;
  _address: string;
  _options: any;
  _wallet: WalletContextState;
  _feePayerAccount: Ed25519Account | undefined;

  constructor(
    chain: C,
    address: string,
    options: any,
    wallet: WalletContextState,
    feePayerAccount: Ed25519Account | undefined
  ) {
    this._chain = chain;
    this._address = address;
    this._options = options;
    this._wallet = wallet;
    this._feePayerAccount = feePayerAccount;
  }

  chain(): C {
    return this._chain;
  }
  address(): string {
    return this._address;
  }
  /* other methods... */

  async signAndSend(txs: UnsignedTransaction<N, C>[]): Promise<TxHash[]> {
    console.log("Signer signAndSend txs", txs);
    const txHashes: TxHash[] = [];

    for (const tx of txs) {
      const txId = await signAndSendTransaction(
        tx as AptosUnsignedTransaction<Network, AptosChains>,
        this._wallet,
        this._feePayerAccount
      );
      txHashes.push(txId);
    }
    return txHashes;
  }
}

export function fetchOptions() {
  const aptosWallets: Record<string, AptosWallet> = {};
  const walletCore = AptosWallet.walletCoreFactory(
    { network: AptosNetwork.TESTNET },
    true,
    []
  );
  walletCore.wallets.forEach((wallet) => {
    aptosWallets[wallet.name] = new AptosWallet(wallet, walletCore);
  });
  return aptosWallets;
}

export async function signAndSendTransaction(
  request: UnsignedTransaction<Network, AptosChains>,
  wallet: WalletContextState | undefined,
  feePayerAccount: Ed25519Account | undefined
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
    network: AptosNetwork.TESTNET,
  });
  const aptos = new Aptos(aptosConfig);

  const txnToSign = await aptos.transaction.build.simple({
    data: payload,
    sender: wallet.account?.address!,
    withFeePayer: feePayerAccount ? true : false,
  });
  const senderAuthenticator = await wallet.signTransaction(txnToSign);

  const txnToSubmit: {
    transaction: AnyRawTransaction;
    senderAuthenticator: AccountAuthenticator;
    feePayerAuthenticator?: AccountAuthenticator;
  } = {
    transaction: txnToSign,
    senderAuthenticator,
  };

  if (feePayerAccount) {
    const feePayerSignerAuthenticator = aptos.transaction.signAsFeePayer({
      signer: feePayerAccount,
      transaction: txnToSign,
    });
    txnToSubmit.feePayerAuthenticator = feePayerSignerAuthenticator;
  }

  const response = await aptos.transaction.submit.simple(txnToSubmit);
  console.log("response", response.hash);

  const tx = await aptos.waitForTransaction({
    transactionHash: response.hash,
  });

  return tx.hash;
}
