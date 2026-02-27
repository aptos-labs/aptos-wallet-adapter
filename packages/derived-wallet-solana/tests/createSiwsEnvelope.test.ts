import { describe, it, expect } from "vitest";
import { Hex } from "@aptos-labs/ts-sdk";
import { StructuredMessage } from "@aptos-labs/derived-wallet-base";
import {
  createSiwsEnvelope,
  createSiwsEnvelopeForAptosStructuredMessage,
} from "../src/createSiwsEnvelope";
import { TEST_SOLANA_PUBLIC_KEY } from "./mocks/solanaWallet";

describe("createSiwsEnvelope", () => {
  const testDomain = "test.example.com";

  // Create a test signing message digest (32 bytes)
  const testDigest = new Uint8Array(32).fill(0xab);

  describe("createSiwsEnvelope", () => {
    it("should create SIWS envelope with required fields", () => {
      const envelope = createSiwsEnvelope({
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        signingMessageDigest: testDigest,
        domain: testDomain,
        statement: "Sign this message",
      });

      expect(envelope).toHaveProperty("address");
      expect(envelope).toHaveProperty("domain");
      expect(envelope).toHaveProperty("nonce");
      expect(envelope).toHaveProperty("statement");
    });

    it("should include solana address in envelope", () => {
      const envelope = createSiwsEnvelope({
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        signingMessageDigest: testDigest,
        domain: testDomain,
        statement: "Test statement",
      });

      // Address should be the base58 representation of the solana public key
      expect(envelope.address).toBe(TEST_SOLANA_PUBLIC_KEY.toString());
    });

    it("should include domain in envelope", () => {
      const envelope = createSiwsEnvelope({
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        signingMessageDigest: testDigest,
        domain: testDomain,
        statement: "Test statement",
      });

      expect(envelope.domain).toBe(testDomain);
    });

    it("should include digest as hex nonce", () => {
      const envelope = createSiwsEnvelope({
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        signingMessageDigest: testDigest,
        domain: testDomain,
        statement: "Test statement",
      });

      const expectedHex = Hex.fromHexInput(testDigest).toString();
      expect(envelope.nonce).toBe(expectedHex);
    });

    it("should include statement in envelope", () => {
      const testStatement = "Please sign this transaction";
      const envelope = createSiwsEnvelope({
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        signingMessageDigest: testDigest,
        domain: testDomain,
        statement: testStatement,
      });

      expect(envelope.statement).toBe(testStatement);
    });
  });

  describe("createSiwsEnvelopeForAptosStructuredMessage", () => {
    it("should create SIWS envelope for structured message", () => {
      const structuredMessage: StructuredMessage = {
        message: "Hello, Aptos!",
        nonce: "12345678",
      };

      const envelope = createSiwsEnvelopeForAptosStructuredMessage({
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        signingMessageDigest: testDigest,
        domain: testDomain,
        structuredMessage,
      });

      expect(envelope).toHaveProperty("address");
      expect(envelope).toHaveProperty("domain");
      expect(envelope).toHaveProperty("nonce");
      expect(envelope).toHaveProperty("statement");
    });

    it("should include solana address", () => {
      const structuredMessage: StructuredMessage = {
        message: "Test message",
        nonce: "nonce123",
      };

      const envelope = createSiwsEnvelopeForAptosStructuredMessage({
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        signingMessageDigest: testDigest,
        domain: testDomain,
        structuredMessage,
      });

      expect(envelope.address).toBe(TEST_SOLANA_PUBLIC_KEY.toString());
    });

    it("should include domain", () => {
      const structuredMessage: StructuredMessage = {
        message: "Test message",
        nonce: "nonce123",
      };

      const envelope = createSiwsEnvelopeForAptosStructuredMessage({
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        signingMessageDigest: testDigest,
        domain: testDomain,
        structuredMessage,
      });

      expect(envelope.domain).toBe(testDomain);
    });

    it("should include message content in statement", () => {
      const structuredMessage: StructuredMessage = {
        message: "Sign this specific message",
        nonce: "unique-nonce",
      };

      const envelope = createSiwsEnvelopeForAptosStructuredMessage({
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        signingMessageDigest: testDigest,
        domain: testDomain,
        structuredMessage,
      });

      // The statement should contain the message
      expect(envelope.statement).toContain("Sign this specific message");
    });

    it("should handle structured message with all optional fields", () => {
      const structuredMessage: StructuredMessage = {
        message: "Full message",
        nonce: "full-nonce",
        address: "0x1234567890abcdef1234567890abcdef12345678",
        application: "https://myapp.com",
        chainId: 2,
      };

      const envelope = createSiwsEnvelopeForAptosStructuredMessage({
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        signingMessageDigest: testDigest,
        domain: testDomain,
        structuredMessage,
      });

      expect(envelope).toHaveProperty("address");
      expect(envelope).toHaveProperty("statement");
    });
  });

  // Note: createSiwsEnvelopeForAptosTransaction tests require network access
  // to build transactions. These are tested via integration tests.
});
