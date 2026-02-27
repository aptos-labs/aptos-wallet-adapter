import { describe, it, expect, vi } from "vitest";

// Mock the heavy Wormhole SDK dependency so we can import the real utility functions
vi.mock("@wormhole-foundation/sdk-solana", () => ({
  determinePriorityFee: vi.fn(),
  determinePriorityFeeTritonOne: vi.fn(),
}));

import {
  formatTransactionError,
  determineRpcProvider,
  sleep,
  isEmptyObject,
  PriorityFeeConfig,
} from "../../src/providers/wormhole/signers/solanaUtils";

describe("solanaUtils", () => {
  describe("formatTransactionError", () => {
    it("should format string errors", () => {
      const result = formatTransactionError("Some error");
      expect(result).toBe("Transaction failed: Some error");
    });

    it("should format object errors as JSON", () => {
      const error = { code: 123, message: "Insufficient funds" };
      const result = formatTransactionError(error);
      expect(result).toBe(
        'Transaction failed: {"code":123,"message":"Insufficient funds"}',
      );
    });

    it("should handle BigInt in error objects", () => {
      const error = { amount: BigInt("1000000000000000000") };
      const result = formatTransactionError(error);
      expect(result).toBe(
        'Transaction failed: {"amount":"1000000000000000000"}',
      );
    });

    it("should handle null errors", () => {
      const result = formatTransactionError(null);
      expect(result).toBe("Transaction failed: null");
    });

    it("should handle undefined errors", () => {
      const result = formatTransactionError(undefined);
      expect(result).toBe("Transaction failed: undefined");
    });

    it("should handle circular reference errors gracefully", () => {
      const circular: any = { a: 1 };
      circular.self = circular;
      const result = formatTransactionError(circular);
      expect(result).toBe("Transaction failed: Unknown error");
    });
  });

  describe("determineRpcProvider", () => {
    it("should detect Triton RPC", () => {
      expect(determineRpcProvider("https://solana-mainnet.rpcpool.com")).toBe(
        "triton",
      );
      expect(determineRpcProvider("https://api.triton.one/rpc")).toBe("triton");
    });

    it("should detect Helius RPC", () => {
      expect(
        determineRpcProvider("https://mainnet.helius-rpc.com/?api-key=xxx"),
      ).toBe("helius");
      expect(determineRpcProvider("https://rpc.helius.xyz")).toBe("helius");
    });

    it("should detect Ankr RPC", () => {
      expect(determineRpcProvider("https://rpc.ankr.com/solana/xxx")).toBe(
        "ankr",
      );
    });

    it("should return unknown for other providers", () => {
      expect(determineRpcProvider("https://api.mainnet-beta.solana.com")).toBe(
        "unknown",
      );
      expect(determineRpcProvider("https://api.devnet.solana.com")).toBe(
        "unknown",
      );
      expect(determineRpcProvider("https://custom-rpc.example.com")).toBe(
        "unknown",
      );
    });

    it("should return unknown for invalid URLs", () => {
      expect(determineRpcProvider("not-a-url")).toBe("unknown");
      expect(determineRpcProvider("")).toBe("unknown");
    });
  });

  describe("sleep", () => {
    it("should resolve after specified timeout", async () => {
      vi.useFakeTimers();

      const sleepPromise = sleep(1000);
      vi.advanceTimersByTime(1000);
      await expect(sleepPromise).resolves.toBeUndefined();

      vi.useRealTimers();
    });

    it("should not resolve before timeout", async () => {
      vi.useFakeTimers();

      let resolved = false;
      sleep(1000).then(() => {
        resolved = true;
      });

      await vi.advanceTimersByTimeAsync(500);
      expect(resolved).toBe(false);

      await vi.advanceTimersByTimeAsync(500);
      expect(resolved).toBe(true);

      vi.useRealTimers();
    });
  });

  describe("isEmptyObject", () => {
    it("should return true for null", () => {
      expect(isEmptyObject(null)).toBe(true);
    });

    it("should return true for undefined", () => {
      expect(isEmptyObject(undefined)).toBe(true);
    });

    it("should return true for empty object", () => {
      expect(isEmptyObject({})).toBe(true);
    });

    it("should return false for object with properties", () => {
      expect(isEmptyObject({ a: 1 })).toBe(false);
    });

    it("should return false for object with nested properties", () => {
      expect(isEmptyObject({ nested: { value: true } })).toBe(false);
    });

    it("should return true for object with only inherited properties", () => {
      const proto = { inherited: true };
      const obj = Object.create(proto);
      expect(isEmptyObject(obj)).toBe(true);
    });
  });

  describe("PriorityFeeConfig type", () => {
    it("should accept valid configuration", () => {
      const config: PriorityFeeConfig = {
        percentile: 0.9,
        percentileMultiple: 1.5,
        min: 100_000,
        max: 100_000_000,
      };

      expect(config.percentile).toBe(0.9);
      expect(config.percentileMultiple).toBe(1.5);
      expect(config.min).toBe(100_000);
      expect(config.max).toBe(100_000_000);
    });

    it("should allow partial configuration", () => {
      const config: PriorityFeeConfig = {
        min: 50_000,
      };

      expect(config.min).toBe(50_000);
      expect(config.max).toBeUndefined();
    });

    it("should allow empty configuration", () => {
      const config: PriorityFeeConfig = {};

      expect(config.percentile).toBeUndefined();
      expect(config.percentileMultiple).toBeUndefined();
      expect(config.min).toBeUndefined();
      expect(config.max).toBeUndefined();
    });
  });
});
