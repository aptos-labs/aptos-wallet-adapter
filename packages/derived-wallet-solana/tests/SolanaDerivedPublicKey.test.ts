import { describe, it, expect } from "vitest";
import { Deserializer, Serializer } from "@aptos-labs/ts-sdk";
import { PublicKey as SolanaPublicKey } from "@solana/web3.js";
import { SolanaDerivedPublicKey } from "../src/SolanaDerivedPublicKey";
import { defaultSolanaAuthenticationFunction } from "../src/shared";
import { TEST_SOLANA_PUBLIC_KEY } from "./mocks/solanaWallet";

describe("SolanaDerivedPublicKey", () => {
  const testDomain = "test.example.com";
  const testAuthFunction = defaultSolanaAuthenticationFunction;

  describe("constructor", () => {
    it("should store domain, solanaPublicKey, and authenticationFunction", () => {
      const pubKey = new SolanaDerivedPublicKey({
        domain: testDomain,
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        authenticationFunction: testAuthFunction,
      });

      expect(pubKey.domain).toBe(testDomain);
      expect(pubKey.solanaPublicKey.equals(TEST_SOLANA_PUBLIC_KEY)).toBe(true);
      expect(pubKey.authenticationFunction).toBe(testAuthFunction);
    });

    it("should work with different domains", () => {
      const pubKey1 = new SolanaDerivedPublicKey({
        domain: "app1.com",
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        authenticationFunction: testAuthFunction,
      });

      const pubKey2 = new SolanaDerivedPublicKey({
        domain: "app2.com",
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        authenticationFunction: testAuthFunction,
      });

      expect(pubKey1.domain).toBe("app1.com");
      expect(pubKey2.domain).toBe("app2.com");
    });
  });

  describe("authKey", () => {
    it("should return an AuthenticationKey", () => {
      const pubKey = new SolanaDerivedPublicKey({
        domain: testDomain,
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        authenticationFunction: testAuthFunction,
      });

      const authKey = pubKey.authKey();

      expect(authKey).toBeDefined();
      // AuthenticationKey can derive an address
      const address = authKey.derivedAddress();
      expect(address.toString()).toMatch(/^0x[a-f0-9]{64}$/i);
    });

    it("should produce consistent authentication key for same inputs", () => {
      const pubKey1 = new SolanaDerivedPublicKey({
        domain: testDomain,
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        authenticationFunction: testAuthFunction,
      });

      const pubKey2 = new SolanaDerivedPublicKey({
        domain: testDomain,
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        authenticationFunction: testAuthFunction,
      });

      expect(pubKey1.authKey().derivedAddress().toString()).toBe(
        pubKey2.authKey().derivedAddress().toString()
      );
    });

    it("should produce different auth keys for different solana public keys", () => {
      // Create a different public key
      const differentKey = new SolanaPublicKey(new Uint8Array(32).fill(2));

      const pubKey1 = new SolanaDerivedPublicKey({
        domain: testDomain,
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        authenticationFunction: testAuthFunction,
      });

      const pubKey2 = new SolanaDerivedPublicKey({
        domain: testDomain,
        solanaPublicKey: differentKey,
        authenticationFunction: testAuthFunction,
      });

      expect(pubKey1.authKey().derivedAddress().toString()).not.toBe(
        pubKey2.authKey().derivedAddress().toString()
      );
    });

    it("should produce different auth keys for different domains", () => {
      const pubKey1 = new SolanaDerivedPublicKey({
        domain: "domain1.com",
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        authenticationFunction: testAuthFunction,
      });

      const pubKey2 = new SolanaDerivedPublicKey({
        domain: "domain2.com",
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        authenticationFunction: testAuthFunction,
      });

      expect(pubKey1.authKey().derivedAddress().toString()).not.toBe(
        pubKey2.authKey().derivedAddress().toString()
      );
    });

    it("should derive a valid Aptos address", () => {
      const pubKey = new SolanaDerivedPublicKey({
        domain: testDomain,
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        authenticationFunction: testAuthFunction,
      });

      const address = pubKey.authKey().derivedAddress();

      // Aptos addresses are 32 bytes (64 hex chars + 0x prefix)
      expect(address.toString()).toMatch(/^0x[a-f0-9]{64}$/i);
    });

    it("should produce deterministic derived address", () => {
      const pubKey = new SolanaDerivedPublicKey({
        domain: "test.example.com",
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        authenticationFunction: defaultSolanaAuthenticationFunction,
      });

      const address = pubKey.authKey().derivedAddress();
      // This is deterministic based on the inputs - record the actual value
      expect(address.toString()).toMatch(/^0x[a-f0-9]{64}$/i);
    });
  });

  describe("serialization", () => {
    it("should serialize correctly", () => {
      const pubKey = new SolanaDerivedPublicKey({
        domain: testDomain,
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        authenticationFunction: testAuthFunction,
      });

      const serializer = new Serializer();
      pubKey.serialize(serializer);

      const bytes = serializer.toUint8Array();
      expect(bytes.length).toBeGreaterThan(0);
    });

    it("should serialize and deserialize roundtrip", () => {
      const original = new SolanaDerivedPublicKey({
        domain: testDomain,
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        authenticationFunction: testAuthFunction,
      });

      // Serialize
      const serializer = new Serializer();
      original.serialize(serializer);
      const bytes = serializer.toUint8Array();

      // Deserialize
      const deserializer = new Deserializer(bytes);
      const deserialized = SolanaDerivedPublicKey.deserialize(deserializer);

      expect(deserialized.domain).toBe(original.domain);
      expect(deserialized.solanaPublicKey.toBase58()).toBe(
        original.solanaPublicKey.toBase58()
      );
      expect(deserialized.authenticationFunction).toBe(
        original.authenticationFunction
      );
    });

    it("should preserve auth key through serialization", () => {
      const original = new SolanaDerivedPublicKey({
        domain: testDomain,
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        authenticationFunction: testAuthFunction,
      });

      const serializer = new Serializer();
      original.serialize(serializer);
      const bytes = serializer.toUint8Array();

      const deserializer = new Deserializer(bytes);
      const deserialized = SolanaDerivedPublicKey.deserialize(deserializer);

      // Compare derived addresses (which are deterministic)
      expect(deserialized.authKey().derivedAddress().toString()).toBe(
        original.authKey().derivedAddress().toString()
      );
    });
  });

  describe("isInstance", () => {
    it("should return true for SolanaDerivedPublicKey instances", () => {
      const pubKey = new SolanaDerivedPublicKey({
        domain: testDomain,
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        authenticationFunction: testAuthFunction,
      });

      expect(SolanaDerivedPublicKey.isInstance(pubKey)).toBe(true);
    });

    it("should return false for objects missing required properties", () => {
      const fakePubKey = {
        domain: testDomain,
        // Missing solanaPublicKey and authenticationFunction
      };

      expect(SolanaDerivedPublicKey.isInstance(fakePubKey as any)).toBe(false);
    });

    it("should return false for objects with only some properties", () => {
      const partialPubKey = {
        domain: testDomain,
        solanaPublicKey: TEST_SOLANA_PUBLIC_KEY,
        // Missing authenticationFunction
      };

      expect(SolanaDerivedPublicKey.isInstance(partialPubKey as any)).toBe(false);
    });
  });
});

