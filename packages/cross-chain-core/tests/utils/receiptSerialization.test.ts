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

    it("should serialize UniversalAddress values", () => {
      const addressBytes = new Uint8Array(32).fill(0xab);
      const receipt = {
        from: "Aptos",
        sender: new UniversalAddress(addressBytes),
      } as any;

      const serialized = serializeReceipt(receipt) as any;

      expect(serialized.sender.__type).toBe("UniversalAddress");
      expect(typeof serialized.sender.value).toBe("string");
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
    // Cross-platform base64 helper (matches implementation, avoids Node.js Buffer)
    function toBase64(bytes: Uint8Array): string {
      let binary = "";
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }

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

    it("should deserialize __type UniversalAddress markers", () => {
      const addressBytes = new Uint8Array(32).fill(0xab);
      const base64Address = toBase64(addressBytes);
      const serialized = {
        from: "Aptos",
        sender: { __type: "UniversalAddress", value: base64Address },
        customField: { __type: "UniversalAddress", value: base64Address },
      };

      const deserialized = deserializeReceipt(serialized) as any;

      expect(deserialized.sender).toBeInstanceOf(UniversalAddress);
      expect(deserialized.sender.toUint8Array()).toEqual(addressBytes);
      // Works for any field name, not just known address fields
      expect(deserialized.customField).toBeInstanceOf(UniversalAddress);
      expect(deserialized.customField.toUint8Array()).toEqual(addressBytes);
    });

    it("should reconstruct UniversalAddress for address fields (backwards compat)", () => {
      const addressBytes = new Uint8Array(32).fill(0xab);
      const base64Address = toBase64(addressBytes);
      // Old format: no __type marker, relies on field-name heuristic
      const serialized = {
        from: "Aptos",
        sender: {
          address: { __type: "Uint8Array", value: base64Address },
        },
        recipient: {
          address: { __type: "Uint8Array", value: base64Address },
        },
      };

      const deserialized = deserializeReceipt(serialized) as any;

      expect(deserialized.sender).toBeInstanceOf(UniversalAddress);
      expect(deserialized.recipient).toBeInstanceOf(UniversalAddress);
    });

    it("should handle all CCTP address fields", () => {
      const addressBytes = new Uint8Array(32).fill(0xcd);
      const base64Address = toBase64(addressBytes);
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
          address: { __type: "Uint8Array", value: base64Address },
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

    it("should serialize and deserialize UniversalAddress correctly", () => {
      const addressBytes = new Uint8Array(32);
      addressBytes.fill(0xab);
      const original = {
        from: "Aptos",
        to: "Solana",
        sender: new UniversalAddress(addressBytes),
      } as any;

      const serialized = serializeReceipt(original);
      const deserialized = deserializeReceipt(serialized) as any;

      expect(deserialized.sender).toBeInstanceOf(UniversalAddress);
      expect(deserialized.sender.toUint8Array()).toEqual(addressBytes);
    });

    it("should roundtrip UniversalAddress at non-standard field names", () => {
      const addressBytes = new Uint8Array(32);
      addressBytes.fill(0xef);
      const original = {
        from: "Aptos",
        customAddress: new UniversalAddress(addressBytes),
      } as any;

      const serialized = serializeReceipt(original);
      const deserialized = deserializeReceipt(serialized) as any;

      // UniversalAddress at a non-standard key should still survive roundtrip
      // thanks to the explicit __type marker
      expect(deserialized.customAddress).toBeInstanceOf(UniversalAddress);
      expect(deserialized.customAddress.toUint8Array()).toEqual(addressBytes);
    });

    it("should roundtrip multiple UniversalAddress fields in CCTP-like structure", () => {
      const senderBytes = new Uint8Array(32).fill(0x01);
      const recipientBytes = new Uint8Array(32).fill(0x02);
      const burnTokenBytes = new Uint8Array(32).fill(0x03);

      const original = {
        from: "Aptos",
        to: "Solana",
        state: "Attested",
        attestation: {
          message: {
            sender: new UniversalAddress(senderBytes),
            recipient: new UniversalAddress(recipientBytes),
            burnToken: new UniversalAddress(burnTokenBytes),
            amount: BigInt("1000000"),
            nonce: BigInt("42"),
          },
        },
      } as any;

      const serialized = serializeReceipt(original);
      const deserialized = deserializeReceipt(serialized) as any;

      const msg = deserialized.attestation.message;
      expect(msg.sender).toBeInstanceOf(UniversalAddress);
      expect(msg.sender.toUint8Array()).toEqual(senderBytes);
      expect(msg.recipient).toBeInstanceOf(UniversalAddress);
      expect(msg.recipient.toUint8Array()).toEqual(recipientBytes);
      expect(msg.burnToken).toBeInstanceOf(UniversalAddress);
      expect(msg.burnToken.toUint8Array()).toEqual(burnTokenBytes);
      expect(msg.amount).toBe(BigInt("1000000"));
      expect(msg.nonce).toBe(BigInt("42"));
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

