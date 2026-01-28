import { describe, it, expect } from "vitest";
import { Network } from "@aptos-labs/ts-sdk";
import {
  CrossChainCore,
  EthereumChainIdToTestnetChain,
  EthereumChainIdToMainnetChain,
} from "../src/CrossChainCore";
import { testnetChains, testnetTokens, mainnetChains, mainnetTokens } from "../src/config";
import { WormholeProvider } from "../src/providers/wormhole";

describe("CrossChainCore", () => {
  describe("constructor", () => {
    it("should create instance with testnet config", () => {
      const core = new CrossChainCore({
        dappConfig: { aptosNetwork: Network.TESTNET },
      });

      expect(core).toBeDefined();
      expect(core._dappConfig.aptosNetwork).toBe(Network.TESTNET);
    });

    it("should create instance with mainnet config", () => {
      const core = new CrossChainCore({
        dappConfig: { aptosNetwork: Network.MAINNET },
      });

      expect(core).toBeDefined();
      expect(core._dappConfig.aptosNetwork).toBe(Network.MAINNET);
    });

    it("should use testnet chains for TESTNET network", () => {
      const core = new CrossChainCore({
        dappConfig: { aptosNetwork: Network.TESTNET },
      });

      expect(core.CHAINS).toBe(testnetChains);
      expect(core.TOKENS).toBe(testnetTokens);
    });

    it("should use mainnet chains for MAINNET network", () => {
      const core = new CrossChainCore({
        dappConfig: { aptosNetwork: Network.MAINNET },
      });

      expect(core.CHAINS).toBe(mainnetChains);
      expect(core.TOKENS).toBe(mainnetTokens);
    });

    it("should default to testnet when network is not mainnet", () => {
      const core = new CrossChainCore({
        dappConfig: { aptosNetwork: Network.DEVNET },
      });

      expect(core.CHAINS).toBe(testnetChains);
      expect(core.TOKENS).toBe(testnetTokens);
    });

    it("should store solana config when provided", () => {
      const solanaConfig = {
        rpc: "https://custom.solana.rpc",
        priorityFeeConfig: {
          percentile: 0.9,
          min: 100000,
          max: 100000000,
        },
      };

      const core = new CrossChainCore({
        dappConfig: {
          aptosNetwork: Network.TESTNET,
          solanaConfig,
        },
      });

      expect(core._dappConfig.solanaConfig).toEqual(solanaConfig);
    });

    it("should store disableTelemetry when provided", () => {
      const core = new CrossChainCore({
        dappConfig: {
          aptosNetwork: Network.TESTNET,
          disableTelemetry: true,
        },
      });

      expect(core._dappConfig.disableTelemetry).toBe(true);
    });
  });

  describe("getProvider", () => {
    it("should return WormholeProvider for 'Wormhole'", () => {
      const core = new CrossChainCore({
        dappConfig: { aptosNetwork: Network.TESTNET },
      });

      const provider = core.getProvider("Wormhole");

      expect(provider).toBeDefined();
      expect(provider).toBeInstanceOf(WormholeProvider);
    });

    it("should throw error for unknown provider", () => {
      const core = new CrossChainCore({
        dappConfig: { aptosNetwork: Network.TESTNET },
      });

      expect(() => {
        core.getProvider("Unknown" as any);
      }).toThrow("Unknown provider: Unknown");
    });
  });

  describe("EthereumChainIdToTestnetChain mapping", () => {
    it("should map Sepolia chain ID correctly", () => {
      const config = EthereumChainIdToTestnetChain["11155111"];
      expect(config).toBeDefined();
      expect(config.key).toBe("Sepolia");
    });

    it("should map BaseSepolia chain ID correctly", () => {
      const config = EthereumChainIdToTestnetChain["84532"];
      expect(config).toBeDefined();
      expect(config.key).toBe("BaseSepolia");
    });

    it("should map ArbitrumSepolia chain ID correctly", () => {
      const config = EthereumChainIdToTestnetChain["421614"];
      expect(config).toBeDefined();
      expect(config.key).toBe("ArbitrumSepolia");
    });

    it("should map Avalanche Fuji chain ID correctly", () => {
      const config = EthereumChainIdToTestnetChain["43113"];
      expect(config).toBeDefined();
      expect(config.key).toBe("Avalanche");
    });

    it("should map PolygonSepolia chain ID correctly", () => {
      const config = EthereumChainIdToTestnetChain["80002"];
      expect(config).toBeDefined();
      expect(config.key).toBe("PolygonSepolia");
    });
  });

  describe("EthereumChainIdToMainnetChain mapping", () => {
    it("should map Ethereum mainnet chain ID correctly", () => {
      const config = EthereumChainIdToMainnetChain["1"];
      expect(config).toBeDefined();
      expect(config.key).toBe("Ethereum");
    });

    it("should map Base mainnet chain ID correctly", () => {
      const config = EthereumChainIdToMainnetChain["8453"];
      expect(config).toBeDefined();
      expect(config.key).toBe("Base");
    });

    it("should map Arbitrum mainnet chain ID correctly", () => {
      const config = EthereumChainIdToMainnetChain["42161"];
      expect(config).toBeDefined();
      expect(config.key).toBe("Arbitrum");
    });

    it("should map Avalanche mainnet chain ID correctly", () => {
      const config = EthereumChainIdToMainnetChain["43114"];
      expect(config).toBeDefined();
      expect(config.key).toBe("Avalanche");
    });

    it("should map Polygon mainnet chain ID correctly", () => {
      const config = EthereumChainIdToMainnetChain["137"];
      expect(config).toBeDefined();
      expect(config.key).toBe("Polygon");
    });
  });

  describe("getWalletUSDCBalance", () => {
    it("should throw for unsupported chain", async () => {
      const core = new CrossChainCore({
        dappConfig: { aptosNetwork: Network.TESTNET },
      });

      await expect(
        core.getWalletUSDCBalance("0x123", "UnsupportedChain" as any)
      ).rejects.toThrow("Unsupported chain");
    });

    // Note: Full balance tests require mocking external RPC calls
    // These are covered in integration tests
  });
});

