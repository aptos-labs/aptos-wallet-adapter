import {
  UnsignedTransaction,
  Network,
  Chain,
  TxHash,
  SignAndSendSigner,
} from "@wormhole-foundation/sdk";
import { SolanaUnsignedTransaction } from "@wormhole-foundation/sdk-solana";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-core";
import {
  EvmUnsignedTransaction,
  EvmChains,
} from "@wormhole-foundation/sdk-evm";

import * as solanaSigner from "./SolanaSigner";
import * as ethereumSigner from "./EthereumSigner";
// import {
//   SuiChains,
//   SuiUnsignedTransaction,
// } from "@wormhole-foundation/sdk-sui";
// import * as suiSigner from "./SuiSigner";

import { ChainConfig } from "../../../config";
import { CrossChainCore } from "../../../CrossChainCore";
export class Signer<N extends Network, C extends Chain>
  implements SignAndSendSigner<N, C>
{
  _chain: ChainConfig;
  _address: string;
  _options: any;
  _wallet: AdapterWallet;
  _crossChainCore?: CrossChainCore;

  constructor(
    chain: ChainConfig,
    address: string,
    options: any,
    wallet: AdapterWallet,
    crossChainCore?: CrossChainCore
  ) {
    this._chain = chain;
    this._address = address;
    this._options = options;
    this._wallet = wallet;
    this._crossChainCore = crossChainCore;
  }

  chain(): C {
    return this._chain.displayName as C;
  }
  address(): string {
    return this._address;
  }

  async signAndSend(txs: UnsignedTransaction<N, C>[]): Promise<TxHash[]> {
    const txHashes: TxHash[] = [];

    for (const tx of txs) {
      const txId = await signAndSendTransaction(
        this._chain,
        tx,
        this._wallet,
        this._options,
        this._crossChainCore
      );
      txHashes.push(txId);
    }
    return txHashes;
  }
}

export const signAndSendTransaction = async (
  chain: ChainConfig,
  request: UnsignedTransaction<Network, Chain>,
  wallet: AdapterWallet,
  options: any = {},
  crossChainCore?: CrossChainCore
): Promise<string> => {
  if (!wallet) {
    throw new Error("wallet is undefined");
  }

  if (chain.context === "Solana") {
    const signature = await solanaSigner.signAndSendTransaction(
      request as SolanaUnsignedTransaction<Network>,
      wallet,
      options,
      crossChainCore
    );
    return signature;
  } else if (chain.context === "Ethereum") {
    const tx = await ethereumSigner.signAndSendTransaction(
      request as EvmUnsignedTransaction<Network, EvmChains>,
      wallet,
      chain.displayName,
      options
    );
    return tx;
  } else {
    throw new Error(`Unsupported chain: ${chain}`);
  }
};
