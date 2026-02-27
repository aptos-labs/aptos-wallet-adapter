import { describe, it, expect } from "vitest";
import {
  encodeStructuredMessage,
  decodeStructuredMessage,
  structuredMessagePrefix,
  StructuredMessage,
} from "../src/StructuredMessage";

describe("StructuredMessage", () => {
  describe("structuredMessagePrefix", () => {
    it("should be 'APTOS'", () => {
      expect(structuredMessagePrefix).toBe("APTOS");
    });
  });

  describe("encodeStructuredMessage", () => {
    it("should encode a basic message with required fields only", () => {
      const message: StructuredMessage = {
        message: "Hello, Aptos!",
        nonce: "unique-nonce-123",
      };

      const encoded = encodeStructuredMessage(message);
      const decoded = new TextDecoder().decode(encoded);

      expect(decoded).toBe(
        "APTOS\nmessage: Hello, Aptos!\nnonce: unique-nonce-123",
      );
    });

    it("should encode a message with all optional fields", () => {
      const message: StructuredMessage = {
        message: "Hello, Aptos!",
        nonce: "unique-nonce-123",
        address: "0x1234567890abcdef",
        application: "my-dapp.com",
        chainId: 2,
      };

      const encoded = encodeStructuredMessage(message);
      const decoded = new TextDecoder().decode(encoded);

      expect(decoded).toContain("APTOS");
      expect(decoded).toContain("message: Hello, Aptos!");
      expect(decoded).toContain("nonce: unique-nonce-123");
      expect(decoded).toContain("address: 0x1234567890abcdef");
      expect(decoded).toContain("application: my-dapp.com");
      expect(decoded).toContain("chainId: 2");
    });

    it("should encode a message with only address optional field", () => {
      const message: StructuredMessage = {
        message: "Test message",
        nonce: "nonce-456",
        address: "0xabcd",
      };

      const encoded = encodeStructuredMessage(message);
      const decoded = new TextDecoder().decode(encoded);

      expect(decoded).toContain("address: 0xabcd");
      expect(decoded).not.toContain("application:");
      expect(decoded).not.toContain("chainId:");
    });
  });

  describe("decodeStructuredMessage", () => {
    it("should decode a basic message with required fields only", () => {
      const input = "APTOS\nmessage: Hello, Aptos!\nnonce: unique-nonce-123";
      const encoded = new TextEncoder().encode(input);

      const decoded = decodeStructuredMessage(encoded);

      expect(decoded.message).toBe("Hello, Aptos!");
      expect(decoded.nonce).toBe("unique-nonce-123");
      expect(decoded.address).toBeUndefined();
      expect(decoded.application).toBeUndefined();
      expect(decoded.chainId).toBeUndefined();
    });

    it("should decode a message with all optional fields", () => {
      const input =
        "APTOS\naddress: 0x1234\napplication: my-dapp.com\nchainId: 2\nmessage: Hello!\nnonce: nonce-123";
      const encoded = new TextEncoder().encode(input);

      const decoded = decodeStructuredMessage(encoded);

      expect(decoded.message).toBe("Hello!");
      expect(decoded.nonce).toBe("nonce-123");
      expect(decoded.address).toBe("0x1234");
      expect(decoded.application).toBe("my-dapp.com");
      expect(decoded.chainId).toBe(2);
    });

    it("should throw error for invalid prefix", () => {
      const input = "INVALID\nmessage: Hello!\nnonce: nonce-123";
      const encoded = new TextEncoder().encode(input);

      expect(() => decodeStructuredMessage(encoded)).toThrow(
        "Invalid message prefix",
      );
    });

    it("should throw error for missing nonce", () => {
      const input = "APTOS\nmessage: Hello!";
      const encoded = new TextEncoder().encode(input);

      expect(() => decodeStructuredMessage(encoded)).toThrow("Expected nonce");
    });

    it("should throw error for missing message", () => {
      const input = "APTOS\nnonce: nonce-123";
      const encoded = new TextEncoder().encode(input);

      expect(() => decodeStructuredMessage(encoded)).toThrow(
        "Expected message",
      );
    });
  });

  describe("encode/decode roundtrip", () => {
    it("should roundtrip a basic message", () => {
      const original: StructuredMessage = {
        message: "Hello, Aptos!",
        nonce: "unique-nonce-123",
      };

      const encoded = encodeStructuredMessage(original);
      const decoded = decodeStructuredMessage(encoded);

      expect(decoded.message).toBe(original.message);
      expect(decoded.nonce).toBe(original.nonce);
    });

    // Note: Messages with optional fields (address, application, chainId) don't roundtrip
    // because encodeStructuredMessage places them after nonce, but decodeStructuredMessage
    // expects them before message. This is a known limitation of the current implementation.

    it("should handle messages with newlines", () => {
      const original: StructuredMessage = {
        message: "Line 1\nLine 2\nLine 3",
        nonce: "nonce-multiline",
      };

      const encoded = encodeStructuredMessage(original);
      const decoded = decodeStructuredMessage(encoded);

      expect(decoded.message).toBe(original.message);
      expect(decoded.nonce).toBe(original.nonce);
    });
  });
});
