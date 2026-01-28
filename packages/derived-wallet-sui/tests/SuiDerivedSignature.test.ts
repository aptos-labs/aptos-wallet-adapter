import { describe, it, expect } from "vitest";
import { Deserializer, Serializer } from "@aptos-labs/ts-sdk";
import { toBase64, fromBase64 } from "@mysten/bcs";
import { SuiDerivedEd25519Signature } from "../src/SuiDerivedSignature";

describe("SuiDerivedEd25519Signature", () => {
  // Create a test signature: 1 byte scheme flag + 64 bytes signature + 32 bytes public key
  const createTestSignature = () => {
    const signatureBytes = new Uint8Array(97);
    signatureBytes[0] = 0x00; // Ed25519 scheme flag
    // Fill signature portion (64 bytes)
    for (let i = 1; i < 65; i++) {
      signatureBytes[i] = i;
    }
    // Fill public key portion (32 bytes)
    for (let i = 65; i < 97; i++) {
      signatureBytes[i] = i - 64;
    }
    return toBase64(signatureBytes);
  };

  const testSignatureBase64 = createTestSignature();

  describe("constructor", () => {
    it("should store the base64 signature", () => {
      const sig = new SuiDerivedEd25519Signature(testSignatureBase64);
      expect(sig.signatureBase64).toBe(testSignatureBase64);
    });
  });

  describe("SIGNATURE_LENGTH", () => {
    it("should be 97 (1 + 64 + 32)", () => {
      expect(SuiDerivedEd25519Signature.SIGNATURE_LENGTH).toBe(97);
    });
  });

  describe("toUint8Array", () => {
    it("should return the signature as Uint8Array", () => {
      const sig = new SuiDerivedEd25519Signature(testSignatureBase64);
      const bytes = sig.toUint8Array();

      expect(bytes).toBeInstanceOf(Uint8Array);
      expect(bytes.length).toBe(97);
    });

    it("should return bytes that match the original input", () => {
      const sig = new SuiDerivedEd25519Signature(testSignatureBase64);
      const bytes = sig.toUint8Array();

      // Convert back to base64 and compare
      expect(toBase64(bytes)).toBe(testSignatureBase64);
    });
  });

  describe("signatureBase64", () => {
    it("should return the original base64 signature", () => {
      const sig = new SuiDerivedEd25519Signature(testSignatureBase64);
      expect(sig.signatureBase64).toBe(testSignatureBase64);
    });
  });

  describe("signatureHex", () => {
    it("should return the signature as Hex", () => {
      const sig = new SuiDerivedEd25519Signature(testSignatureBase64);
      const hex = sig.signatureHex;

      expect(hex).toBeDefined();
      // Hex string should match the bytes
      const hexString = hex.toString();
      expect(hexString).toMatch(/^0x[a-f0-9]+$/i);
    });

    it("should produce consistent hex output", () => {
      const sig = new SuiDerivedEd25519Signature(testSignatureBase64);

      const hex1 = sig.signatureHex.toString();
      const hex2 = sig.signatureHex.toString();

      expect(hex1).toBe(hex2);
    });
  });

  describe("serialization", () => {
    it("should serialize correctly", () => {
      const sig = new SuiDerivedEd25519Signature(testSignatureBase64);

      const serializer = new Serializer();
      sig.serialize(serializer);

      const bytes = serializer.toUint8Array();
      expect(bytes.length).toBeGreaterThan(0);
    });

    it("should serialize and deserialize roundtrip", () => {
      const original = new SuiDerivedEd25519Signature(testSignatureBase64);

      // Serialize
      const serializer = new Serializer();
      original.serialize(serializer);
      const bytes = serializer.toUint8Array();

      // Deserialize
      const deserializer = new Deserializer(bytes);
      const deserialized = SuiDerivedEd25519Signature.deserialize(deserializer);

      expect(deserialized.signatureBase64).toBe(original.signatureBase64);
    });

    it("should preserve signature bytes through serialization", () => {
      const original = new SuiDerivedEd25519Signature(testSignatureBase64);

      const serializer = new Serializer();
      original.serialize(serializer);
      const bytes = serializer.toUint8Array();

      const deserializer = new Deserializer(bytes);
      const deserialized = SuiDerivedEd25519Signature.deserialize(deserializer);

      // Compare the raw bytes
      const originalBytes = original.toUint8Array();
      const deserializedBytes = deserialized.toUint8Array();

      expect(deserializedBytes.length).toBe(originalBytes.length);
      for (let i = 0; i < originalBytes.length; i++) {
        expect(deserializedBytes[i]).toBe(originalBytes[i]);
      }
    });
  });

  describe("different signature values", () => {
    it("should handle different valid base64 signatures", () => {
      // Create another valid signature
      const otherSignatureBytes = new Uint8Array(97);
      otherSignatureBytes[0] = 0x00;
      for (let i = 1; i < 97; i++) {
        otherSignatureBytes[i] = 255 - i;
      }
      const otherBase64 = toBase64(otherSignatureBytes);

      const sig = new SuiDerivedEd25519Signature(otherBase64);
      expect(sig.signatureBase64).toBe(otherBase64);
      expect(sig.toUint8Array().length).toBe(97);
    });
  });
});

