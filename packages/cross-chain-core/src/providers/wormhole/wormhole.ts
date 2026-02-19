import {
  routes,
  Wormhole,
  wormhole,
  PlatformLoader,
  TransferState,
} from "@wormhole-foundation/sdk";
import { Network, sleep } from "@aptos-labs/ts-sdk";
import aptos from "@wormhole-foundation/sdk/aptos";
import solana from "@wormhole-foundation/sdk/solana";
import evm from "@wormhole-foundation/sdk/evm";
import sui from "@wormhole-foundation/sdk/sui";

import {
  Chain,
  CrossChainProvider,
  CrossChainCore,
} from "../../CrossChainCore";
import { logger } from "../../utils/logger";
import { serializeReceipt } from "../../utils/receiptSerialization";
import { AptosLocalSigner } from "./signers/AptosLocalSigner";
import { Signer } from "./signers/Signer";
import { ChainConfig } from "../../config";
import { createCCTPRoute } from "./utils";
import {
  WormholeQuoteRequest,
  WormholeQuoteResponse,
  WormholeTransferRequest,
  WormholeTransferResponse,
  WormholeRouteResponse,
  WormholeRequest,
  WormholeSubmitTransferRequest,
  WormholeStartTransferResponse,
  WormholeClaimTransferRequest,
  WormholeWithdrawRequest,
  WormholeWithdrawResponse,
  WormholeInitiateWithdrawRequest,
  WormholeInitiateWithdrawResponse,
  WormholeClaimWithdrawRequest,
  WormholeClaimWithdrawResponse,
  WithdrawError,
} from "./types";
import { SolanaDerivedWallet } from "@aptos-labs/derived-wallet-solana";
import { EIP1193DerivedWallet } from "@aptos-labs/derived-wallet-ethereum";
import { SuiDerivedWallet } from "@aptos-labs/derived-wallet-sui";

export class WormholeProvider implements CrossChainProvider<
  WormholeQuoteRequest,
  WormholeQuoteResponse,
  WormholeTransferRequest,
  WormholeTransferResponse,
  WormholeWithdrawRequest,
  WormholeWithdrawResponse
