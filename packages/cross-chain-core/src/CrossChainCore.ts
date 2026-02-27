import { Account, Network } from "@aptos-labs/ts-sdk";

import {
  WormholeTransferRequest,
  WormholeTransferResponse,
  WormholeProvider,
  WormholeQuoteRequest,
  WormholeQuoteResponse,
  WormholeWithdrawRequest,
  WormholeWithdrawResponse,
} from "./providers/wormhole";

import {
  ChainsConfig,
  testnetChains,
  testnetTokens,
  mainnetChains,
  mainnetTokens,
  TokenConfig,
  ChainConfig,
} from "./config";
import {
  getAptosWalletUSDCBalance,
  getEthereumWalletUSDCBalance,
  getSolanaWalletUSDCBalance,
  getSuiWalletUSDCBalance,
} from "./utils/getUsdcBalance";

export interface CrossChainDappConfig {
  aptosNetwork: Network;
  disableTelemetry?: boolean;
  solanaConfig?: {
    rpc?: string;
    priorityFeeConfig?: {
      percentile?: number;
      percentileMultiple?: number;
      min?: number;
      max?: number;
    };
    /**
     * URL of a server-side API endpoint that claims withdraw transactions on Solana.
     * When set, the SDK will POST the attested receipt to this URL instead of
     * asking the user's wallet to sign the claim transaction.
     *
     * Expected request body: { serializedReceipt: string, destinationAddress: string, sourceChain: string }
     * Expected response: { destinationChainTxnId: string }
     * Check out the SERVERSIDE_SOLANA_SIGNER.md file for more details.
     *
     * @example
     * const crossChainCore = new CrossChainCore({
     *   dappConfig: {
     *     aptosNetwork: Network.TESTNET,
     *     solanaConfig: {
     *       serverClaimUrl: "/api/claim-withdraw",
     *     },
     *   },
     * });
     */
    serverClaimUrl?: string;
  };
  /**
   * Custom RPC endpoints for EVM chains. When provided, these override the
   * built-in `defaultRpc` values for balance lookups and Wormhole SDK
   * initialization.
   *
   * @example
   * ```ts
   * evmConfig: {
   *   Ethereum: { rpc: "https://rpc.ankr.com/eth/MY_KEY" },
   *   Base: { rpc: "https://rpc.ankr.com/base/MY_KEY" },
   * }
   * ```
   */
  evmConfig?: Partial<Record<EvmChainName, { rpc: string }>>;
  /**
   * Custom RPC endpoint for the Sui chain. When provided, overrides the
   * built-in `defaultRpc` for balance lookups and Wormhole SDK initialization.
   *
   * @example
   * ```ts
   * suiConfig: { rpc: "https://fullnode.mainnet.sui.io" }
   * ```
   */
  suiConfig?: { rpc?: string };
}
export type { AccountAddressInput } from "@aptos-labs/ts-sdk";
export { NetworkToChainId, NetworkToNodeAPI } from "@aptos-labs/ts-sdk";
export type AptosAccount = Account;

// List of all the supported chain
export type Chain =
  | "Solana"
  | "Ethereum"
  | "Sepolia"
  | "Aptos"
  | "BaseSepolia"
  | "ArbitrumSepolia"
  | "Avalanche"
  | "Base"
  | "Arbitrum"
  | "PolygonSepolia"
  | "Polygon"
  | "Sui";

/**
 * EVM chain names supported by the SDK — derived from {@link Chain} by
 * excluding the non-EVM ecosystems. Adding a new EVM chain to `Chain`
 * automatically makes it a valid key in `evmConfig`.
 */
export type EvmChainName = Exclude<Chain, "Solana" | "Aptos" | "Sui">;

// Map of Ethereum chain id to testnet chain config
export const EthereumChainIdToTestnetChain: Record<string, ChainConfig> = {
  11155111: testnetChains.Sepolia!,
  84532: testnetChains.BaseSepolia!,
  421614: testnetChains.ArbitrumSepolia!,
  43113: testnetChains.Avalanche!,
  80002: testnetChains.PolygonSepolia!,
};

// Map of Ethereum chain id to mainnet chain config
export const EthereumChainIdToMainnetChain: Record<string, ChainConfig> = {
  1: mainnetChains.Ethereum!,
  8453: mainnetChains.Base!,
  42161: mainnetChains.Arbitrum!,
  43114: mainnetChains.Avalanche!,
  137: mainnetChains.Polygon!,
};

export type CCTPProviders = "Wormhole";

export interface CrossChainProvider<
  TQuoteRequest = any,
  TQuoteResponse = any,
  TTransferRequest = any,
  TTransferResponse = any,
  TWithdrawRequest = any,
  TWithdrawResponse = any,
> {
  getQuote(params: TQuoteRequest): Promise<TQuoteResponse>;
  transfer(params: TTransferRequest): Promise<TTransferResponse>;
  withdraw(params: TWithdrawRequest): Promise<TWithdrawResponse>;
}

export class CrossChainCore {
  readonly _dappConfig: CrossChainDappConfig = {
    aptosNetwork: Network.TESTNET,
  };

  readonly CHAINS: ChainsConfig = testnetChains;
  readonly TOKENS: Record<string, TokenConfig> = testnetTokens;

  constructor(args: { dappConfig: CrossChainDappConfig }) {
    this._dappConfig = args.dappConfig;
    if (args.dappConfig?.aptosNetwork === Network.MAINNET) {
      this.CHAINS = mainnetChains;
      this.TOKENS = mainnetTokens;
    } else {
      this.CHAINS = testnetChains;
      this.TOKENS = testnetTokens;
    }
  }

  getProvider(providerType: CCTPProviders): CrossChainProvider {
    switch (providerType) {
      case "Wormhole":
        return new WormholeProvider(this) as CrossChainProvider<
          WormholeQuoteRequest,
          WormholeQuoteResponse,
          WormholeTransferRequest,
          WormholeTransferResponse,
          WormholeWithdrawRequest,
          WormholeWithdrawResponse
        >;
      default:
        throw new Error(`Unknown provider: ${providerType}`);
    }
  }

  async getWalletUSDCBalance(
    walletAddress: string,
    sourceChain: Chain,
  ): Promise<string> {
    if (sourceChain === "Aptos") {
      return await getAptosWalletUSDCBalance(
        walletAddress,
        this._dappConfig.aptosNetwork,
      );
    }

    if (!this.CHAINS[sourceChain]) {
      throw new Error(`Unsupported chain: ${sourceChain}`);
    }
    switch (sourceChain) {
      case "Solana":
        return await getSolanaWalletUSDCBalance(
          walletAddress,
          this._dappConfig.aptosNetwork,
          this._dappConfig?.solanaConfig?.rpc ??
            this.CHAINS[sourceChain].defaultRpc,
        );
      case "Ethereum":
      case "BaseSepolia":
      case "Sepolia":
      case "Avalanche":
      case "ArbitrumSepolia":
      case "Arbitrum":
      case "Base":
      case "PolygonSepolia":
      case "Polygon":
        return await getEthereumWalletUSDCBalance(
          walletAddress,
          this._dappConfig.aptosNetwork,
          sourceChain,
          this._dappConfig?.evmConfig?.[sourceChain]?.rpc ??
            this.CHAINS[sourceChain].defaultRpc,
        );
      case "Sui":
        return await getSuiWalletUSDCBalance(
          walletAddress,
          this._dappConfig.aptosNetwork,
          this._dappConfig?.suiConfig?.rpc ??
            this.CHAINS[sourceChain].defaultRpc,
        );
      default:
        throw new Error(`Unsupported chain: ${sourceChain}`);
    }
  }
}
