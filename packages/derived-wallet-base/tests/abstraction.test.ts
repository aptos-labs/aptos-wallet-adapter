import { describe, it, expect } from "vitest";
import { Deserializer, Serializer } from "@aptos-labs/ts-sdk";
import {
  ADDRESS_DOMAIN_SEPARATOR,
  computeDerivableAuthenticationKey,
  DerivableAbstractPublicKey,
} from "../src/abstraction";

describe("abstraction", () => {
  describe("ADDRESS_DOMAIN_SEPARATOR", () => {
    it("should be 5", () => {
      expect(ADDRESS_DOMAIN_SEPARATOR).toBe(5);
    });
  });

  describe("DerivableAbstractPublicKey", () => {
    it("should store identity and domain", () => {
      const pubKey = new DerivableAbstractPublicKey(
        "0x1234567890abcdef",
        "my-dapp.com",
      );

      expect(pubKey.identity).toBe("0x1234567890abcdef");
      expect(pubKey.domain).toBe("my-dapp.com");
    });

    it("should serialize correctly", () => {
      const pubKey = new DerivableAbstractPublicKey(
        "identity123",
        "domain.com",
      );
      const serializer = new Serializer();
      pubKey.serialize(serializer);

      const bytes = serializer.toUint8Array();
      expect(bytes.length).toBeGreaterThan(0);
    });

    it("should serialize and deserialize roundtrip", () => {
      const original = new DerivableAbstractPublicKey(
        "0xdeadbeef1234",
        "test-app.example.com",
      );

      // Serialize
      const serializer = new Serializer();
      original.serialize(serializer);
      const bytes = serializer.toUint8Array();

      // Deserialize
      const deserializer = new Deserializer(bytes);
      const deserialized = DerivableAbstractPublicKey.deserialize(deserializer);

      expect(deserialized.identity).toBe(original.identity);
      expect(deserialized.domain).toBe(original.domain);
    });

    it("should handle empty identity", () => {
      const pubKey = new DerivableAbstractPublicKey("", "domain.com");

      const serializer = new Serializer();
      pubKey.serialize(serializer);
      const bytes = serializer.toUint8Array();

      const deserializer = new Deserializer(bytes);
      const deserialized = DerivableAbstractPublicKey.deserialize(deserializer);

      expect(deserialized.identity).toBe("");
      expect(deserialized.domain).toBe("domain.com");
    });

    it("should handle empty domain", () => {
      const pubKey = new DerivableAbstractPublicKey("identity", "");

      const serializer = new Serializer();
      pubKey.serialize(serializer);
      const bytes = serializer.toUint8Array();

      const deserializer = new Deserializer(bytes);
      const deserialized = DerivableAbstractPublicKey.deserialize(deserializer);

      expect(deserialized.identity).toBe("identity");
      expect(deserialized.domain).toBe("");
    });

    it("should handle special characters in identity and domain", () => {
      const pubKey = new DerivableAbstractPublicKey(
        "id-with-special!@#$%",
        "sub.domain-name.com:8080",
      );

      const serializer = new Serializer();
      pubKey.serialize(serializer);
      const bytes = serializer.toUint8Array();

      const deserializer = new Deserializer(bytes);
      const deserialized = DerivableAbstractPublicKey.deserialize(deserializer);

      expect(deserialized.identity).toBe("id-with-special!@#$%");
      expect(deserialized.domain).toBe("sub.domain-name.com:8080");
    });
  });

  describe("computeDerivableAuthenticationKey", () => {
    const validFunctionInfo = "0x1::ethereum_derivable_account::authenticate";

    it("should compute authentication key for valid inputs", () => {
      const authKey = computeDerivableAuthenticationKey(
        validFunctionInfo,
        "0x1234567890abcdef",
        "my-dapp.com",
      );

      expect(authKey).toBeDefined();
      const address = authKey.derivedAddress();
      expect(address.toString()).toBe(
        "0x096a4657c816a456e00d99e4f6e34e61fad376ae77d216586b92a1503d32f15d",
      );
    });

    it("should produce consistent results for same inputs", () => {
      const authKey1 = computeDerivableAuthenticationKey(
        validFunctionInfo,
        "identity123",
        "domain.com",
      );

      const authKey2 = computeDerivableAuthenticationKey(
        validFunctionInfo,
        "identity123",
        "domain.com",
      );

      expect(authKey1.data).toEqual(authKey2.data);
    });

    it("should produce different results for different identities", () => {
      const authKey1 = computeDerivableAuthenticationKey(
        validFunctionInfo,
        "identity1",
        "domain.com",
      );

      const authKey2 = computeDerivableAuthenticationKey(
        validFunctionInfo,
        "identity2",
        "domain.com",
      );

      expect(authKey1.data).not.toEqual(authKey2.data);
    });

    it("should produce different results for different domains", () => {
      const authKey1 = computeDerivableAuthenticationKey(
        validFunctionInfo,
        "identity",
        "domain1.com",
      );

      const authKey2 = computeDerivableAuthenticationKey(
        validFunctionInfo,
        "identity",
        "domain2.com",
      );

      expect(authKey1.data).not.toEqual(authKey2.data);
    });

    it("should produce different results for different function info", () => {
      const authKey1 = computeDerivableAuthenticationKey(
        "0x1::ethereum_derivable_account::authenticate",
        "identity",
        "domain.com",
      );

      const authKey2 = computeDerivableAuthenticationKey(
        "0x1::solana_derivable_account::authenticate",
        "identity",
        "domain.com",
      );

      expect(authKey1.data).not.toEqual(authKey2.data);
    });

    it("should throw for invalid function info format", () => {
      expect(() =>
        computeDerivableAuthenticationKey(
          "invalid-function-format",
          "identity",
          "domain.com",
        ),
      ).toThrow();
    });

    it("should throw for function info with invalid module address", () => {
      expect(() =>
        computeDerivableAuthenticationKey(
          "not-an-address::module::function",
          "identity",
          "domain.com",
        ),
      ).toThrow();
    });

    it("should derive an address from the authentication key", () => {
      const authKey = computeDerivableAuthenticationKey(
        validFunctionInfo,
        "0xdeadbeef",
        "test.com",
      );

      const address = authKey.derivedAddress();
      expect(address.toString()).toBe(
        "0x1234489429e47e6269c5890e81f33b7f130b528027a776bea1b7d024b47f153a",
      );
    });
  });
});
