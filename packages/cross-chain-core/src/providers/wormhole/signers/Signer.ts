import type { Account } from "@aptos-labs/ts-sdk";
import type { AdapterWallet } from "@aptos-labs/wallet-adapter-core";
import type {
  Chain,
  Network,
  SignAndSendSigner,
  TxHash,
  UnsignedTransaction,
} from "@wormhole-foundation/sdk";
import type { AptosChains } from "@wormhole-foundation/sdk-aptos/dist/cjs/types";
import type { AptosUnsignedTransaction } from "@wormhole-foundation/sdk-aptos/dist/cjs/unsignedTransaction";
import type {
  EvmChains,
  EvmUnsignedTransaction,
} from "@wormhole-foundation/sdk-evm";
import type { SolanaUnsignedTransaction } from "@wormhole-foundation/sdk-solana";
import type {
  SuiChains,
  SuiUnsignedTransaction,
} from "@wormhole-foundation/sdk-sui";
import type { CrossChainCore } from "../../../CrossChainCore";

import type { ChainConfig } from "../../../config";
import type { GasStationApiKey, OnTransactionSigned } from "../types";
import * as aptosSigner from "./AptosSigner";
import * as ethereumSigner from "./EthereumSigner";
import * as solanaSigner from "./SolanaSigner";
import * as suiSigner from "./SuiSigner";
export class Signer<N extends Network, C extends Chain>
  implements SignAndSendSigner<N, C>
{
  _chain: ChainConfig;
  _address: string;
  _options: any;
  _wallet: AdapterWallet;
  _crossChainCore: CrossChainCore;
  _sponsorAccount: Account | GasStationApiKey | undefined;
  _onTransactionSigned: OnTransactionSigned | undefined;
  _claimedTransactionHashes: string[] = [];
  /**
   * When true, signed tx hashes are written to
   * `_crossChainCore._lastSourceChainTxId` as a recovery side-channel.
   * Set to false for destination-chain claim signers so they don't
   * overwrite the source-chain burn hash.
   */
  _trackAsSourceChain: boolean;

  constructor(
    chain: ChainConfig,
    address: string,
    options: any,
    wallet: AdapterWallet,
    crossChainCore: CrossChainCore,
    sponsorAccount?: Account | GasStationApiKey | undefined,
    onTransactionSigned?: OnTransactionSigned,
    trackAsSourceChain: boolean = true,
  ) {
    this._chain = chain;
    this._address = address;
    this._options = options;
    this._wallet = wallet;
    this._crossChainCore = crossChainCore;
    this._sponsorAccount = sponsorAccount;
    this._onTransactionSigned = onTransactionSigned;
    this._trackAsSourceChain = trackAsSourceChain;
  }

  chain(): C {
    return this._chain.key as C;
  }
  address(): string {
    return this._address;
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
        this._chain,
        tx,
        this._wallet,
        this._options,
        this._crossChainCore,
        this._sponsorAccount,
      );
      if (this._trackAsSourceChain) {
        this._crossChainCore._lastSourceChainTxId = txId;
      }
      this._onTransactionSigned?.(tx.description, txId);
      txHashes.push(txId);
      this._claimedTransactionHashes.push(txId);
    }
    return txHashes;
  }
}

export const signAndSendTransaction = async (
  chain: ChainConfig,
  request: UnsignedTransaction<Network, Chain>,
  wallet: AdapterWallet,
  options: any = {},
  crossChainCore: CrossChainCore,
  sponsorAccount?: Account | GasStationApiKey | undefined,
): Promise<string> => {
  if (!wallet) {
    throw new Error("wallet is undefined");
  }

  const dappNetwork = crossChainCore._dappConfig.aptosNetwork;

  if (chain.context === "Solana") {
    const signature = await solanaSigner.signAndSendTransaction(
      request as SolanaUnsignedTransaction<Network>,
      wallet,
      options,
      crossChainCore,
    );
    return signature;
  } else if (chain.context === "Ethereum") {
    const tx = await ethereumSigner.signAndSendTransaction(
      request as EvmUnsignedTransaction<Network, EvmChains>,
      wallet,
      chain.displayName,
    );
    return tx;
  } else if (chain.context === "Sui") {
    const tx = await suiSigner.signAndSendTransaction(
      request as SuiUnsignedTransaction<Network, SuiChains>,
      wallet,
    );
    return tx;
  } else if (chain.context === "Aptos") {
    const tx = await aptosSigner.signAndSendTransaction(
      request as AptosUnsignedTransaction<Network, AptosChains>,
      wallet,
      sponsorAccount,
      dappNetwork,
      crossChainCore,
    );
    return tx;
  } else {
    throw new Error(`Unsupported chain: ${chain}`);
  }
};
