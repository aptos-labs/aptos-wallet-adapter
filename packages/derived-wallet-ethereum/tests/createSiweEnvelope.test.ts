import { describe, it, expect } from "vitest";
import { Hex } from "@aptos-labs/ts-sdk";
import { StructuredMessage } from "@aptos-labs/derived-wallet-base";
import {
  createSiweEnvelopeForAptosStructuredMessage,
} from "../src/createSiweEnvelope";
import type { EthereumAddress } from "../src/shared";

describe("createSiweEnvelope", () => {
  const testEthereumAddress: EthereumAddress =
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const testChainId = 1;
  const testIssuedAt = new Date("2024-01-15T12:00:00.000Z");
  const testDomain = "test.example.com";
  const testUri = "https://test.example.com";

  // Create a test signing message digest (32 bytes)
  const testDigest = new Uint8Array(32).fill(0xab);

  describe("createSiweEnvelopeForAptosStructuredMessage", () => {
    it("should create SIWE message for structured message", () => {
      const structuredMessage: StructuredMessage = {
        message: "Hello, Aptos!",
        nonce: "12345678",
      };

      const siweMessage = createSiweEnvelopeForAptosStructuredMessage({
        ethereumAddress: testEthereumAddress,
        chainId: testChainId,
        signingMessageDigest: testDigest,
        issuedAt: testIssuedAt,
        domain: testDomain,
        uri: testUri,
        structuredMessage,
      });

      expect(typeof siweMessage).toBe("string");
      expect(siweMessage.length).toBeGreaterThan(0);
    });

    it("should include ethereum address in message", () => {
      const structuredMessage: StructuredMessage = {
        message: "Test message",
        nonce: "nonce123",
      };

      const siweMessage = createSiweEnvelopeForAptosStructuredMessage({
        ethereumAddress: testEthereumAddress,
        chainId: testChainId,
        signingMessageDigest: testDigest,
        issuedAt: testIssuedAt,
        domain: testDomain,
        uri: testUri,
        structuredMessage,
      });

      expect(siweMessage).toContain(testEthereumAddress);
    });

    it("should include domain in message", () => {
      const structuredMessage: StructuredMessage = {
        message: "Test message",
        nonce: "nonce123",
      };

      const siweMessage = createSiweEnvelopeForAptosStructuredMessage({
        ethereumAddress: testEthereumAddress,
        chainId: testChainId,
        signingMessageDigest: testDigest,
        issuedAt: testIssuedAt,
        domain: testDomain,
        uri: testUri,
        structuredMessage,
      });

      expect(siweMessage).toContain(testDomain);
    });

    it("should include structured message content in statement", () => {
      const structuredMessage: StructuredMessage = {
        message: "Sign this specific message",
        nonce: "unique-nonce",
      };

      const siweMessage = createSiweEnvelopeForAptosStructuredMessage({
        ethereumAddress: testEthereumAddress,
        chainId: testChainId,
        signingMessageDigest: testDigest,
        issuedAt: testIssuedAt,
        domain: testDomain,
        uri: testUri,
        structuredMessage,
      });

      // The structured message content should be part of the SIWE statement
      expect(siweMessage).toContain("Sign this specific message");
    });

    it("should include nonce as hex digest", () => {
      const structuredMessage: StructuredMessage = {
        message: "Test",
        nonce: "test-nonce",
      };

      const siweMessage = createSiweEnvelopeForAptosStructuredMessage({
        ethereumAddress: testEthereumAddress,
        chainId: testChainId,
        signingMessageDigest: testDigest,
        issuedAt: testIssuedAt,
        domain: testDomain,
        uri: testUri,
        structuredMessage,
      });

      // The nonce in SIWE should be the hex digest
      const digestHex = Hex.fromHexInput(testDigest).toString();
      expect(siweMessage).toContain(digestHex);
    });

    it("should handle structured message with all optional fields", () => {
      const structuredMessage: StructuredMessage = {
        message: "Full message",
        nonce: "full-nonce",
        address: "0x1234567890abcdef1234567890abcdef12345678",
        application: "https://myapp.com",
        chainId: 2,
      };

      const siweMessage = createSiweEnvelopeForAptosStructuredMessage({
        ethereumAddress: testEthereumAddress,
        chainId: testChainId,
        signingMessageDigest: testDigest,
        issuedAt: testIssuedAt,
        domain: testDomain,
        uri: testUri,
        structuredMessage,
      });

      expect(typeof siweMessage).toBe("string");
      expect(siweMessage.length).toBeGreaterThan(0);
    });

    it("should use window.location defaults when domain/uri not provided", () => {
      const structuredMessage: StructuredMessage = {
        message: "Test",
        nonce: "nonce",
      };

      // This will use window.location from setup.ts
      const siweMessage = createSiweEnvelopeForAptosStructuredMessage({
        ethereumAddress: testEthereumAddress,
        chainId: testChainId,
        signingMessageDigest: testDigest,
        issuedAt: testIssuedAt,
        structuredMessage,
      });

      // Should use the mocked window.location values
      expect(siweMessage).toContain("test.example.com");
    });
  });

  // Note: createSiweEnvelopeForAptosTransaction tests require network access
  // to build transactions. These are tested via integration tests.
});

