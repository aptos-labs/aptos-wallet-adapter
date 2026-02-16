import { describe, it, expect } from "vitest";
import { UniversalAddress } from "@wormhole-foundation/sdk";
import {
  serializeReceipt,
  deserializeReceipt,
} from "../../src/utils/receiptSerialization";

describe("receiptSerialization", () => {
  describe("serializeReceipt", () => {
    it("should serialize BigInt values", () => {
      const receipt = {
        from: "Aptos",
        to: "Solana",
        state: "Attested",
        attestation: {
          amount: BigInt("1000000"),
          nonce: BigInt("12345"),
        },
      } as any;

      const serialized = serializeReceipt(receipt);

      expect(serialized).toEqual({
        from: "Aptos",
        to: "Solana",
        state: "Attested",
        attestation: {
          amount: { __type: "bigint", value: "1000000" },
          nonce: { __type: "bigint", value: "12345" },
        },
      });
    });

    it("should serialize Uint8Array values", () => {
      const receipt = {
        from: "Aptos",
        to: "Solana",
        data: new Uint8Array([1, 2, 3, 4, 5]),
      } as any;

      const serialized = serializeReceipt(receipt);

      expect(serialized).toEqual({
        from: "Aptos",
        to: "Solana",
        data: { __type: "Uint8Array", value: "AQIDBAU=" },
      });
    });

    it("should handle nested objects", () => {
      const receipt = {
        from: "Aptos",
        nested: {
          deeply: {
            value: BigInt("999"),
          },
        },
      } as any;

      const serialized = serializeReceipt(receipt);

      expect(serialized).toEqual({
        from: "Aptos",
        nested: {
          deeply: {
            value: { __type: "bigint", value: "999" },
          },
        },
      });
    });

    it("should handle arrays", () => {
      const receipt = {
        values: [BigInt("1"), BigInt("2"), BigInt("3")],
      } as any;

      const serialized = serializeReceipt(receipt);

      expect(serialized).toEqual({
        values: [
          { __type: "bigint", value: "1" },
          { __type: "bigint", value: "2" },
          { __type: "bigint", value: "3" },
        ],
      });
    });

    it("should preserve primitive values", () => {
      const receipt = {
        from: "Aptos",
        to: "Solana",
        count: 42,
        active: true,
        data: null,
      } as any;

      const serialized = serializeReceipt(receipt);

      expect(serialized).toEqual({
        from: "Aptos",
        to: "Solana",
        count: 42,
        active: true,
        data: null,
      });
    });
  });

  describe("deserializeReceipt", () => {
    it("should deserialize BigInt values", () => {
      const serialized = {
        from: "Aptos",
        to: "Solana",
        attestation: {
          amount: { __type: "bigint", value: "1000000" },
          nonce: { __type: "bigint", value: "12345" },
        },
      };

      const deserialized = deserializeReceipt(serialized);

      expect(deserialized).toEqual({
        from: "Aptos",
        to: "Solana",
        attestation: {
          amount: BigInt("1000000"),
          nonce: BigInt("12345"),
        },
      });
    });

    it("should deserialize Uint8Array values", () => {
      const serialized = {
        from: "Aptos",
        to: "Solana",
        data: { __type: "Uint8Array", value: "AQIDBAU=" },
      };

      const deserialized = deserializeReceipt(serialized);

      expect(deserialized).toEqual({
        from: "Aptos",
        to: "Solana",
        data: new Uint8Array([1, 2, 3, 4, 5]),
      });
    });

    it("should reconstruct UniversalAddress for address fields", () => {
      const addressBytes = new Uint8Array(32).fill(0xab);
      const serialized = {
        from: "Aptos",
        sender: {
          address: { __type: "Uint8Array", value: Buffer.from(addressBytes).toString("base64") },
        },
        recipient: {
          address: { __type: "Uint8Array", value: Buffer.from(addressBytes).toString("base64") },
        },
      };

      const deserialized = deserializeReceipt(serialized) as any;

      expect(deserialized.sender).toBeInstanceOf(UniversalAddress);
      expect(deserialized.recipient).toBeInstanceOf(UniversalAddress);
    });

    it("should handle all CCTP address fields", () => {
      const addressBytes = new Uint8Array(32).fill(0xcd);
      const addressFields = [
        "sender",
        "recipient",
        "destinationCaller",
        "burnToken",
        "mintRecipient",
        "messageSender",
      ];

      const serialized: Record<string, any> = { from: "Aptos" };
      for (const field of addressFields) {
        serialized[field] = {
          address: { __type: "Uint8Array", value: Buffer.from(addressBytes).toString("base64") },
        };
      }

      const deserialized = deserializeReceipt(serialized) as any;

      for (const field of addressFields) {
        expect(deserialized[field]).toBeInstanceOf(UniversalAddress);
      }
    });

    it("should handle nested objects", () => {
      const serialized = {
        from: "Aptos",
        nested: {
          deeply: {
            value: { __type: "bigint", value: "999" },
          },
        },
      };

      const deserialized = deserializeReceipt(serialized);

      expect(deserialized).toEqual({
        from: "Aptos",
        nested: {
          deeply: {
            value: BigInt("999"),
          },
        },
      });
    });

    it("should handle arrays", () => {
      const serialized = {
        values: [
          { __type: "bigint", value: "1" },
          { __type: "bigint", value: "2" },
          { __type: "bigint", value: "3" },
        ],
      };

      const deserialized = deserializeReceipt(serialized);

      expect(deserialized).toEqual({
        values: [BigInt("1"), BigInt("2"), BigInt("3")],
      });
    });

    it("should preserve primitive values", () => {
      const serialized = {
        from: "Aptos",
        to: "Solana",
        count: 42,
        active: true,
      };

      const deserialized = deserializeReceipt(serialized);

      expect(deserialized).toEqual({
        from: "Aptos",
        to: "Solana",
        count: 42,
        active: true,
      });
    });
  });

  describe("roundtrip", () => {
    it("should serialize and deserialize BigInt correctly", () => {
      const original = {
        from: "Aptos",
        to: "Solana",
        amount: BigInt("123456789012345678901234567890"),
      } as any;

      const serialized = serializeReceipt(original);
      const deserialized = deserializeReceipt(serialized);

      expect(deserialized).toEqual(original);
    });

    it("should serialize and deserialize Uint8Array correctly", () => {
      const original = {
        from: "Aptos",
        to: "Solana",
        data: new Uint8Array([0, 127, 255, 1, 2, 3]),
      } as any;

      const serialized = serializeReceipt(original);
      const deserialized = deserializeReceipt(serialized);

      expect(deserialized).toEqual(original);
    });

    it("should handle complex nested structures", () => {
      const original = {
        from: "Aptos",
        to: "Solana",
        state: "Attested",
        attestation: {
          message: {
            amount: BigInt("1000000"),
            nonce: BigInt("42"),
            data: new Uint8Array([1, 2, 3]),
          },
          signatures: [
            { data: new Uint8Array([4, 5, 6]) },
            { data: new Uint8Array([7, 8, 9]) },
          ],
        },
      } as any;

      const serialized = serializeReceipt(original);
      const deserialized = deserializeReceipt(serialized);

      expect(deserialized).toEqual(original);
    });
  });
});

