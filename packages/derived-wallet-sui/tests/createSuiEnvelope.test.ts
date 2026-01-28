import { describe, it, expect } from "vitest";
import { Hex } from "@aptos-labs/ts-sdk";
import { createSuiEnvelopeForAptosTransaction } from "../src/createSuiEnvelope";
import { TEST_SUI_ADDRESS } from "./mocks/suiWallet";

describe("createSuiEnvelope", () => {
  const testDomain = "test.example.com";

  // Create a test signing message digest (32 bytes)
  const testDigest = new Uint8Array(32).fill(0xab);

  describe("createSuiEnvelopeForAptosTransaction", () => {
    // Note: We can't fully test createSuiEnvelopeForAptosTransaction without
    // a real AnyRawTransaction, which requires network access to build.
    // These tests verify the envelope structure with a mock transaction.

    // Shared mock transaction to avoid duplication
    const mockRawTransaction = {
      rawTransaction: {
        sender: {
          toString: () =>
            "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        },
        sequence_number: BigInt(0),
        payload: {
          type: "entry_function_payload",
          function: "0x1::coin::transfer",
          type_arguments: [],
          arguments: [],
        },
        max_gas_amount: BigInt(2000),
        gas_unit_price: BigInt(1),
        expiration_timestamp_secs: BigInt(Math.floor(Date.now() / 1000) + 600),
        chain_id: { chainId: 1 },
      },
    };

    const createEnvelope = () =>
      createSuiEnvelopeForAptosTransaction({
        suiAddress: TEST_SUI_ADDRESS,
        signingMessageDigest: testDigest,
        domain: testDomain,
        rawTransaction: mockRawTransaction as any,
      });

    it("should create an envelope string", () => {
      const envelope = createEnvelope();

      expect(typeof envelope).toBe("string");
      expect(envelope.length).toBeGreaterThan(0);
    });

    it("should include domain in envelope", () => {
      const envelope = createEnvelope();

      expect(envelope).toContain(testDomain);
    });

    it("should include sui address in envelope", () => {
      const envelope = createEnvelope();

      expect(envelope).toContain(TEST_SUI_ADDRESS);
    });

    it("should include nonce (digest as hex) in envelope", () => {
      const envelope = createEnvelope();

      const expectedHex = Hex.fromHexInput(testDigest).toString();
      expect(envelope).toContain(expectedHex);
    });

    it("should include SIWS format text", () => {
      const envelope = createEnvelope();

      // Should include the SIWS format "wants you to sign in with your Sui account"
      expect(envelope).toContain("wants you to sign in with your Sui account");
    });

    it("should include Nonce label", () => {
      const envelope = createEnvelope();

      expect(envelope).toContain("Nonce:");
    });
  });
});
