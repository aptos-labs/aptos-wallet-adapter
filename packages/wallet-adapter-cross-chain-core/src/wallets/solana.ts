import {
  isWalletAdapterCompatibleStandardWallet,
  WalletAdapter,
} from "@solana/wallet-adapter-base";
import { StandardWalletAdapter } from "@solana/wallet-standard-wallet-adapter-base";
import {
  AccountInfo,
  Connection,
  ParsedAccountData,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { getWallets } from "@wallet-standard/app";
import {
  AttestationReceipt,
  Chain,
  Wormhole,
  routes,
} from "@wormhole-foundation/sdk";
import { UsdcBalance, WormholeRequest } from "../CrossChainCore";

import { WormholeRouteResponse } from "../CrossChainCore";
import { WormholeQuote } from "../CrossChainCore";
import { Signer } from "../providers/wormhole/signers";

import { SolanaWallet } from "@xlabs-libs/wallet-aggregator-solana";
import { CrossChainWallet } from "./core";
import { AccountAddressInput } from "@aptos-labs/ts-sdk";
import { InputGenerateTransactionPayloadData } from "@aptos-labs/ts-sdk";
import { InputGenerateTransactionOptions } from "@aptos-labs/ts-sdk";

import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

export function getSolanaStandardWallets(
  connection: Connection
): AptosSolanaWallet[] {
  // from https://github.com/solana-labs/wallet-standard/blob/c68c26604e0b9624e924292e243df44c742d1c00/packages/wallet-adapter/react/src/useStandardWalletAdapters.ts#L78
  return getWallets()
    .get()
    .filter(isWalletAdapterCompatibleStandardWallet)
    .map(
      (wallet) =>
        new AptosSolanaWallet(new StandardWalletAdapter({ wallet }), connection)
    );
}

export type InputTransactionData = {
  sender?: AccountAddressInput;
  data: InputGenerateTransactionPayloadData;
  options?: InputGenerateTransactionOptions & {
    expirationSecondsFromNow?: number;
    expirationTimestamp?: number;
  };
};

export class AptosSolanaWallet
  extends SolanaWallet
  implements CrossChainWallet
{
  private readonly _adapter: WalletAdapter;
  private readonly _connection: Connection;

  constructor(adapter: WalletAdapter, connection: Connection) {
    super(adapter, connection);
    this._adapter = adapter;
    this._connection = connection;
  }

  async CCTPTransfer(
    chain: Chain,
    route: WormholeRouteResponse,
    request: WormholeRequest,
    quote: WormholeQuote
  ): Promise<{
    originChainTxnId: string;
    receipt: routes.Receipt<AttestationReceipt>;
  }> {
    // should be derived from hash(domain_name + source_chain_address + domain_separator)
    const destinationAccountAddress =
      "0x38383091fdd9325e0b8ada990c474da8c7f5aa51580b65eb477885b6ce0a36b7";

    const signer = new Signer(
      chain, // for now, it is always "Solana"
      this._adapter.publicKey?.toString()!,
      {},
      this
    );

    let receipt = await route.initiate(
      request,
      signer,
      quote,
      Wormhole.chainAddress("Aptos", destinationAccountAddress)
    );

    const originChainTxnId =
      "originTxs" in receipt
        ? receipt.originTxs[receipt.originTxs.length - 1].txid
        : undefined;

    return { originChainTxnId: originChainTxnId || "", receipt };
  }

  async signAndSubmitTransaction(
    transaction: InputTransactionData
  ): Promise<string> {
    console.log("solana not yet implemented, waiting for dAA", transaction);
    return "";
  }

  async getUsdcBalance(): Promise<UsdcBalance> {
    if (!this.getAddress()) {
      throw new Error("wallet not connected");
    }
    const splParsedTokenAccounts = (
      await Promise.all(
        [TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID]
          .map((pid) => new PublicKey(pid))
          .map((programId) =>
            this._connection.getParsedTokenAccountsByOwner(
              new PublicKey(this.getAddress()!),
              { programId }
            )
          )
      )
    ).reduce<
      {
        pubkey: PublicKey;
        account: AccountInfo<ParsedAccountData>;
      }[]
    >((acc, val) => {
      return acc.concat(val.value);
    }, []);

    // USDC on Solana devnet
    const addrString = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
    const decimal = 6;
    const amount = splParsedTokenAccounts.find(
      (v) => v?.account.data.parsed?.info?.mint === addrString
    )?.account.data.parsed?.info?.tokenAmount?.amount;
    if (!amount) return { amount: "0", decimal: 0, display: "0" };
    const humanReadable = parseInt(amount, 10) / Math.pow(10, decimal);
    return { amount, decimal, display: humanReadable.toFixed(1) };
  }
}
