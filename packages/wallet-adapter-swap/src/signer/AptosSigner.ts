import { Wallet } from "@xlabs-libs/wallet-aggregator-core";
import { AptosWallet } from "@xlabs-libs/wallet-aggregator-aptos";
import {
  Aptos,
  AptosConfig,
  Network as AptosNetwork,
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

  constructor(
    chain: C,
    address: string,
    options: any,
    wallet: WalletContextState
  ) {
    this._chain = chain;
    this._address = address;
    this._options = options;
    this._wallet = wallet;
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
        this._wallet
      );
      txHashes.push(txId);
    }
    return txHashes;
  }
}

export function fetchOptions() {
  // const aptosWalletConfig = {
  //   network: config.isMainnet
  //     ? ('mainnet' as AptosNetwork)
  //     : ('testnet' as AptosNetwork),
  // };
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
  wallet: WalletContextState | undefined
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

  console.log("payload", payload);
  const tx = await wallet.signAndSubmitTransaction({
    data: payload,
    options: {
      // this is set to 5 minutes in case the user takes a while to sign the transaction
      expireTimestamp: Math.floor(Date.now() / 1000) + 60 * 5,
    },
  });
  console.log("aptos tx", tx);
  await aptos.waitForTransaction({ transactionHash: tx.hash });

  return tx;
}
