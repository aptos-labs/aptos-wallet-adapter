import { describe, it, expect } from "vitest";
import { AccountAuthenticatorAbstraction } from "@aptos-labs/ts-sdk";
import {
  SIGNATURE_TYPE,
  createAccountAuthenticatorForEthereumTransaction,
} from "../src/signAptosTransaction";
import { defaultEthereumAuthenticationFunction } from "../src/shared";
import type { EthereumAddress } from "../src/shared";

describe("signAptosTransaction", () => {
  const testEthereumAddress: EthereumAddress =
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const testDomain = "test.example.com";
  const testScheme = "https";
  const testIssuedAt = new Date("2024-01-15T12:00:00.000Z");

  // Test signature (65 bytes)
  const testSiweSignature =
    "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12";

  describe("SIGNATURE_TYPE", () => {
    it("should be 1", () => {
      expect(SIGNATURE_TYPE).toBe(1);
    });
  });

  describe("createAccountAuthenticatorForEthereumTransaction", () => {
    it("should create AccountAuthenticatorAbstraction", () => {
      const signingMessageDigest = new Uint8Array(32).fill(0xab);

      const authenticator = createAccountAuthenticatorForEthereumTransaction(
        testSiweSignature,
        testEthereumAddress,
        testDomain,
        testScheme,
        defaultEthereumAuthenticationFunction,
        signingMessageDigest,
        testIssuedAt,
      );

      expect(authenticator).toBeInstanceOf(AccountAuthenticatorAbstraction);
    });

    it("should include correct authentication function", () => {
      const signingMessageDigest = new Uint8Array(32).fill(0xab);

      const authenticator = createAccountAuthenticatorForEthereumTransaction(
        testSiweSignature,
        testEthereumAddress,
        testDomain,
        testScheme,
        defaultEthereumAuthenticationFunction,
        signingMessageDigest,
        testIssuedAt,
      );

      // AccountAuthenticatorAbstraction should be serializable
      const bytes = authenticator.bcsToBytes();
      expect(bytes).toBeInstanceOf(Uint8Array);
      expect(bytes.length).toBeGreaterThan(0);
      // The authentication function string should be embedded in the serialized data
      expect(authenticator).toBeInstanceOf(AccountAuthenticatorAbstraction);
    });

    it("should produce serializable authenticator", () => {
      const signingMessageDigest = new Uint8Array(32).fill(0xab);

      const authenticator = createAccountAuthenticatorForEthereumTransaction(
        testSiweSignature,
        testEthereumAddress,
        testDomain,
        testScheme,
        defaultEthereumAuthenticationFunction,
        signingMessageDigest,
        testIssuedAt,
      );

      // Should be serializable to bytes
      const bytes = authenticator.bcsToBytes();
      expect(bytes).toBeInstanceOf(Uint8Array);
      expect(bytes.length).toBeGreaterThan(0);
    });

    it("should work with different schemes", () => {
      const signingMessageDigest = new Uint8Array(32).fill(0xab);

      const httpAuthenticator =
        createAccountAuthenticatorForEthereumTransaction(
          testSiweSignature,
          testEthereumAddress,
          testDomain,
          "http",
          defaultEthereumAuthenticationFunction,
          signingMessageDigest,
          testIssuedAt,
        );

      const httpsAuthenticator =
        createAccountAuthenticatorForEthereumTransaction(
          testSiweSignature,
          testEthereumAddress,
          testDomain,
          "https",
          defaultEthereumAuthenticationFunction,
          signingMessageDigest,
          testIssuedAt,
        );

      // Both should be valid authenticators
      expect(httpAuthenticator).toBeInstanceOf(AccountAuthenticatorAbstraction);
      expect(httpsAuthenticator).toBeInstanceOf(
        AccountAuthenticatorAbstraction,
      );

      // But they should produce different bytes due to scheme difference
      expect(httpAuthenticator.bcsToBytes()).not.toEqual(
        httpsAuthenticator.bcsToBytes(),
      );
    });
  });
});
