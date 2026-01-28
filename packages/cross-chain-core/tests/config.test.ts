import { describe, it, expect } from "vitest";
import {
  testnetChains,
  testnetTokens,
  mainnetChains,
  mainnetTokens,
  Context,
} from "../src/config";

describe("Config", () => {
  describe("Context enum", () => {
    it("should have all supported contexts", () => {
      expect(Context.ETH).toBe("Ethereum");
      expect(Context.SOLANA).toBe("Solana");
      expect(Context.APTOS).toBe("Aptos");
      expect(Context.SUI).toBe("Sui");
    });
  });

  describe("testnetChains", () => {
    it("should have Aptos chain config", () => {
      expect(testnetChains.Aptos).toBeDefined();
      expect(testnetChains.Aptos?.context).toBe(Context.APTOS);
      expect(testnetChains.Aptos?.key).toBe("Aptos");
    });

    it("should have Solana chain config", () => {
      expect(testnetChains.Solana).toBeDefined();
      expect(testnetChains.Solana?.context).toBe(Context.SOLANA);
      expect(testnetChains.Solana?.key).toBe("Solana");
    });

    it("should have Sepolia (Ethereum testnet) chain config", () => {
      expect(testnetChains.Sepolia).toBeDefined();
      expect(testnetChains.Sepolia?.context).toBe(Context.ETH);
      expect(testnetChains.Sepolia?.chainId).toBe(11155111);
    });

    it("should have BaseSepolia chain config", () => {
      expect(testnetChains.BaseSepolia).toBeDefined();
      expect(testnetChains.BaseSepolia?.context).toBe(Context.ETH);
      expect(testnetChains.BaseSepolia?.chainId).toBe(84532);
    });

    it("should have ArbitrumSepolia chain config", () => {
      expect(testnetChains.ArbitrumSepolia).toBeDefined();
      expect(testnetChains.ArbitrumSepolia?.context).toBe(Context.ETH);
      expect(testnetChains.ArbitrumSepolia?.chainId).toBe(421614);
    });

    it("should have Avalanche (Fuji testnet) chain config", () => {
      expect(testnetChains.Avalanche).toBeDefined();
      expect(testnetChains.Avalanche?.context).toBe(Context.ETH);
      expect(testnetChains.Avalanche?.chainId).toBe(43113);
    });

    it("should have PolygonSepolia chain config", () => {
      expect(testnetChains.PolygonSepolia).toBeDefined();
      expect(testnetChains.PolygonSepolia?.context).toBe(Context.ETH);
      expect(testnetChains.PolygonSepolia?.chainId).toBe(80002);
    });

    it("should have Sui chain config", () => {
      expect(testnetChains.Sui).toBeDefined();
      expect(testnetChains.Sui?.context).toBe(Context.SUI);
      expect(testnetChains.Sui?.key).toBe("Sui");
    });

    it("all chain configs should have required properties", () => {
      Object.values(testnetChains).forEach((config) => {
        if (config) {
          expect(config.key).toBeDefined();
          expect(config.context).toBeDefined();
          expect(config.displayName).toBeDefined();
          expect(config.explorerUrl).toBeDefined();
          expect(config.explorerName).toBeDefined();
          expect(config.defaultRpc).toBeDefined();
          expect(config.icon).toBeDefined();
          expect(config.chainId).toBeDefined();
        }
      });
    });
  });

  describe("mainnetChains", () => {
    it("should have Aptos chain config", () => {
      expect(mainnetChains.Aptos).toBeDefined();
      expect(mainnetChains.Aptos?.context).toBe(Context.APTOS);
      expect(mainnetChains.Aptos?.key).toBe("Aptos");
    });

    it("should have Solana chain config", () => {
      expect(mainnetChains.Solana).toBeDefined();
      expect(mainnetChains.Solana?.context).toBe(Context.SOLANA);
      expect(mainnetChains.Solana?.key).toBe("Solana");
    });

    it("should have Ethereum chain config", () => {
      expect(mainnetChains.Ethereum).toBeDefined();
      expect(mainnetChains.Ethereum?.context).toBe(Context.ETH);
      expect(mainnetChains.Ethereum?.chainId).toBe(1);
    });

    it("should have Base chain config", () => {
      expect(mainnetChains.Base).toBeDefined();
      expect(mainnetChains.Base?.context).toBe(Context.ETH);
      expect(mainnetChains.Base?.chainId).toBe(8453);
    });

    it("should have Arbitrum chain config", () => {
      expect(mainnetChains.Arbitrum).toBeDefined();
      expect(mainnetChains.Arbitrum?.context).toBe(Context.ETH);
      expect(mainnetChains.Arbitrum?.chainId).toBe(42161);
    });

    it("should have Avalanche chain config", () => {
      expect(mainnetChains.Avalanche).toBeDefined();
      expect(mainnetChains.Avalanche?.context).toBe(Context.ETH);
      expect(mainnetChains.Avalanche?.chainId).toBe(43114);
    });

    it("should have Polygon chain config", () => {
      expect(mainnetChains.Polygon).toBeDefined();
      expect(mainnetChains.Polygon?.context).toBe(Context.ETH);
      expect(mainnetChains.Polygon?.chainId).toBe(137);
    });

    it("should have Sui chain config", () => {
      expect(mainnetChains.Sui).toBeDefined();
      expect(mainnetChains.Sui?.context).toBe(Context.SUI);
      expect(mainnetChains.Sui?.key).toBe("Sui");
    });

    it("all chain configs should have required properties", () => {
      Object.values(mainnetChains).forEach((config) => {
        if (config) {
          expect(config.key).toBeDefined();
          expect(config.context).toBeDefined();
          expect(config.displayName).toBeDefined();
          expect(config.explorerUrl).toBeDefined();
          expect(config.explorerName).toBeDefined();
          expect(config.defaultRpc).toBeDefined();
          expect(config.icon).toBeDefined();
          expect(config.chainId).toBeDefined();
        }
      });
    });
  });

  describe("testnetTokens", () => {
    it("should have Aptos USDC token config", () => {
      expect(testnetTokens.Aptos).toBeDefined();
      expect(testnetTokens.Aptos.symbol).toBe("USDC");
      expect(testnetTokens.Aptos.decimals).toBe(6);
      expect(testnetTokens.Aptos.tokenId.chain).toBe("Aptos");
    });

    it("should have Solana USDC token config", () => {
      expect(testnetTokens.Solana).toBeDefined();
      expect(testnetTokens.Solana.symbol).toBe("USDC");
      expect(testnetTokens.Solana.decimals).toBe(6);
      expect(testnetTokens.Solana.tokenId.chain).toBe("Solana");
    });

    it("should have Sepolia USDC token config", () => {
      expect(testnetTokens.Sepolia).toBeDefined();
      expect(testnetTokens.Sepolia.symbol).toBe("USDC");
      expect(testnetTokens.Sepolia.decimals).toBe(6);
      expect(testnetTokens.Sepolia.tokenId.chain).toBe("Sepolia");
    });

    it("should have Sui USDC token config", () => {
      expect(testnetTokens.Sui).toBeDefined();
      expect(testnetTokens.Sui.symbol).toBe("USDC");
      expect(testnetTokens.Sui.decimals).toBe(6);
      expect(testnetTokens.Sui.tokenId.chain).toBe("Sui");
    });

    it("all token configs should have USDC with 6 decimals", () => {
      Object.values(testnetTokens).forEach((config) => {
        expect(config.symbol).toBe("USDC");
        expect(config.decimals).toBe(6);
        expect(config.tokenId).toBeDefined();
        expect(config.tokenId.chain).toBeDefined();
        expect(config.tokenId.address).toBeDefined();
      });
    });
  });

  describe("mainnetTokens", () => {
    it("should have Aptos USDC token config", () => {
      expect(mainnetTokens.Aptos).toBeDefined();
      expect(mainnetTokens.Aptos.symbol).toBe("USDC");
      expect(mainnetTokens.Aptos.decimals).toBe(6);
      expect(mainnetTokens.Aptos.tokenId.chain).toBe("Aptos");
    });

    it("should have Solana USDC token config", () => {
      expect(mainnetTokens.Solana).toBeDefined();
      expect(mainnetTokens.Solana.symbol).toBe("USDC");
      expect(mainnetTokens.Solana.decimals).toBe(6);
      expect(mainnetTokens.Solana.tokenId.chain).toBe("Solana");
    });

    it("should have Ethereum USDC token config", () => {
      expect(mainnetTokens.Ethereum).toBeDefined();
      expect(mainnetTokens.Ethereum.symbol).toBe("USDC");
      expect(mainnetTokens.Ethereum.decimals).toBe(6);
      expect(mainnetTokens.Ethereum.tokenId.chain).toBe("Ethereum");
    });

    it("should have Sui USDC token config", () => {
      expect(mainnetTokens.Sui).toBeDefined();
      expect(mainnetTokens.Sui.symbol).toBe("USDC");
      expect(mainnetTokens.Sui.decimals).toBe(6);
      expect(mainnetTokens.Sui.tokenId.chain).toBe("Sui");
    });

    it("all token configs should have USDC with 6 decimals", () => {
      Object.values(mainnetTokens).forEach((config) => {
        expect(config.symbol).toBe("USDC");
        expect(config.decimals).toBe(6);
        expect(config.tokenId).toBeDefined();
        expect(config.tokenId.chain).toBeDefined();
        expect(config.tokenId.address).toBeDefined();
      });
    });

    it("mainnet token addresses should differ from testnet", () => {
      // Verify mainnet and testnet have different addresses for common chains
      expect(mainnetTokens.Solana.tokenId.address).not.toBe(
        testnetTokens.Solana.tokenId.address
      );
      expect(mainnetTokens.Aptos.tokenId.address).not.toBe(
        testnetTokens.Aptos.tokenId.address
      );
    });
  });

  describe("chain and token consistency", () => {
    it("mainnet chains and tokens should have matching keys", () => {
      const chainKeys = Object.keys(mainnetChains);
      const tokenKeys = Object.keys(mainnetTokens);

      // All chains should have corresponding tokens
      chainKeys.forEach((key) => {
        expect(tokenKeys).toContain(key);
      });
    });

    it("testnet chains should have corresponding tokens", () => {
      const chainKeys = Object.keys(testnetChains);
      const tokenKeys = Object.keys(testnetTokens);

      // All chains should have corresponding tokens
      chainKeys.forEach((key) => {
        expect(tokenKeys).toContain(key);
      });
    });
  });
});

