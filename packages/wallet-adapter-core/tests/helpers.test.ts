import { describe, it, expect } from "vitest";
import {
  isMobile,
  isInAppBrowser,
  isRedirectable,
  generalizedErrorMessage,
  getAptosConfig,
  isAptosNetwork,
  isAptosLiveNetwork,
  convertNetwork,
} from "../src/utils/helpers";
import { Network } from "@aptos-labs/ts-sdk";
import type { NetworkInfo } from "@aptos-labs/wallet-standard";

// Helper to mock navigator.userAgent
const mockUserAgent = (userAgent: string) => {
  Object.defineProperty(navigator, "userAgent", {
    value: userAgent,
    writable: true,
    configurable: true,
  });
};

describe("Helper Functions", () => {
  describe("isMobile", () => {
    it("should return true for iPhone user agent", () => {
      mockUserAgent(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15"
      );
      expect(isMobile()).toBe(true);
    });

    it("should return true for Android user agent", () => {
      mockUserAgent(
        "Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 Mobile Safari/537.36"
      );
      expect(isMobile()).toBe(true);
    });

    it("should return true for iPad user agent", () => {
      mockUserAgent(
        "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15"
      );
      expect(isMobile()).toBe(true);
    });

    it("should return false for desktop user agent", () => {
      mockUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
      );
      expect(isMobile()).toBe(false);
    });

    it("should return false for Windows desktop", () => {
      mockUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      );
      expect(isMobile()).toBe(false);
    });
  });

  describe("isInAppBrowser", () => {
    it("should return true for iPhone in-app browser", () => {
      mockUserAgent(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko)"
      );
      expect(isInAppBrowser()).toBe(true);
    });

    it("should return false for regular Safari on iPhone", () => {
      mockUserAgent(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
      );
      expect(isInAppBrowser()).toBe(false);
    });

    it("should return false for desktop browser", () => {
      mockUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
      );
      expect(isInAppBrowser()).toBe(false);
    });
  });

  describe("isRedirectable", () => {
    it("should return false for desktop browsers", () => {
      mockUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
      );
      expect(isRedirectable()).toBe(false);
    });

    it("should return true for mobile Safari (not in-app)", () => {
      mockUserAgent(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
      );
      expect(isRedirectable()).toBe(true);
    });

    it("should return false for mobile in-app browser", () => {
      mockUserAgent(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko)"
      );
      expect(isRedirectable()).toBe(false);
    });
  });

  describe("generalizedErrorMessage", () => {
    it("should return message from error object", () => {
      const error = new Error("Test error message");
      expect(generalizedErrorMessage(error)).toBe("Test error message");
    });

    it("should return message from object with message property", () => {
      const error = { message: "Custom error message" };
      expect(generalizedErrorMessage(error)).toBe("Custom error message");
    });

    it("should return the error itself if not an object with message", () => {
      expect(generalizedErrorMessage("String error")).toBe("String error");
      expect(generalizedErrorMessage(123)).toBe(123);
    });

    it("should return undefined for undefined input", () => {
      expect(generalizedErrorMessage(undefined)).toBe(undefined);
    });

    it("should return null for null input", () => {
      expect(generalizedErrorMessage(null)).toBeNull();
    });
  });

  describe("isAptosNetwork", () => {
    it("should return true for mainnet", () => {
      const networkInfo: NetworkInfo = { name: "mainnet" as any, chainId: 1 };
      expect(isAptosNetwork(networkInfo)).toBe(true);
    });

    it("should return true for testnet", () => {
      const networkInfo: NetworkInfo = { name: "testnet" as any, chainId: 2 };
      expect(isAptosNetwork(networkInfo)).toBe(true);
    });

    it("should return true for devnet", () => {
      const networkInfo: NetworkInfo = { name: "devnet" as any, chainId: 148 };
      expect(isAptosNetwork(networkInfo)).toBe(true);
    });

    it("should throw for null network", () => {
      expect(() => isAptosNetwork(null)).toThrow("Undefined network");
    });
  });

  describe("isAptosLiveNetwork", () => {
    it("should return true for mainnet", () => {
      expect(isAptosLiveNetwork(Network.MAINNET)).toBe(true);
    });

    it("should return true for testnet", () => {
      expect(isAptosLiveNetwork(Network.TESTNET)).toBe(true);
    });

    it("should return true for devnet", () => {
      expect(isAptosLiveNetwork(Network.DEVNET)).toBe(true);
    });

    it("should return false for local", () => {
      expect(isAptosLiveNetwork(Network.LOCAL)).toBe(false);
    });
  });

  describe("convertNetwork", () => {
    it("should convert mainnet", () => {
      const networkInfo: NetworkInfo = { name: "mainnet" as any, chainId: 1 };
      expect(convertNetwork(networkInfo)).toBe(Network.MAINNET);
    });

    it("should convert testnet", () => {
      const networkInfo: NetworkInfo = { name: "testnet" as any, chainId: 2 };
      expect(convertNetwork(networkInfo)).toBe(Network.TESTNET);
    });

    it("should convert devnet", () => {
      const networkInfo: NetworkInfo = { name: "devnet" as any, chainId: 148 };
      expect(convertNetwork(networkInfo)).toBe(Network.DEVNET);
    });

    it("should convert local", () => {
      const networkInfo: NetworkInfo = { name: "local" as any, chainId: 4 };
      expect(convertNetwork(networkInfo)).toBe(Network.LOCAL);
    });

    it("should throw for invalid network name", () => {
      const networkInfo: NetworkInfo = { name: "invalid" as any, chainId: 999 };
      expect(() => convertNetwork(networkInfo)).toThrow("Invalid Aptos network name");
    });

    it("should throw for null network", () => {
      expect(() => convertNetwork(null)).toThrow("Invalid Aptos network name");
    });
  });

  describe("getAptosConfig", () => {
    it("should throw for null network", () => {
      expect(() => getAptosConfig(null, undefined)).toThrow("Undefined network");
    });

    it("should return AptosConfig for mainnet", () => {
      const networkInfo: NetworkInfo = { name: "mainnet" as any, chainId: 1 };
      const config = getAptosConfig(networkInfo, undefined);
      expect(config).toBeDefined();
      expect(config.network).toBe(Network.MAINNET);
    });

    it("should return AptosConfig for testnet", () => {
      const networkInfo: NetworkInfo = { name: "testnet" as any, chainId: 2 };
      const config = getAptosConfig(networkInfo, undefined);
      expect(config).toBeDefined();
      expect(config.network).toBe(Network.TESTNET);
    });

    it("should include API key when provided", () => {
      const networkInfo: NetworkInfo = { name: "mainnet" as any, chainId: 1 };
      const dappConfig = {
        network: Network.MAINNET,
        aptosApiKeys: { mainnet: "test-api-key" },
      };
      const config = getAptosConfig(networkInfo, dappConfig);
      expect(config).toBeDefined();
    });

    it("should handle known custom network URLs", () => {
      const networkInfo: NetworkInfo = {
        name: "custom" as any,
        chainId: 1,
        url: "https://wallet.okx.com/fullnode/aptos/discover/rpc",
      };
      const config = getAptosConfig(networkInfo, undefined);
      expect(config).toBeDefined();
      expect(config.network).toBe(Network.CUSTOM);
    });

    it("should throw for unknown custom network", () => {
      const networkInfo: NetworkInfo = {
        name: "unknown" as any,
        chainId: 999,
        url: "https://unknown.network.com",
      };
      expect(() => getAptosConfig(networkInfo, undefined)).toThrow(
        /Invalid network/
      );
    });
  });
});

