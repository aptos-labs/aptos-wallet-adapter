import { describe, it, expect } from "vitest";
import { Deserializer, Serializer } from "@aptos-labs/ts-sdk";
import { EIP1193DerivedPublicKey } from "../src/EIP1193DerivedPublicKey";
import { defaultEthereumAuthenticationFunction } from "../src/shared";
import type { EthereumAddress } from "../src/shared";

describe("EIP1193DerivedPublicKey", () => {
  // Test Ethereum address (20 bytes)
  const testEthereumAddress: EthereumAddress =
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const testDomain = "test.example.com";
  const testAuthFunction = defaultEthereumAuthenticationFunction;

  describe("constructor", () => {
    it("should store domain, ethereumAddress, and authenticationFunction", () => {
      const pubKey = new EIP1193DerivedPublicKey({
        domain: testDomain,
        ethereumAddress: testEthereumAddress,
        authenticationFunction: testAuthFunction,
      });

      expect(pubKey.domain).toBe(testDomain);
      expect(pubKey.ethereumAddress).toBe(testEthereumAddress);
      expect(pubKey.authenticationFunction).toBe(testAuthFunction);
    });

    it("should work with different domains", () => {
      const pubKey1 = new EIP1193DerivedPublicKey({
        domain: "app1.com",
        ethereumAddress: testEthereumAddress,
        authenticationFunction: testAuthFunction,
      });

      const pubKey2 = new EIP1193DerivedPublicKey({
        domain: "app2.com",
        ethereumAddress: testEthereumAddress,
        authenticationFunction: testAuthFunction,
      });

      expect(pubKey1.domain).toBe("app1.com");
      expect(pubKey2.domain).toBe("app2.com");
    });
  });

  describe("authKey", () => {
    it("should return an AuthenticationKey", () => {
      const pubKey = new EIP1193DerivedPublicKey({
        domain: testDomain,
        ethereumAddress: testEthereumAddress,
        authenticationFunction: testAuthFunction,
      });

      const authKey = pubKey.authKey();

      expect(authKey).toBeDefined();
      // AuthenticationKey can derive an address
      const address = authKey.derivedAddress();
      expect(address.toString()).toMatch(/^0x[a-f0-9]{64}$/i);
    });

    it("should produce consistent authentication key for same inputs", () => {
      const pubKey1 = new EIP1193DerivedPublicKey({
        domain: testDomain,
        ethereumAddress: testEthereumAddress,
        authenticationFunction: testAuthFunction,
      });

      const pubKey2 = new EIP1193DerivedPublicKey({
        domain: testDomain,
        ethereumAddress: testEthereumAddress,
        authenticationFunction: testAuthFunction,
      });

      expect(pubKey1.authKey().data).toEqual(pubKey2.authKey().data);
    });

    it("should produce different auth keys for different ethereum addresses", () => {
      const pubKey1 = new EIP1193DerivedPublicKey({
        domain: testDomain,
        ethereumAddress: "0x1111111111111111111111111111111111111111",
        authenticationFunction: testAuthFunction,
      });

      const pubKey2 = new EIP1193DerivedPublicKey({
        domain: testDomain,
        ethereumAddress: "0x2222222222222222222222222222222222222222",
        authenticationFunction: testAuthFunction,
      });

      expect(pubKey1.authKey().data).not.toEqual(pubKey2.authKey().data);
    });

    it("should produce different auth keys for different domains", () => {
      const pubKey1 = new EIP1193DerivedPublicKey({
        domain: "domain1.com",
        ethereumAddress: testEthereumAddress,
        authenticationFunction: testAuthFunction,
      });

      const pubKey2 = new EIP1193DerivedPublicKey({
        domain: "domain2.com",
        ethereumAddress: testEthereumAddress,
        authenticationFunction: testAuthFunction,
      });

      expect(pubKey1.authKey().data).not.toEqual(pubKey2.authKey().data);
    });

    it("should derive a valid Aptos address", () => {
      const pubKey = new EIP1193DerivedPublicKey({
        domain: testDomain,
        ethereumAddress: testEthereumAddress,
        authenticationFunction: testAuthFunction,
      });

      const address = pubKey.authKey().derivedAddress();

      // Aptos addresses are 32 bytes (64 hex chars + 0x prefix)
      expect(address.toString()).toMatch(/^0x[a-f0-9]{64}$/i);
    });

    it("should produce deterministic derived address", () => {
      const pubKey = new EIP1193DerivedPublicKey({
        domain: "test.example.com",
        ethereumAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        authenticationFunction: "0x1::ethereum_derivable_account::authenticate",
      });

      const address = pubKey.authKey().derivedAddress();
      // This is deterministic based on the inputs
      expect(address.toString()).toBe(
        "0xb5de999e1865abd8503ffa88f58159f7540d1fd8427786a8df14c9d60577c9b5",
      );
    });
  });

  describe("serialization", () => {
    it("should serialize correctly", () => {
      const pubKey = new EIP1193DerivedPublicKey({
        domain: testDomain,
        ethereumAddress: testEthereumAddress,
        authenticationFunction: testAuthFunction,
      });

      const serializer = new Serializer();
      pubKey.serialize(serializer);

      const bytes = serializer.toUint8Array();
      expect(bytes.length).toBeGreaterThan(0);
    });

    it("should serialize and deserialize roundtrip", () => {
      const original = new EIP1193DerivedPublicKey({
        domain: testDomain,
        ethereumAddress: testEthereumAddress,
        authenticationFunction: testAuthFunction,
      });

      // Serialize
      const serializer = new Serializer();
      original.serialize(serializer);
      const bytes = serializer.toUint8Array();

      // Deserialize
      const deserializer = new Deserializer(bytes);
      const deserialized = EIP1193DerivedPublicKey.deserialize(deserializer);

      expect(deserialized.domain).toBe(original.domain);
      expect(deserialized.ethereumAddress.toLowerCase()).toBe(
        original.ethereumAddress.toLowerCase(),
      );
      expect(deserialized.authenticationFunction).toBe(
        original.authenticationFunction,
      );
    });

    it("should preserve auth key through serialization", () => {
      // Use lowercase address to ensure consistency after deserialization
      // (deserialization returns lowercase address from Hex)
      const lowercaseAddress =
        testEthereumAddress.toLowerCase() as EthereumAddress;
      const original = new EIP1193DerivedPublicKey({
        domain: testDomain,
        ethereumAddress: lowercaseAddress,
        authenticationFunction: testAuthFunction,
      });

      const serializer = new Serializer();
      original.serialize(serializer);
      const bytes = serializer.toUint8Array();

      const deserializer = new Deserializer(bytes);
      const deserialized = EIP1193DerivedPublicKey.deserialize(deserializer);

      // Compare derived addresses (which are deterministic)
      expect(deserialized.authKey().derivedAddress().toString()).toBe(
        original.authKey().derivedAddress().toString(),
      );
    });
  });

  describe("isInstance", () => {
    it("should return true for EIP1193DerivedPublicKey instances", () => {
      const pubKey = new EIP1193DerivedPublicKey({
        domain: testDomain,
        ethereumAddress: testEthereumAddress,
        authenticationFunction: testAuthFunction,
      });

      expect(EIP1193DerivedPublicKey.isInstance(pubKey)).toBe(true);
    });

    it("should return false for objects missing required properties", () => {
      const fakePubKey = {
        domain: testDomain,
        // Missing ethereumAddress and authenticationFunction
      };

      expect(EIP1193DerivedPublicKey.isInstance(fakePubKey as any)).toBe(false);
    });

    it("should return false for objects with only some properties", () => {
      const partialPubKey = {
        domain: testDomain,
        ethereumAddress: testEthereumAddress,
        // Missing authenticationFunction
      };

      expect(EIP1193DerivedPublicKey.isInstance(partialPubKey as any)).toBe(
        false,
      );
    });
  });
});
