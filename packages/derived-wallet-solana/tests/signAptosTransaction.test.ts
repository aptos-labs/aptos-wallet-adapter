import { describe, it, expect } from "vitest";
import { AccountAuthenticatorAbstraction } from "@aptos-labs/ts-sdk";
import {
  SIGNATURE_TYPE,
  createAccountAuthenticatorForSolanaTransaction,
} from "../src/signAptosTransaction";
import { defaultSolanaAuthenticationFunction } from "../src/shared";
import { TEST_SOLANA_PUBLIC_KEY } from "./mocks/solanaWallet";

describe("signAptosTransaction", () => {
  const testDomain = "test.example.com";

  // Test Ed25519 signature (64 bytes)
  const testSignature = new Uint8Array(64).fill(0xab);

  // Test signing message digest (32 bytes)
  const testSigningMessageDigest = new Uint8Array(32).fill(0xcd);

  describe("SIGNATURE_TYPE", () => {
    it("should be 0", () => {
      expect(SIGNATURE_TYPE).toBe(0);
    });
  });

  describe("createAccountAuthenticatorForSolanaTransaction", () => {
    it("should create AccountAuthenticatorAbstraction", () => {
      const authenticator = createAccountAuthenticatorForSolanaTransaction(
        testSignature,
        TEST_SOLANA_PUBLIC_KEY,
        testDomain,
        defaultSolanaAuthenticationFunction,
        testSigningMessageDigest,
      );

      expect(authenticator).toBeInstanceOf(AccountAuthenticatorAbstraction);
    });

    it("should produce serializable authenticator", () => {
      const authenticator = createAccountAuthenticatorForSolanaTransaction(
        testSignature,
        TEST_SOLANA_PUBLIC_KEY,
        testDomain,
        defaultSolanaAuthenticationFunction,
        testSigningMessageDigest,
      );

      // Should be serializable to bytes
      const bytes = authenticator.bcsToBytes();
      expect(bytes).toBeInstanceOf(Uint8Array);
      expect(bytes.length).toBeGreaterThan(0);
    });

    it("should work with different domains", () => {
      const auth1 = createAccountAuthenticatorForSolanaTransaction(
        testSignature,
        TEST_SOLANA_PUBLIC_KEY,
        "domain1.com",
        defaultSolanaAuthenticationFunction,
        testSigningMessageDigest,
      );

      const auth2 = createAccountAuthenticatorForSolanaTransaction(
        testSignature,
        TEST_SOLANA_PUBLIC_KEY,
        "domain2.com",
        defaultSolanaAuthenticationFunction,
        testSigningMessageDigest,
      );

      // Both should be valid authenticators
      expect(auth1).toBeInstanceOf(AccountAuthenticatorAbstraction);
      expect(auth2).toBeInstanceOf(AccountAuthenticatorAbstraction);

      // Different domains should produce different bytes
      expect(auth1.bcsToBytes()).not.toEqual(auth2.bcsToBytes());
    });

    it("should work with different signatures", () => {
      const sig1 = new Uint8Array(64).fill(0x11);
      const sig2 = new Uint8Array(64).fill(0x22);

      const auth1 = createAccountAuthenticatorForSolanaTransaction(
        sig1,
        TEST_SOLANA_PUBLIC_KEY,
        testDomain,
        defaultSolanaAuthenticationFunction,
        testSigningMessageDigest,
      );

      const auth2 = createAccountAuthenticatorForSolanaTransaction(
        sig2,
        TEST_SOLANA_PUBLIC_KEY,
        testDomain,
        defaultSolanaAuthenticationFunction,
        testSigningMessageDigest,
      );

      // Different signatures should produce different bytes
      expect(auth1.bcsToBytes()).not.toEqual(auth2.bcsToBytes());
    });

    it("should work with custom authentication function", () => {
      const customAuthFunction = "0x1::custom::authenticate";

      const authenticator = createAccountAuthenticatorForSolanaTransaction(
        testSignature,
        TEST_SOLANA_PUBLIC_KEY,
        testDomain,
        customAuthFunction,
        testSigningMessageDigest,
      );

      expect(authenticator).toBeInstanceOf(AccountAuthenticatorAbstraction);
    });
  });

  // Note: createMessageForSolanaTransaction and signAptosTransactionWithSolana
  // tests require network access to build transactions.
  // These are tested via integration tests.
});