> {
  private crossChainCore: CrossChainCore;

  private _wormholeContext: Wormhole<"Mainnet" | "Testnet"> | undefined;

  private wormholeRoute: WormholeRouteResponse | undefined;
  private wormholeRequest: WormholeRequest | undefined;
  private wormholeQuote: WormholeQuoteResponse | undefined;
  private destinationChain?: Chain;

  constructor(core: CrossChainCore) {
    this.crossChainCore = core;
  }

  get wormholeContext(): Wormhole<"Mainnet" | "Testnet"> | undefined {
    return this._wormholeContext;
  }

  private async setWormholeContext(sourceChain: Chain) {
    const dappNetwork = this.crossChainCore._dappConfig?.aptosNetwork;
    if (dappNetwork === Network.DEVNET) {
      throw new Error("Devnet is not supported on Wormhole");
    }
    if (!sourceChain) {
      throw new Error("Origin chain not selected");
    }
    const isMainnet = dappNetwork === Network.MAINNET;
    const platforms: PlatformLoader<any>[] = [aptos, solana, evm, sui];

    // Get custom RPC endpoints from config
    const dappConfig = this.crossChainCore._dappConfig;
    const defaultChains = this.crossChainCore.CHAINS;

    const solanaRpc =
      dappConfig?.solanaConfig?.rpc ??
      defaultChains["Solana"]?.defaultRpc;

    const suiRpc =
      dappConfig?.suiConfig?.rpc ??
      defaultChains["Sui"]?.defaultRpc;

    // Build EVM chain RPC overrides
    const evmChainConfig: Record<string, { rpc: string }> = {};
    const evmChainNames = [
      "Ethereum", "Sepolia", "Base", "BaseSepolia",
      "Arbitrum", "ArbitrumSepolia", "Avalanche",
      "Polygon", "PolygonSepolia",
    ] as const;
    for (const name of evmChainNames) {
      const rpc =
        dappConfig?.evmConfig?.[name]?.rpc ??
        defaultChains[name]?.defaultRpc;
      if (rpc) {
        evmChainConfig[name] = { rpc };
      }
    }

    const wh = await wormhole(isMainnet ? "Mainnet" : "Testnet", platforms, {
      chains: {
        Solana: { rpc: solanaRpc },
        ...(suiRpc ? { Sui: { rpc: suiRpc } } : {}),
        ...evmChainConfig,
      },
    });
    this._wormholeContext = wh;
  }

  private async getRoute(
    sourceChain: Chain,
    destinationChain: Chain,
  ): Promise<{
    route: WormholeRouteResponse;
    request: WormholeRequest;
  }> {
    if (!this._wormholeContext) {
      throw new Error("Wormhole context not initialized");
    }

    const { route: cctpRoute, request } = await createCCTPRoute(
      this._wormholeContext,
      sourceChain,
      destinationChain,
      this.crossChainCore.TOKENS,
    );

    this.wormholeRoute = cctpRoute;
    this.wormholeRequest = request;
    this.destinationChain = destinationChain;

    return { route: cctpRoute, request };
  }

  async getQuote(input: WormholeQuoteRequest): Promise<WormholeQuoteResponse> {
    const { amount, originChain, type } = input;

    if (!this._wormholeContext) {
      await this.setWormholeContext(originChain);
    }

    logger.log("type", type);
    // If the type of the transaction is "transfer", we want to transfer from a x-chain wallet to the Aptos wallet
    // If the type of the transaction is "withdraw", we want to transfer from the Aptos wallet to a x-chain wallet
    const sourceChain = type === "transfer" ? originChain : "Aptos";
    const destinationChain = type === "transfer" ? "Aptos" : originChain;

    const { route, request } = await this.getRoute(
      sourceChain,
      destinationChain,
    );

    // TODO what is nativeGas for?
    const transferParams = {
      amount: amount,
      options: { nativeGas: 0 },
    };

    const validated = await route.validate(request, transferParams);
    if (!validated.valid) {
      logger.log("invalid", validated.valid);
      throw new Error(`Invalid quote: ${validated.error}`);
    }
    const quote = await route.quote(request, validated.params);
    if (!quote.success) {
      logger.log("quote failed", quote.success);
      throw new Error(`Invalid quote: ${quote.error}`);
    }
    this.wormholeQuote = quote;
    logger.log("quote", quote);
    return quote;
  }

  async submitCCTPTransfer(
    input: WormholeSubmitTransferRequest,
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

    //const currentAccount = await wallet.getAccount();
    if (chainContext === "Solana") {
      signerAddress =
        (wallet as SolanaDerivedWallet).solanaWallet.publicKey?.toBase58() ||
        "";
    } else if (chainContext === "Ethereum") {
      // is Ethereum
      [signerAddress] = await (
        wallet as EIP1193DerivedWallet
      ).eip1193Provider.request({
        method: "eth_requestAccounts",
      });
    } else if (chainContext === "Sui") {
      signerAddress =
        (wallet as SuiDerivedWallet).suiWallet.accounts[0].address || "";
    } else {
      throw new Error("Unsupported chain context: " + chainContext);
    }
    logger.log("signerAddress", signerAddress);

    const signer = new Signer(
      this.getChainConfig(sourceChain),
      signerAddress,
      {},
      wallet,
      this.crossChainCore,
    );

    logger.log("signer", signer);
    logger.log("wormholeRequest", this.wormholeRequest);
    logger.log("wormholeQuote", this.wormholeQuote);

    let receipt = await this.wormholeRoute.initiate(
      this.wormholeRequest,
      signer,
      this.wormholeQuote,
      Wormhole.chainAddress("Aptos", destinationAddress.toString()),
    );

    const originChainTxnId =
      "originTxs" in receipt
        ? receipt.originTxs[receipt.originTxs.length - 1].txid
        : undefined;

    return { originChainTxnId: originChainTxnId || "", receipt };
  }

  async claimCCTPTransfer(
    input: WormholeClaimTransferRequest,
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
                sponsorAccount, // the fee payer account
                this.crossChainCore._dappConfig?.aptosNetwork,
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
          e,
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
  async transfer(
    input: WormholeTransferRequest,
  ): Promise<WormholeTransferResponse> {
    if (this.crossChainCore._dappConfig?.aptosNetwork === Network.DEVNET) {
      throw new Error("Devnet is not supported on Wormhole");
    }
    // if amount is provided, it is expected to get the quote internally
    // and initiate a transfer automatically
    if (input.amount) {
      await this.getQuote({
        amount: input.amount,
        originChain: input.sourceChain,
        type: "transfer",
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

  // --- Split withdraw flow: initiateWithdraw + trackWithdraw + claimWithdraw ---

  /**
   * Phase 1: Initiates a withdraw by burning USDC on Aptos.
   * The user signs the Aptos burn transaction via their wallet.
   * Returns a receipt that can be tracked and later claimed.
   */
  async initiateWithdraw(
    input: WormholeInitiateWithdrawRequest,
  ): Promise<WormholeInitiateWithdrawResponse> {
    const { wallet, destinationAddress, sponsorAccount } = input;

    if (!this._wormholeContext) {
      throw new Error("Wormhole context not initialized");
    }
    if (!this.wormholeRoute || !this.wormholeRequest || !this.wormholeQuote) {
      throw new Error("Wormhole route, request, or quote not initialized");
    }

    const signer = new Signer(
      this.getChainConfig("Aptos"),
      (
        await wallet.features["aptos:account"].account()
      ).address.toString(),
      {},
      wallet,
      this.crossChainCore,
      sponsorAccount,
    );

    const wormholeDestAddress = Wormhole.chainAddress(
      this.destinationChain!,
      destinationAddress.toString(),
    );

    const receipt = await this.wormholeRoute.initiate(
      this.wormholeRequest,
      signer,
      this.wormholeQuote,
      wormholeDestAddress,
    );
    logger.log("initiateWithdraw receipt", receipt);

    const originChainTxnId =
      "originTxs" in receipt
        ? receipt.originTxs[receipt.originTxs.length - 1].txid
        : undefined;

    return { originChainTxnId: originChainTxnId || "", receipt };
  }

  /**
   * Phase 2: Tracks a withdraw receipt until attestation is ready.
   * This polls Wormhole and returns once the receipt reaches the Attested state.
   */
  async trackWithdraw(
    receipt: routes.Receipt,
  ): Promise<routes.Receipt> {
    if (!this.wormholeRoute) {
      throw new Error("Wormhole route not initialized");
    }

    let retries = 0;
    const maxRetries = 5;
    const baseDelay = 1000;

    while (retries < maxRetries) {
      try {
        for await (receipt of this.wormholeRoute.track(receipt, 120 * 1000)) {
          if (receipt.state >= TransferState.Attested) {
            logger.log("trackWithdraw: receipt attested", receipt);
            return receipt;
          }
        }
      } catch (e) {
        console.error(
          `Error tracking withdraw (attempt ${retries + 1} / ${maxRetries}):`,
          e,
        );
        const delay = baseDelay * Math.pow(2, retries);
        await sleep(delay);
        retries++;
      }
    }
    throw new Error("Failed to track withdraw to attested state");
  }

  /**
   * Phase 3: Claims the withdraw on the destination chain.
   *
   * If the destination is Solana and `solanaConfig.serverClaimUrl` is configured
   * in the dapp config, the SDK automatically POSTs the attested receipt to that
   * URL — no wallet popup required. The dapp's server endpoint handles signing
   * and submitting the claim transaction.
   *
   * Otherwise falls back to the wallet-based Signer (triggers wallet popup).
   */
  async claimWithdraw(
    input: WormholeClaimWithdrawRequest,
  ): Promise<WormholeClaimWithdrawResponse> {
    const { sourceChain, destinationAddress, receipt } = input;

    // Server-side claim path: Solana destination with configured serverClaimUrl
    const serverClaimUrl =
      this.crossChainCore._dappConfig?.solanaConfig?.serverClaimUrl;

    if (sourceChain === "Solana" && serverClaimUrl) {
      logger.log("claimWithdraw: using server-side claim via", serverClaimUrl);

      const response = await fetch(serverClaimUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receipt: serializeReceipt(receipt),
          destinationAddress,
          sourceChain,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Server-side claim failed with status ${response.status}`,
        );
      }

      const result = await response.json();
      return { destinationChainTxnId: result.destinationChainTxnId };
    }

    // Wallet-based claim path
    if (!this.wormholeRoute) {
      throw new Error("Wormhole route not initialized");
    }

    if (!input.wallet) {
      throw new Error(
        "Wallet is required for claim when serverClaimUrl is not configured",
      );
    }

    const claimSigner = new Signer(
      this.getChainConfig(sourceChain),
      destinationAddress,
      {},
      input.wallet,
      this.crossChainCore,
    );

    if (routes.isManual(this.wormholeRoute)) {
      const circleAttestationReceipt = await this.wormholeRoute.complete(
        claimSigner,
        receipt,
      );
      logger.log("claimWithdraw receipt:", circleAttestationReceipt);
      const destinationChainTxnId = claimSigner.claimedTransactionHashes();
      return { destinationChainTxnId };
    } else {
      throw new Error("Automatic route not supported for manual claim");
    }
  }

  /**
   * Withdraws USDC from Aptos to a destination chain.
   * Orchestrates all three phases internally:
   *   1. Initiate — user signs the Aptos burn transaction
   *   2. Track — wait for Wormhole attestation
   *   3. Claim — if serverClaimUrl is configured for Solana, delegates to
   *      the server; otherwise uses the wallet-based signer.
   *
   * The optional `onPhaseChange` callback lets the dapp update its UI
   * as the flow progresses.
   */
  async withdraw(
    input: WormholeWithdrawRequest,
  ): Promise<WormholeWithdrawResponse> {
    const { sourceChain, wallet, destinationAddress, sponsorAccount, onPhaseChange } = input;

    // Phase 1: Initiate — user signs Aptos burn
    onPhaseChange?.("initiating");
    const { originChainTxnId, receipt } = await this.initiateWithdraw({
      wallet,
      destinationAddress,
      sponsorAccount,
    });

    // Phases 2 & 3 are wrapped so that, if they fail, the caller still
    // receives the originChainTxnId (the irreversible Aptos burn).
    let currentPhase: "tracking" | "claiming" = "tracking";
    try {
      // Phase 2: Track — wait for attestation
      onPhaseChange?.("tracking");
      const attestedReceipt = await this.trackWithdraw(receipt);

      // Phase 3: Claim — server-side or wallet-based
      currentPhase = "claiming";
      onPhaseChange?.("claiming");
      const { destinationChainTxnId } = await this.claimWithdraw({
        sourceChain,
        destinationAddress: destinationAddress.toString(),
        receipt: attestedReceipt,
        wallet,
      });

      return { originChainTxnId, destinationChainTxnId };
    } catch (error: any) {
      throw new WithdrawError(
        error?.message ?? "Withdraw failed after Aptos burn",
        originChainTxnId,
        currentPhase,
        error,
      );
    }
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
}
