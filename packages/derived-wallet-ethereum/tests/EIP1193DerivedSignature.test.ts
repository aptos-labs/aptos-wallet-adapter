import { describe, it, expect } from "vitest";
import { Deserializer, Serializer } from "@aptos-labs/ts-sdk";
import {
  EIP1193PersonalSignature,
  EIP1193SiweSignature,
} from "../src/EIP1193DerivedSignature";

describe("EIP1193DerivedSignature", () => {
  // Example 65-byte Ethereum signature
  const testSignatureHex =
    "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12";

  describe("EIP1193PersonalSignature", () => {
    it("should have LENGTH constant of 65", () => {
      expect(EIP1193PersonalSignature.LENGTH).toBe(65);
    });

    it("should construct from hex string", () => {
      const signature = new EIP1193PersonalSignature(testSignatureHex);
      expect(signature.siweSignature).toBe(testSignatureHex);
    });

    it("should construct from Uint8Array", () => {
      const bytes = new Uint8Array(65).fill(0xab);
      const signature = new EIP1193PersonalSignature(bytes);

      // The getter returns hex string
      expect(signature.siweSignature).toMatch(/^0x[a-f0-9]+$/i);
    });

    it("should serialize correctly", () => {
      const signature = new EIP1193PersonalSignature(testSignatureHex);
      const serializer = new Serializer();
      signature.serialize(serializer);

      const bytes = serializer.toUint8Array();
      expect(bytes.length).toBeGreaterThan(0);
    });

    it("should serialize and deserialize roundtrip", () => {
      const original = new EIP1193PersonalSignature(testSignatureHex);

      // Serialize
      const serializer = new Serializer();
      original.serialize(serializer);
      const bytes = serializer.toUint8Array();

      // Deserialize
      const deserializer = new Deserializer(bytes);
      const deserialized = EIP1193PersonalSignature.deserialize(deserializer);

      expect(deserialized.siweSignature).toBe(original.siweSignature);
    });

    it("should handle different hex formats", () => {
      // With 0x prefix
      const sig1 = new EIP1193PersonalSignature(testSignatureHex);
      // Without 0x prefix
      const sig2 = new EIP1193PersonalSignature(testSignatureHex.slice(2));

      expect(sig1.siweSignature).toBe(sig2.siweSignature);
    });
  });

  describe("EIP1193SiweSignature", () => {
    const testScheme = "https";
    const testIssuedAt = new Date("2024-01-15T12:00:00.000Z");

    it("should construct with scheme, issuedAt, and signature", () => {
      const signature = new EIP1193SiweSignature(
        testScheme,
        testIssuedAt,
        testSignatureHex
      );

      expect(signature.scheme).toBe(testScheme);
      expect(signature.issuedAt).toEqual(testIssuedAt);
      expect(signature.siweSignature).toBe(testSignatureHex);
    });

    it("should serialize with scheme and issuedAt", () => {
      const signature = new EIP1193SiweSignature(
        testScheme,
        testIssuedAt,
        testSignatureHex
      );

      const serializer = new Serializer();
      signature.serialize(serializer);

      const bytes = serializer.toUint8Array();
      expect(bytes.length).toBeGreaterThan(65); // Should include scheme and date strings
    });

    it("should serialize and deserialize roundtrip", () => {
      const original = new EIP1193SiweSignature(
        testScheme,
        testIssuedAt,
        testSignatureHex
      );

      // Serialize
      const serializer = new Serializer();
      original.serialize(serializer);
      const bytes = serializer.toUint8Array();

      // Deserialize
      const deserializer = new Deserializer(bytes);
      const deserialized = EIP1193SiweSignature.deserialize(deserializer);

      expect(deserialized.scheme).toBe(original.scheme);
      expect(deserialized.issuedAt.toISOString()).toBe(
        original.issuedAt.toISOString()
      );
      expect(deserialized.siweSignature).toBe(original.siweSignature);
    });

    it("should handle different schemes", () => {
      const httpSig = new EIP1193SiweSignature(
        "http",
        testIssuedAt,
        testSignatureHex
      );
      const httpsSig = new EIP1193SiweSignature(
        "https",
        testIssuedAt,
        testSignatureHex
      );

      expect(httpSig.scheme).toBe("http");
      expect(httpsSig.scheme).toBe("https");
    });

    it("should preserve date precision through serialization", () => {
      const preciseDate = new Date("2024-06-15T14:30:45.123Z");
      const signature = new EIP1193SiweSignature(
        testScheme,
        preciseDate,
        testSignatureHex
      );

      const serializer = new Serializer();
      signature.serialize(serializer);
      const bytes = serializer.toUint8Array();

      const deserializer = new Deserializer(bytes);
      const deserialized = EIP1193SiweSignature.deserialize(deserializer);

      expect(deserialized.issuedAt.toISOString()).toBe(
        preciseDate.toISOString()
      );
    });

    it("should extend EIP1193PersonalSignature", () => {
      const signature = new EIP1193SiweSignature(
        testScheme,
        testIssuedAt,
        testSignatureHex
      );

      expect(signature).toBeInstanceOf(EIP1193PersonalSignature);
    });
  });
});

