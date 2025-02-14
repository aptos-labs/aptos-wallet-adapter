import {
  Eip6963Wallets,
  Eip6963Wallet,
  EVMWallet,
} from "@xlabs-libs/wallet-aggregator-evm";

import {
  AttestationReceipt,
  Wormhole,
  routes,
  Chain,
  decimals,
} from "@wormhole-foundation/sdk";
import { WormholeRequest } from "../CrossChainCore";

import {
  WormholeRouteResponse,
  UsdcBalance,
  WormholeQuote,
} from "../CrossChainCore";
import { Signer } from "../providers/wormhole/signers";

import { CrossChainWallet } from "./core";
import { InputTransactionData } from ".";
import { ethers } from "ethers";

export function fetchEthereumWallets(): AptosEthereumWallet[] {
  const eip6963Wallets = Object.entries(Eip6963Wallets).reduce(
    (acc, [key, name]) => ({ [key]: new AptosEthereumWallet(name), ...acc }),
    {}
  );
  const ethereumWallets = Object.values(eip6963Wallets).filter((wallet) =>
    ["MetaMask", "Phantom", "Coinbase Wallet"].includes(
      (wallet as Eip6963Wallet).getName()
    )
  );
  return ethereumWallets as AptosEthereumWallet[];
}

export class AptosEthereumWallet
  extends Eip6963Wallet
  implements CrossChainWallet
{
  private readonly _adapter: Eip6963Wallets;

  constructor(adapter: Eip6963Wallets) {
    super(adapter);
    this._adapter = adapter;
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

    const signer = new Signer(chain, this.getAddress()!, {}, this);

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
    // return this._connection.sendTransaction(tx, [this._adapter]);
    console.log("eth not yet implemented, waiting for dAA", transaction);
    return "";
  }

  async getUsdcBalance(): Promise<UsdcBalance> {
    const rpcUrl = "https://eth-sepolia.public.blastapi.io";
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const decimal = 6;
    const erc20Abi = [
      "function balanceOf(address owner) view returns (uint256)",
    ];
    const assetAddr = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
    const contract = new ethers.Contract(assetAddr, erc20Abi, provider);

    const amount = await contract.balanceOf(this.getAddress()!);

    const humanReadable = ethers.formatUnits(amount, decimal);

    return {
      amount: amount.toString(),
      decimal,
      display: humanReadable,
    };
  }
}
