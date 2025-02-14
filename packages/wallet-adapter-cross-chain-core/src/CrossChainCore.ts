import { SolanaWallet } from "@xlabs-libs/wallet-aggregator-solana";

import { Eip6963Wallet } from "@xlabs-libs/wallet-aggregator-evm";
import {
  chainToPlatform,
  routes,
  TokenId,
  Wormhole,
  wormhole,
  amount as amountUtils,
  PlatformLoader,
  TransferState,
  AttestationReceipt,
} from "@wormhole-foundation/sdk";

import aptos from "@wormhole-foundation/sdk/aptos";
import solana from "@wormhole-foundation/sdk/solana";
import evm from "@wormhole-foundation/sdk/evm";

import { WalletState } from "@xlabs-libs/wallet-aggregator-core";
import { Account, Ed25519PrivateKey, Network, sleep } from "@aptos-labs/ts-sdk";

import {
  mainnetChainTokens,
  AptosMainnetUSDCToken,
} from "./providers/wormhole/utils/tokens/mainnet";
import {
  AptosTestnetUSDCToken,
  testnetChainTokens,
} from "./providers/wormhole/utils/tokens/testnet";
import { logger } from "./utils/logger";
import { AptosLocalSigner } from "./providers/wormhole/signers/AptosLocalSigner";

export { SolanaWallet, Eip6963Wallet, WalletState };

export interface CrossChainDappConfig {
  network: Network;
  aptosGasStationKeys?: Partial<Record<Network, string>>;
  disableTelemetry?: boolean;
}

export type Chain = "Solana" | "Ethereum" | "Aptos";

export type WormholeRouteResponse = routes.Route<
  "Mainnet" | "Testnet",
  routes.Options,
  routes.ValidatedTransferParams<routes.Options>,
  routes.Receipt
>;

export type WormholeRequest = routes.RouteTransferRequest<
  "Mainnet" | "Testnet"
>;

export type WormholeQuote = routes.Quote<
  routes.Options,
  routes.ValidatedTransferParams<routes.Options>,
  any
>;

export const AmountUtils = amountUtils;

export type UsdcBalance = {
  amount: string;
  decimal: number;
  display: string;
};

export class CrossChainCore {
  private _dappConfig: CrossChainDappConfig | undefined;

  private _wormholeContext: Wormhole<"Mainnet" | "Testnet"> | undefined;

  constructor(args: { dappConfig: CrossChainDappConfig }) {
    this._dappConfig = args.dappConfig;
  }

  get wormholeContext(): Wormhole<"Mainnet" | "Testnet"> | undefined {
    return this._wormholeContext;
  }

  async setWormholeContext(sourceChain: Chain) {
    const dappNetwork = this._dappConfig?.network;
    if (dappNetwork === Network.DEVNET) {
      throw new Error("Devnet is not supported on Wormhole");
    }
    if (!sourceChain) {
      throw new Error("Origin chain not selected");
    }
    const isMainnet = dappNetwork === Network.MAINNET;
    const platforms: PlatformLoader<any>[] = [aptos, solana, evm];
    const wh = await wormhole(isMainnet ? "Mainnet" : "Testnet", platforms);
    this._wormholeContext = wh;
  }

