import {
  chainToPlatform,
  routes,
  TokenId,
  Wormhole,
  wormhole,
  PlatformLoader,
  TransferState,
} from "@wormhole-foundation/sdk";
import { Network, sleep } from "@aptos-labs/ts-sdk";
import aptos from "@wormhole-foundation/sdk/aptos";
import solana from "@wormhole-foundation/sdk/solana";
import evm from "@wormhole-foundation/sdk/evm";

import {
  Chain,
  CrossChainProvider,
  CrossChainCore,
} from "../../CrossChainCore";
import { logger } from "../../utils/logger";
import { AptosLocalSigner } from "./signers/AptosLocalSigner";
import { Signer } from "./signers/Signer";
import { ChainConfig } from "../../config";
import {
  WormholeQuoteRequest,
  WormholeQuoteResponse,
  WormholeInitiateTransferRequest,
  WormholeInitiateTransferResponse,
  WormholeRouteResponse,
  WormholeRequest,
  WormholeSubmitTransferRequest,
  WormholeStartTransferResponse,
  WormholeClaimTransferRequest,
} from "./types";

export class WormholeProvider
  implements
    CrossChainProvider<
      WormholeQuoteRequest,
      WormholeQuoteResponse,
      WormholeInitiateTransferRequest,
      WormholeInitiateTransferResponse
    >
{
  private crossChainCore: CrossChainCore;

  private _wormholeContext: Wormhole<"Mainnet" | "Testnet"> | undefined;

  private wormholeRoute: WormholeRouteResponse | undefined;
  private wormholeRequest: WormholeRequest | undefined;
  private wormholeQuote: WormholeQuoteResponse | undefined;

  constructor(core: CrossChainCore) {
    this.crossChainCore = core;
  }

  get wormholeContext(): Wormhole<"Mainnet" | "Testnet"> | undefined {
    return this._wormholeContext;
  }

  async setWormholeContext(sourceChain: Chain) {
    const dappNetwork = this.crossChainCore._dappConfig?.aptosNetwork;
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

  async getRoute(sourceChain: Chain): Promise<{
    route: WormholeRouteResponse;
    request: WormholeRequest;
  }> {
    if (!this._wormholeContext) {
      throw new Error("Wormhole context not initialized");
    }

    const { sourceToken, destToken } = this.getTokenInfo(sourceChain);

    const sourceContext = this._wormholeContext
      .getPlatform(chainToPlatform(sourceChain))
      .getChain(sourceChain);

    logger.log("sourceContext", sourceContext);

    const destContext = this._wormholeContext
      .getPlatform(chainToPlatform("Aptos"))
      .getChain("Aptos");

    logger.log("destContext", destContext);

    const request = await routes.RouteTransferRequest.create(
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

    const route = await resolver.findRoutes(request);
    const cctpRoute = route[0];

    this.wormholeRoute = cctpRoute;
    this.wormholeRequest = request;

    return { route: cctpRoute, request };
  }

  async getQuote(input: WormholeQuoteRequest): Promise<WormholeQuoteResponse> {
    const { amount, sourceChain } = input;

    if (!this._wormholeContext) {
      await this.setWormholeContext(sourceChain);
    }

    const { route, request } = await this.getRoute(sourceChain);

    // TODO what is nativeGas for?
    const transferParams = {
      amount: amount,
      options: { nativeGas: 0 },
    };

    const validated = await route.validate(request, transferParams);
    if (!validated.valid) {
      logger.log("invalid", validated.valid);
      throw new Error(`Invalid quote: ${validated.error}`).message;
    }
    const quote = await route.quote(request, validated.params);
    if (!quote.success) {
      logger.log("quote failed", quote.success);
      throw new Error(`Invalid quote: ${quote.error}`).message;
    }
    this.wormholeQuote = quote;
    logger.log("quote", quote);
    return quote;
  }

  async submitCCTPTransfer(
    input: WormholeSubmitTransferRequest
  ): Promise<WormholeStartTransferResponse> {
    const { sourceChain, wallet, destinationAddress } = input;

    if (!this._wormholeContext) {
      await this.setWormholeContext(sourceChain);
    }
    if (!this.wormholeRoute || !this.wormholeRequest || !this.wormholeQuote) {
      throw new Error("Wormhole route, request, or quote not initialized");
    }

    let signerAddress: string;

    const chainContext = this.getChainConfig(sourceChain).context;

    const currentAccount = await wallet.getAccount();
    if (chainContext === "Solana") {
      signerAddress = currentAccount.publicKey.toString();
    } else {
      // is Ethereum
      signerAddress = currentAccount.address;
    }
    logger.log("signerAddress", signerAddress);

    const signer = new Signer(
      this.getChainConfig(sourceChain),
      signerAddress,
      {},
      wallet
    );

    let receipt = await this.wormholeRoute.initiate(
      this.wormholeRequest,
      signer,
      this.wormholeQuote,
      Wormhole.chainAddress("Aptos", destinationAddress.toString())
    );

    const originChainTxnId =
      "originTxs" in receipt
        ? receipt.originTxs[receipt.originTxs.length - 1].txid
        : undefined;

    return { originChainTxnId: originChainTxnId || "", receipt };
  }

  async claimCCTPTransfer(
    input: WormholeClaimTransferRequest
  ): Promise<{ destinationChainTxnId: string }> {
    let { receipt, mainSigner, sponsorAccount } = input;
    if (!this.wormholeRoute) {
      throw new Error("Wormhole route not initialized");
    }

    logger.log("mainSigner", mainSigner.accountAddress.toString());

    let retries = 0;
    const maxRetries = 5;
    const baseDelay = 1000; // Initial delay of 1 second

    while (retries < maxRetries) {
      try {
        for await (receipt of this.wormholeRoute.track(receipt, 120 * 1000)) {
          if (receipt.state >= TransferState.SourceInitiated) {
            logger.log("Receipt is on track ", receipt);

            try {
              const signer = new AptosLocalSigner(
                "Aptos",
                {},
                mainSigner, // the account that signs the "claim" transaction
                sponsorAccount ? sponsorAccount : undefined // the fee payer account
              );

              if (routes.isManual(this.wormholeRoute)) {
                const circleAttestationReceipt =
                  await this.wormholeRoute.complete(signer, receipt);
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

  /**
   * Initiates a transfer of USDC funds from the source chain wallet to the destination chain wallet
   * @param args
   * @returns
   */
  async initiateCCTPTransfer(
    input: WormholeInitiateTransferRequest
  ): Promise<WormholeInitiateTransferResponse> {
    if (this.crossChainCore._dappConfig?.aptosNetwork === Network.DEVNET) {
      throw new Error("Devnet is not supported on Wormhole");
    }
    // if amount is provided, it is expected to get the quote internally
    // and initiate a transfer automatically
    if (input.amount) {
      await this.getQuote({
        amount: input.amount,
        sourceChain: input.sourceChain,
      });
    }
    // Submit transfer transaction from origin chain
    let { originChainTxnId, receipt } = await this.submitCCTPTransfer(input);
    // Claim transfer transaction on destination chain
    const { destinationChainTxnId } = await this.claimCCTPTransfer({
      receipt,
      mainSigner: input.mainSigner,
      sponsorAccount: input.sponsorAccount,
    });
    return { originChainTxnId, destinationChainTxnId };
  }

  getChainConfig(chain: Chain): ChainConfig {
    const chainConfig =
      this.crossChainCore.CHAINS[
        chain as keyof typeof this.crossChainCore.CHAINS
      ];
    if (!chainConfig) {
      throw new Error(`Chain config not found for chain: ${chain}`);
    }
    return chainConfig;
  }

  getTokenInfo(sourceChain: Chain): {
    sourceToken: TokenId;
    destToken: TokenId;
  } {
    const sourceToken: TokenId = Wormhole.tokenId(
      this.crossChainCore.TOKENS[sourceChain].tokenId.chain as Chain,
      this.crossChainCore.TOKENS[sourceChain].tokenId.address
    );

    const destToken: TokenId = Wormhole.tokenId(
      this.crossChainCore.APTOS_TOKEN.tokenId.chain as Chain,
      this.crossChainCore.APTOS_TOKEN.tokenId.address
    );

    return { sourceToken, destToken };
  }
}
