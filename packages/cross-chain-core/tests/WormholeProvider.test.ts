import { describe, it, expect, beforeEach } from "vitest";
import { Network } from "@aptos-labs/ts-sdk";
import { CrossChainCore } from "../src/CrossChainCore";
import { WormholeProvider } from "../src/providers/wormhole";
import { testnetChains, mainnetChains } from "../src/config";

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

  describe("getTokenInfo", () => {
    let testnetCore: CrossChainCore;
    let testnetProvider: WormholeProvider;

    beforeEach(() => {
      testnetCore = new CrossChainCore({
        dappConfig: { aptosNetwork: Network.TESTNET },
      });
      testnetProvider = new WormholeProvider(testnetCore);
    });

    it("should return token info for Solana to Aptos transfer", () => {
      const { sourceToken, destToken } = testnetProvider.getTokenInfo(
        "Solana",
        "Aptos",
      );

      expect(sourceToken).toBeDefined();
      expect(destToken).toBeDefined();
    });

    it("should return token info for Aptos to Solana transfer", () => {
      const { sourceToken, destToken } = testnetProvider.getTokenInfo(
        "Aptos",
        "Solana",
      );

      expect(sourceToken).toBeDefined();
      expect(destToken).toBeDefined();
    });

    it("should return different tokens for source and destination", () => {
      const { sourceToken, destToken } = testnetProvider.getTokenInfo(
        "Solana",
        "Aptos",
      );

      // Tokens should have different chain references
      expect(sourceToken).not.toEqual(destToken);
    });

    it("should return mainnet tokens when core is mainnet", () => {
      const mainnetCore = new CrossChainCore({
        dappConfig: { aptosNetwork: Network.MAINNET },
      });
      const mainnetProvider = new WormholeProvider(mainnetCore);

      const { sourceToken, destToken } = mainnetProvider.getTokenInfo(
        "Solana",
        "Aptos",
      );

      expect(sourceToken).toBeDefined();
      expect(destToken).toBeDefined();
    });
  });

  // Note: getQuote, transfer, and withdraw tests require initializing
  // the Wormhole SDK context which needs network access.
  // These are covered in integration tests.
});