  async getWormholeCctpRoute(sourceChain: Chain): Promise<{
    route: WormholeRouteResponse;
    request: WormholeRequest;
  }> {
    if (!this._wormholeContext) {
      throw new Error("Wormhole context not initialized");
    }
    const isMainnet = this._dappConfig?.network === Network.MAINNET;
    const chainToken = isMainnet ? mainnetChainTokens : testnetChainTokens;
    const sourceToken: TokenId = Wormhole.tokenId(
      chainToken[sourceChain].tokenId.chain as Chain,
      chainToken[sourceChain].tokenId.address
    );

    const aptosChainToken = isMainnet
      ? AptosMainnetUSDCToken
      : AptosTestnetUSDCToken;
    const destToken: TokenId = Wormhole.tokenId(
      aptosChainToken.tokenId.chain as Chain,
      aptosChainToken.tokenId.address
    );

    const sourceContext = this._wormholeContext
      .getPlatform(chainToPlatform(sourceChain))
      .getChain(sourceChain);

    logger.log("sourceContext", sourceContext);

    const destContext = this._wormholeContext
      .getPlatform(chainToPlatform("Aptos"))
      .getChain("Aptos");

    logger.log("destContext", destContext);

    const req = await routes.RouteTransferRequest.create(
      this._wormholeContext,
      {
        source: sourceToken,
        destination: destToken,
      },
      sourceContext,
      destContext
    );

    const resolver = this._wormholeContext.resolver([
      routes.CCTPRoute, // manual CCTP
    ]);

    const route = await resolver.findRoutes(req);
    const cctpRoute = route[0];

    return { route: cctpRoute, request: req };
  }

  async getQuote(
    amount: string,
    route: WormholeRouteResponse,
    request: WormholeRequest
  ): Promise<WormholeQuote> {
    // TODO what is nativeGas for?
    const transferParams = { amount, options: { nativeGas: 0 } };

    const validated = await route.validate(request, transferParams);
    if (!validated.valid) {
      logger.log("invalid", validated.valid);
      throw validated.error;
    }
    const quote = await route.quote(request, validated.params);
    if (!quote.success) {
      logger.log("quote failed", quote.success);
      throw quote.error;
    }

    logger.log("quote", quote);
    return quote;
  }

  async completeCCTPTransfer(
    route: WormholeRouteResponse,
    receipt: routes.Receipt<AttestationReceipt>
  ): Promise<{ destinationChainTxnId: string }> {
    // should come from transaction signer worker
    const claimSignerPrivateKey = new Ed25519PrivateKey(
      "0xddc1abd2ebb35b6ffa7c328f1b1d672e48073adb32cd3c95a911d6df2e205920"
    );
    const claimSignerAccount = Account.fromPrivateKey({
      privateKey: claimSignerPrivateKey,
    });

    // should come from gas station
    const feePayerPrivateKey = new Ed25519PrivateKey(
      "0xedae3fa4f04fdee1e3458b9e38d006ebca0101bd9d8a124db9dd9e8dc3707b45"
    );
    const feePayerStaticAccount = Account.fromPrivateKey({
      privateKey: feePayerPrivateKey,
    });

    let retries = 0;
    const maxRetries = 5;
    const baseDelay = 1000; // Initial delay of 1 second

    while (retries < maxRetries) {
      try {
        for await (receipt of route.track(receipt, 120 * 1000)) {
          if (receipt.state >= TransferState.SourceInitiated) {
            logger.log("Receipt is on track ", receipt);

            try {
              const signer = new AptosLocalSigner(
                "Aptos",
                {},
                claimSignerAccount, // the account that signs the "claim" transaction
                feePayerStaticAccount // the fee payer account, should use gas station
              );

              if (routes.isManual(route)) {
                const circleAttestationReceipt = await route.complete(
                  signer,
                  receipt
                );
                logger.log("Claim receipt: ", circleAttestationReceipt);
                const destinationChainTxnId = signer.claimedTransactionHashes();
                return { destinationChainTxnId };
              } else {
                // Should be unreachable
                return { destinationChainTxnId: "" };
              }
            } catch (e) {
              console.error("Failed to claim", e);
              return { destinationChainTxnId: "" };
            }
          }
        }
      } catch (e) {
        console.error(
          `Error tracking transfer (attempt ${retries + 1} / ${maxRetries}):`,
          e
        );
        const delay = baseDelay * Math.pow(2, retries); // Exponential backoff
        await sleep(delay);
        retries++;
      }
    }
    // Should be unreachable
    return { destinationChainTxnId: "" };
  }
}
