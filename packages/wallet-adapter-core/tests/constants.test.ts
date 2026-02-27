import { describe, it, expect } from "vitest";
import {
  WalletReadyState,
  NetworkName,
  ChainIdToAnsSupportedNetworkMap,
  APTOS_CONNECT_BASE_URL,
  PETRA_WEB_BASE_URL,
  PETRA_WEB_GENERIC_WALLET_NAME,
  PETRA_WALLET_NAME,
  DEFAULT_WALLET_CONNECTION_FALLBACKS,
  APTOS_CONNECT_ACCOUNT_URL,
  PETRA_WEB_ACCOUNT_URL,
} from "../src/constants";

describe("Constants", () => {
  describe("WalletReadyState enum", () => {
    it("should have Installed state", () => {
      expect(WalletReadyState.Installed).toBe("Installed");
    });

    it("should have NotDetected state", () => {
      expect(WalletReadyState.NotDetected).toBe("NotDetected");
    });

    it("should only have two states", () => {
      const states = Object.values(WalletReadyState);
      expect(states).toHaveLength(2);
      expect(states).toContain("Installed");
      expect(states).toContain("NotDetected");
    });
  });

  describe("NetworkName enum", () => {
    it("should have Mainnet", () => {
      expect(NetworkName.Mainnet).toBe("mainnet");
    });

    it("should have Testnet", () => {
      expect(NetworkName.Testnet).toBe("testnet");
    });

    it("should have Devnet", () => {
      expect(NetworkName.Devnet).toBe("devnet");
    });

    it("should have three networks", () => {
      const networks = Object.values(NetworkName);
      expect(networks).toHaveLength(3);
    });
  });

  describe("ChainIdToAnsSupportedNetworkMap", () => {
    it("should map chainId 1 to mainnet", () => {
      expect(ChainIdToAnsSupportedNetworkMap["1"]).toBe("mainnet");
    });

    it("should map chainId 2 to testnet", () => {
      expect(ChainIdToAnsSupportedNetworkMap["2"]).toBe("testnet");
    });

    it("should only have mainnet and testnet (ANS supported networks)", () => {
      const networks = Object.values(ChainIdToAnsSupportedNetworkMap);
      expect(networks).toHaveLength(2);
      expect(networks).toContain("mainnet");
      expect(networks).toContain("testnet");
    });
  });

  describe("URL constants", () => {
    it("should have correct APTOS_CONNECT_BASE_URL (deprecated)", () => {
      expect(APTOS_CONNECT_BASE_URL).toBe("https://aptosconnect.app");
    });

    it("should have correct PETRA_WEB_BASE_URL", () => {
      expect(PETRA_WEB_BASE_URL).toBe("https://web.petra.app");
    });

    it("should have correct APTOS_CONNECT_ACCOUNT_URL (deprecated)", () => {
      expect(APTOS_CONNECT_ACCOUNT_URL).toBe(
        "https://aptosconnect.app/dashboard/main-account",
      );
    });

    it("should have correct PETRA_WEB_ACCOUNT_URL", () => {
      expect(PETRA_WEB_ACCOUNT_URL).toBe(
        "https://web.petra.app/dashboard/main-account",
      );
    });
  });

  describe("Wallet name constants", () => {
    it("should have correct PETRA_WEB_GENERIC_WALLET_NAME", () => {
      expect(PETRA_WEB_GENERIC_WALLET_NAME).toBe("Petra Web");
    });

    it("should have correct PETRA_WALLET_NAME", () => {
      expect(PETRA_WALLET_NAME).toBe("Petra");
    });
  });

  describe("DEFAULT_WALLET_CONNECTION_FALLBACKS", () => {
    it("should map Petra to Petra Web", () => {
      expect(DEFAULT_WALLET_CONNECTION_FALLBACKS[PETRA_WALLET_NAME]).toBe(
        PETRA_WEB_GENERIC_WALLET_NAME,
      );
    });

    it("should only have one fallback mapping", () => {
      const keys = Object.keys(DEFAULT_WALLET_CONNECTION_FALLBACKS);
      expect(keys).toHaveLength(1);
      expect(keys[0]).toBe(PETRA_WALLET_NAME);
    });
  });
});
