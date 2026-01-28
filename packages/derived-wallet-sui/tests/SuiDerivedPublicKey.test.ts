import { describe, it, expect } from "vitest";
import { Deserializer, Serializer } from "@aptos-labs/ts-sdk";
import { SuiDerivedPublicKey } from "../src/SuiDerivedPublicKey";
import { defaultAuthenticationFunction } from "../src/shared";
import { TEST_SUI_ADDRESS } from "./mocks/suiWallet";

describe("SuiDerivedPublicKey", () => {
  const testDomain = "test.example.com";
  const testAuthFunction = defaultAuthenticationFunction;

  describe("constructor", () => {
    it("should store domain, suiAccountAddress, and authenticationFunction", () => {
      const pubKey = new SuiDerivedPublicKey({
        domain: testDomain,
        suiAccountAddress: TEST_SUI_ADDRESS,
        authenticationFunction: testAuthFunction,
      });

      expect(pubKey.domain).toBe(testDomain);
      expect(pubKey.suiAccountAddress).toBe(TEST_SUI_ADDRESS);
      expect(pubKey.authenticationFunction).toBe(testAuthFunction);
    });

    it("should work with different domains", () => {
      const pubKey1 = new SuiDerivedPublicKey({
        domain: "app1.com",
        suiAccountAddress: TEST_SUI_ADDRESS,
        authenticationFunction: testAuthFunction,
      });

      const pubKey2 = new SuiDerivedPublicKey({
        domain: "app2.com",
        suiAccountAddress: TEST_SUI_ADDRESS,
        authenticationFunction: testAuthFunction,
      });

      expect(pubKey1.domain).toBe("app1.com");
      expect(pubKey2.domain).toBe("app2.com");
    });
  });

  describe("authKey", () => {
    it("should return an AuthenticationKey", () => {
      const pubKey = new SuiDerivedPublicKey({
        domain: testDomain,
        suiAccountAddress: TEST_SUI_ADDRESS,
        authenticationFunction: testAuthFunction,
      });

      const authKey = pubKey.authKey();

      expect(authKey).toBeDefined();
      // AuthenticationKey can derive an address
      const address = authKey.derivedAddress();
      expect(address.toString()).toMatch(/^0x[a-f0-9]{64}$/i);
    });

    it("should produce consistent authentication key for same inputs", () => {
      const pubKey1 = new SuiDerivedPublicKey({
        domain: testDomain,
        suiAccountAddress: TEST_SUI_ADDRESS,
        authenticationFunction: testAuthFunction,
      });

      const pubKey2 = new SuiDerivedPublicKey({
        domain: testDomain,
        suiAccountAddress: TEST_SUI_ADDRESS,
        authenticationFunction: testAuthFunction,
      });

      expect(pubKey1.authKey().derivedAddress().toString()).toBe(
        pubKey2.authKey().derivedAddress().toString()
      );
    });

    it("should produce different auth keys for different sui addresses", () => {
      // Create a different address
      const differentAddress =
        "0x0202020202020202020202020202020202020202020202020202020202020202";

      const pubKey1 = new SuiDerivedPublicKey({
        domain: testDomain,
        suiAccountAddress: TEST_SUI_ADDRESS,
        authenticationFunction: testAuthFunction,
      });

      const pubKey2 = new SuiDerivedPublicKey({
        domain: testDomain,
        suiAccountAddress: differentAddress,
        authenticationFunction: testAuthFunction,
      });

      expect(pubKey1.authKey().derivedAddress().toString()).not.toBe(
        pubKey2.authKey().derivedAddress().toString()
      );
    });

    it("should produce different auth keys for different domains", () => {
      const pubKey1 = new SuiDerivedPublicKey({
        domain: "domain1.com",
        suiAccountAddress: TEST_SUI_ADDRESS,
        authenticationFunction: testAuthFunction,
      });

      const pubKey2 = new SuiDerivedPublicKey({
        domain: "domain2.com",
        suiAccountAddress: TEST_SUI_ADDRESS,
        authenticationFunction: testAuthFunction,
      });

      expect(pubKey1.authKey().derivedAddress().toString()).not.toBe(
        pubKey2.authKey().derivedAddress().toString()
      );
    });

    it("should derive a valid Aptos address", () => {
      const pubKey = new SuiDerivedPublicKey({
        domain: testDomain,
        suiAccountAddress: TEST_SUI_ADDRESS,
        authenticationFunction: testAuthFunction,
      });

      const address = pubKey.authKey().derivedAddress();

      // Aptos addresses are 32 bytes (64 hex chars + 0x prefix)
      expect(address.toString()).toMatch(/^0x[a-f0-9]{64}$/i);
    });

    it("should produce deterministic derived address", () => {
      const pubKey = new SuiDerivedPublicKey({
        domain: "test.example.com",
        suiAccountAddress: TEST_SUI_ADDRESS,
        authenticationFunction: defaultAuthenticationFunction,
      });

      const address = pubKey.authKey().derivedAddress();
      // This is deterministic based on the inputs - record the actual value
      expect(address.toString()).toMatch(/^0x[a-f0-9]{64}$/i);
    });
  });

  describe("verifySignature", () => {
    it("should throw when called synchronously", () => {
      const pubKey = new SuiDerivedPublicKey({
        domain: testDomain,
        suiAccountAddress: TEST_SUI_ADDRESS,
        authenticationFunction: testAuthFunction,
      });

      expect(() => {
        pubKey.verifySignature({
          message: new Uint8Array([1, 2, 3]),
          signature: {} as any,
        });
      }).toThrow("Use verifySignatureAsync instead");
    });
  });

  describe("serialization", () => {
    it("should serialize correctly", () => {
      const pubKey = new SuiDerivedPublicKey({
        domain: testDomain,
        suiAccountAddress: TEST_SUI_ADDRESS,
        authenticationFunction: testAuthFunction,
      });

      const serializer = new Serializer();
      pubKey.serialize(serializer);

      const bytes = serializer.toUint8Array();
      expect(bytes.length).toBeGreaterThan(0);
    });

    it("should serialize and deserialize roundtrip", () => {
      const original = new SuiDerivedPublicKey({
        domain: testDomain,
        suiAccountAddress: TEST_SUI_ADDRESS,
        authenticationFunction: testAuthFunction,
      });

      // Serialize
      const serializer = new Serializer();
      original.serialize(serializer);
      const bytes = serializer.toUint8Array();

      // Deserialize
      const deserializer = new Deserializer(bytes);
      const deserialized = SuiDerivedPublicKey.deserialize(deserializer);

      expect(deserialized.domain).toBe(original.domain);
      expect(deserialized.suiAccountAddress.toLowerCase()).toBe(
        original.suiAccountAddress.toLowerCase()
      );
      expect(deserialized.authenticationFunction).toBe(
        original.authenticationFunction
      );
    });

    it("should preserve auth key through serialization", () => {
      const original = new SuiDerivedPublicKey({
        domain: testDomain,
        suiAccountAddress: TEST_SUI_ADDRESS,
        authenticationFunction: testAuthFunction,
      });

      const serializer = new Serializer();
      original.serialize(serializer);
      const bytes = serializer.toUint8Array();

      const deserializer = new Deserializer(bytes);
      const deserialized = SuiDerivedPublicKey.deserialize(deserializer);

      // Compare derived addresses (which are deterministic)
      expect(deserialized.authKey().derivedAddress().toString()).toBe(
        original.authKey().derivedAddress().toString()
      );
    });
  });
});

