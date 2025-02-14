import {
  UnsignedTransaction,
  Network,
  Chain,
  TxHash,
  SignAndSendSigner,
} from "@wormhole-foundation/sdk";
import { Wallet } from "@xlabs-libs/wallet-aggregator-core";
import { SolanaWallet } from "@xlabs-libs/wallet-aggregator-solana";
import { Eip6963Wallet } from "@xlabs-libs/wallet-aggregator-evm";
import { SolanaUnsignedTransaction } from "@wormhole-foundation/sdk-solana";

import {
  EvmUnsignedTransaction,
  EvmChains,
} from "@wormhole-foundation/sdk-evm";

import * as solanaSigner from "./SolanaSigner";
import * as ethereumSigner from "./EthereumSigner";
import { testnetChains } from "../utils/chains/testnet";

export class Signer<N extends Network, C extends Chain>
  implements SignAndSendSigner<N, C>
{
  _chain: C;
  _address: string;
  _options: any;
  _wallet: Wallet;

  constructor(chain: C, address: string, options: any, wallet: Wallet) {
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
        this._chain,
        tx,
        this._wallet,
        this._options
      );
      txHashes.push(txId);
    }
    return txHashes;
  }
}

export const signAndSendTransaction = async (
  chain: Chain,
  request: UnsignedTransaction<Network, Chain>,
  wallet: Wallet,
  options: any = {}
): Promise<string> => {
  if (!wallet) {
    throw new Error("wallet is undefined");
  }
  console.log("chain", chain);
  const chainContext =
    testnetChains[chain as keyof typeof testnetChains].context;
  console.log("chainContext", chainContext);
  // TODO make it dynamic import
  if (chainContext === "Solana") {
    const signature = await solanaSigner.signAndSendTransaction(
      request as SolanaUnsignedTransaction<Network>,
      wallet as SolanaWallet,
      options
    );
    return signature;
  } else if (chainContext === "Ethereum") {
    const tx = await ethereumSigner.signAndSendTransaction(
      request as EvmUnsignedTransaction<Network, EvmChains>,
      wallet as Eip6963Wallet,
      chain,
      options
    );
    return tx;
  } else {
    throw new Error(`Unsupported chain: ${chain}`);
  }
};
