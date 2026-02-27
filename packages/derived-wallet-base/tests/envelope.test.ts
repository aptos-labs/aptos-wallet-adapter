import { describe, it, expect } from "vitest";
import { NetworkToChainId } from "@aptos-labs/ts-sdk";
import {
  getChainName,
  createStructuredMessageStatement,
} from "../src/envelope";

describe("envelope", () => {
  describe("getChainName", () => {
    it("should return 'mainnet' for mainnet chain id", () => {
      const mainnetChainId = NetworkToChainId.mainnet;
      expect(getChainName(mainnetChainId)).toBe("mainnet");
    });

    it("should return 'testnet' for testnet chain id", () => {
      const testnetChainId = NetworkToChainId.testnet;
      expect(getChainName(testnetChainId)).toBe("testnet");
    });

    it("should return custom network descriptor for unknown chain id", () => {
      const unknownChainId = 99999;
      expect(getChainName(unknownChainId)).toBe("custom network: 99999");
    });
  });

  describe("createStructuredMessageStatement", () => {
    it("should create statement for message without chainId", () => {
      const statement = createStructuredMessageStatement({
        message: "Hello, Aptos!",
        nonce: "nonce-123",
      });

      expect(statement).toBe(
        "To sign the following message on Aptos blockchain: Hello, Aptos!",
      );
    });

    it("should create statement for message with chainId", () => {
      const testnetChainId = NetworkToChainId.testnet;
      const statement = createStructuredMessageStatement({
        message: "Hello, Aptos!",
        nonce: "nonce-123",
        chainId: testnetChainId,
      });

      expect(statement).toBe(
        "To sign the following message on Aptos blockchain (testnet): Hello, Aptos!",
      );
    });

    it("should escape newlines in the message", () => {
      const statement = createStructuredMessageStatement({
        message: "Line 1\nLine 2\nLine 3",
        nonce: "nonce-123",
      });

      expect(statement).toBe(
        "To sign the following message on Aptos blockchain: Line 1\\nLine 2\\nLine 3",
      );
    });

    it("should handle empty message", () => {
      const statement = createStructuredMessageStatement({
        message: "",
        nonce: "nonce-123",
      });

      expect(statement).toBe(
        "To sign the following message on Aptos blockchain: ",
      );
    });

    it("should handle custom chain id", () => {
      const statement = createStructuredMessageStatement({
        message: "Test",
        nonce: "nonce-123",
        chainId: 12345,
      });

      expect(statement).toBe(
        "To sign the following message on Aptos blockchain (custom network: 12345): Test",
      );
    });
  });
});
