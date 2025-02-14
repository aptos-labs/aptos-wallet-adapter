import { Chain, CrossChainProvider } from "../../CrossChainCore";

import {
  chainToPlatform,
  routes,
  TokenId,
  Wormhole,
  wormhole,
  PlatformLoader,
  TransferState,
  AttestationReceipt,
} from "@wormhole-foundation/sdk";

import aptos from "@wormhole-foundation/sdk/aptos";
import solana from "@wormhole-foundation/sdk/solana";
import evm from "@wormhole-foundation/sdk/evm";
import sui from "@wormhole-foundation/sdk/sui";

import { CrossChainCore } from "../../CrossChainCore";
import { logger } from "../../utils/logger";
import {
  Account,
  AccountAddressInput,
  Ed25519PrivateKey,
  Network,
  sleep,
} from "@aptos-labs/ts-sdk";
import { AptosLocalSigner } from "./signers/AptosLocalSigner";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-aggregator-core";
import { Signer } from "./signers";
import {
  ChainsConfig,
  testnetChains,
  testnetTokens,
  mainnetChains,
  mainnetTokens,
  TokenConfig,
  AptosTestnetUSDCToken,
  AptosMainnetUSDCToken,
  ChainConfig,
} from "./config";

export type WormholeRouteResponse = routes.Route<
  "Mainnet" | "Testnet",
  routes.Options,
  routes.ValidatedTransferParams<routes.Options>,
  routes.Receipt
>;

export type WormholeRequest = routes.RouteTransferRequest<
  "Mainnet" | "Testnet"
>;

export type WormholeQuoteResponse = routes.Quote<
  routes.Options,
  routes.ValidatedTransferParams<routes.Options>,
  any
>;

export interface WormholeQuoteRequest {
  amount: string;
  sourceChain: Chain;
}

export interface WormholeInitiateTransferRequest {
  sourceChain: Chain;
  wallet: AdapterWallet;
  destinationAddress: AccountAddressInput;
  mainSigner: Account;
  sponsorAccount?: Account | Partial<Record<Network, string>>;
}

export interface WormholeInitiateTransferResponse {
  destinationChainTxnId: string;
  originChainTxnId: string;
}

export interface WormholeStartTransferResponse {
  originChainTxnId: string;
  receipt: routes.Receipt<AttestationReceipt>;
}

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

  readonly CHAINS: ChainsConfig = testnetChains;
  readonly TOKENS: Record<string, TokenConfig> = testnetTokens;

  readonly APTOS_TOKEN: TokenConfig = AptosTestnetUSDCToken;

  constructor(core: CrossChainCore) {
    this.crossChainCore = core;
    if (core._dappConfig?.network === Network.MAINNET) {
      this.CHAINS = mainnetChains;
      this.TOKENS = mainnetTokens;
      this.APTOS_TOKEN = AptosMainnetUSDCToken;
    } else {
      this.CHAINS = testnetChains;
      this.TOKENS = testnetTokens;
      this.APTOS_TOKEN = AptosTestnetUSDCToken;
    }
  }

  get wormholeContext(): Wormhole<"Mainnet" | "Testnet"> | undefined {
    return this._wormholeContext;
  }

  async setWormholeContext(sourceChain: Chain) {
    const dappNetwork = this.crossChainCore._dappConfig?.network;
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

    const { sourceToken, destToken } = this.getTokenInfo(sourceChain);

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

  async getQuote(input: WormholeQuoteRequest): Promise<WormholeQuoteResponse> {
    const { amount, sourceChain } = input;

    if (!this._wormholeContext) {
      await this.setWormholeContext(sourceChain);
    }

    const { route, request } = await this.getWormholeCctpRoute(sourceChain);
    this.wormholeRoute = route;
    this.wormholeRequest = request;

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
    this.wormholeQuote = quote;
    logger.log("quote", quote);
    return quote;
  }

  async startCCTPTransfer(
    input: WormholeInitiateTransferRequest
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

  async initiateCCTPTransfer(
    input: WormholeInitiateTransferRequest
  ): Promise<WormholeInitiateTransferResponse> {
    if (this.crossChainCore._dappConfig?.network === Network.DEVNET) {
      throw new Error("Devnet is not supported on Wormhole");
    }
    if (!this.wormholeRoute || !this.wormholeRequest || !this.wormholeQuote) {
      throw new Error("Wormhole route, request, or quote not initialized");
    }
    let { originChainTxnId, receipt } = await this.startCCTPTransfer(input);
    // should come from transaction signer worker
    const { mainSigner, sponsorAccount } = input;

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
                return { destinationChainTxnId, originChainTxnId };
              } else {
                // Should be unreachable
                return { destinationChainTxnId: "", originChainTxnId };
              }
            } catch (e) {
              console.error("Failed to claim", e);
              return { destinationChainTxnId: "", originChainTxnId };
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
    return { destinationChainTxnId: "", originChainTxnId };
  }

  getChainConfig(chain: Chain): ChainConfig {
    const chainConfig = this.CHAINS[chain as keyof typeof this.CHAINS];
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
      this.TOKENS[sourceChain].tokenId.chain as Chain,
      this.TOKENS[sourceChain].tokenId.address
    );

    const destToken: TokenId = Wormhole.tokenId(
      this.APTOS_TOKEN.tokenId.chain as Chain,
      this.APTOS_TOKEN.tokenId.address
    );

    return { sourceToken, destToken };
  }
}
