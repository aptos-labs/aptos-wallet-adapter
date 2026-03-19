import { Network } from "@aptos-labs/ts-sdk";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CrossChainCore } from "../src/CrossChainCore";
import { mainnetChains, testnetChains } from "../src/config";
import { WormholeProvider } from "../src/providers/wormhole";

describe("WormholeProvider", () => {
  describe("constructor", () => {
    it("should create provider with CrossChainCore reference", () => {
      const core = new CrossChainCore({
        dappConfig: { aptosNetwork: Network.TESTNET },
      });

      const provider = new WormholeProvider(core);

      expect(provider).toBeDefined();
      expect(provider).toBeInstanceOf(WormholeProvider);
    });

    it("should work with mainnet CrossChainCore", () => {
      const core = new CrossChainCore({
        dappConfig: { aptosNetwork: Network.MAINNET },
      });

      const provider = new WormholeProvider(core);

      expect(provider).toBeDefined();
    });
  });

  describe("wormholeContext", () => {
    it("should initially be undefined", () => {
      const core = new CrossChainCore({
        dappConfig: { aptosNetwork: Network.TESTNET },
      });

      const provider = new WormholeProvider(core);

      expect(provider.wormholeContext).toBeUndefined();
    });
  });

  describe("getChainConfig", () => {
    let testnetCore: CrossChainCore;
    let testnetProvider: WormholeProvider;

    beforeEach(() => {
      testnetCore = new CrossChainCore({
        dappConfig: { aptosNetwork: Network.TESTNET },
      });
      testnetProvider = new WormholeProvider(testnetCore);
    });

    it("should return config for Solana", () => {
      const config = testnetProvider.getChainConfig("Solana");

      expect(config).toBeDefined();
      expect(config.key).toBe("Solana");
      expect(config).toBe(testnetChains.Solana);
    });

    it("should return config for Aptos", () => {
      const config = testnetProvider.getChainConfig("Aptos");

      expect(config).toBeDefined();
      expect(config.key).toBe("Aptos");
    });

    it("should return config for Sepolia (testnet)", () => {
      const config = testnetProvider.getChainConfig("Sepolia");

      expect(config).toBeDefined();
      expect(config.key).toBe("Sepolia");
      expect(config.chainId).toBe(11155111);
    });

    it("should return config for Sui", () => {
      const config = testnetProvider.getChainConfig("Sui");

      expect(config).toBeDefined();
      expect(config.key).toBe("Sui");
    });

    it("should return mainnet config when core is mainnet", () => {
      const mainnetCore = new CrossChainCore({
        dappConfig: { aptosNetwork: Network.MAINNET },
      });
      const mainnetProvider = new WormholeProvider(mainnetCore);

      const config = mainnetProvider.getChainConfig("Ethereum");

      expect(config).toBeDefined();
      expect(config.key).toBe("Ethereum");
      expect(config.chainId).toBe(1);
      expect(config).toBe(mainnetChains.Ethereum);
    });

    it("should throw for invalid chain", () => {
      expect(() => {
        testnetProvider.getChainConfig("InvalidChain" as any);
      }).toThrow("Chain config not found for chain: InvalidChain");
    });

    it("should throw for chain not in current network config", () => {
      // Ethereum mainnet is not in testnet config
      expect(() => {
        testnetProvider.getChainConfig("Ethereum");
      }).toThrow("Chain config not found");
    });
  });

  describe("claimWithdraw", () => {
    const mockReceipt = { state: 3 } as any;

    it("should use server-side claim for Solana when serverClaimUrl is configured", async () => {
      const core = new CrossChainCore({
        dappConfig: {
          aptosNetwork: Network.TESTNET,
          solanaConfig: { serverClaimUrl: "https://example.com/api/claim" },
        },
      });
      const provider = new WormholeProvider(core);

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({ destinationChainTxnId: "server-tx-123" }),
      });
      vi.stubGlobal("fetch", mockFetch);

      const result = await provider.claimWithdraw({
        claimChain: "Solana",
        destinationAddress: "SolAddr123",
        receipt: mockReceipt,
      });

      expect(mockFetch).toHaveBeenCalledOnce();
      expect(result.destinationChainTxnId).toBe("server-tx-123");

      vi.unstubAllGlobals();
    });

    it("should skip server-side claim when skipServerClaim is true", async () => {
      const core = new CrossChainCore({
        dappConfig: {
          aptosNetwork: Network.TESTNET,
          solanaConfig: { serverClaimUrl: "https://example.com/api/claim" },
        },
      });
      const provider = new WormholeProvider(core);

      const mockFetch = vi.fn();
      vi.stubGlobal("fetch", mockFetch);

      // Without a wormholeRoute initialized, the wallet-based path throws
      await expect(
        provider.claimWithdraw({
          claimChain: "Solana",
          destinationAddress: "SolAddr123",
          receipt: mockReceipt,
          skipServerClaim: true,
        }),
      ).rejects.toThrow("Wormhole route not initialized");

      // fetch should never have been called — server path was skipped
      expect(mockFetch).not.toHaveBeenCalled();

      vi.unstubAllGlobals();
    });

    it("should require wallet when skipServerClaim bypasses server path", async () => {
      const core = new CrossChainCore({
        dappConfig: {
          aptosNetwork: Network.TESTNET,
          solanaConfig: { serverClaimUrl: "https://example.com/api/claim" },
        },
      });
      const provider = new WormholeProvider(core);

      // Inject a mock route so we get past the route check
      (provider as any).wormholeRoute = {};

      await expect(
        provider.claimWithdraw({
          claimChain: "Solana",
          destinationAddress: "SolAddr123",
          receipt: mockReceipt,
          skipServerClaim: true,
        }),
      ).rejects.toThrow("Wallet is required");

      vi.unstubAllGlobals();
    });

    it("should still use server path when skipServerClaim is false", async () => {
      const core = new CrossChainCore({
        dappConfig: {
          aptosNetwork: Network.TESTNET,
          solanaConfig: { serverClaimUrl: "https://example.com/api/claim" },
        },
      });
      const provider = new WormholeProvider(core);

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({ destinationChainTxnId: "server-tx-456" }),
      });
      vi.stubGlobal("fetch", mockFetch);

      const result = await provider.claimWithdraw({
        claimChain: "Solana",
        destinationAddress: "SolAddr123",
        receipt: mockReceipt,
        skipServerClaim: false,
      });

      expect(mockFetch).toHaveBeenCalledOnce();
      expect(result.destinationChainTxnId).toBe("server-tx-456");

      vi.unstubAllGlobals();
    });
  });

  // Note: getQuote, transfer, and withdraw tests require initializing
  // the Wormhole SDK context which needs network access.
  // These are covered in integration tests.
});
