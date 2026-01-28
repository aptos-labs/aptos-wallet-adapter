import { describe, it, expect } from "vitest";
import {
  Account,
  Ed25519PrivateKey,
  PrivateKey,
  PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";
import { AptosLocalSigner } from "../../src/providers/wormhole/signers/AptosLocalSigner";

describe("AptosLocalSigner", () => {
  // Create a test account using a deterministic private key (AIP-80 compliant format)
  const testPrivateKey = new Ed25519PrivateKey(
    PrivateKey.formatPrivateKey(
      "0x0000000000000000000000000000000000000000000000000000000000000001",
      PrivateKeyVariants.Ed25519
    )
  );
  const testAccount = Account.fromPrivateKey({ privateKey: testPrivateKey });
  const mockOptions = {};

  describe("constructor", () => {
    it("should create signer with required properties", () => {
      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        undefined
      );

      expect(signer).toBeDefined();
      expect(signer._chain).toBe("Aptos");
      expect(signer._options).toBe(mockOptions);
      expect(signer._wallet).toBe(testAccount);
    });

    it("should initialize claimedTransactionHashes as empty string", () => {
      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        undefined
      );

      expect(signer._claimedTransactionHashes).toBe("");
    });

    it("should accept sponsor account (Account type)", () => {
      const sponsorPrivateKey = new Ed25519PrivateKey(
        PrivateKey.formatPrivateKey(
          "0x0000000000000000000000000000000000000000000000000000000000000002",
          PrivateKeyVariants.Ed25519
        )
      );
      const sponsorAccount = Account.fromPrivateKey({
        privateKey: sponsorPrivateKey,
      });

      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        sponsorAccount
      );

      expect(signer._sponsorAccount).toBe(sponsorAccount);
    });

    it("should accept sponsor account (string gas station key)", () => {
      const gasStationKey = "gas-station-api-key";

      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        gasStationKey
      );

      expect(signer._sponsorAccount).toBe(gasStationKey);
    });
  });

  describe("chain()", () => {
    it("should return the chain", () => {
      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        undefined
      );

      expect(signer.chain()).toBe("Aptos");
    });
  });

  describe("address()", () => {
    it("should return the wallet account address", () => {
      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        undefined
      );

      expect(signer.address()).toBe(testAccount.accountAddress.toString());
    });

    it("should return valid Aptos address format", () => {
      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        undefined
      );

      // Aptos addresses are 64 hex characters prefixed with 0x
      expect(signer.address()).toMatch(/^0x[a-f0-9]{64}$/i);
    });
  });

  describe("claimedTransactionHashes()", () => {
    it("should initially return empty string", () => {
      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        undefined
      );

      expect(signer.claimedTransactionHashes()).toBe("");
    });

    it("should return updated value after internal modification", () => {
      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        undefined
      );

      // Directly modify internal state for testing
      signer._claimedTransactionHashes = "0xabc123def456";

      expect(signer.claimedTransactionHashes()).toBe("0xabc123def456");
    });
  });

  describe("properties", () => {
    it("should expose wallet as _wallet", () => {
      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        undefined
      );

      expect(signer._wallet).toBe(testAccount);
      expect(signer._wallet.accountAddress).toBeDefined();
    });

    it("should expose options as _options", () => {
      const customOptions = { custom: "option" };
      const signer = new AptosLocalSigner(
        "Aptos",
        customOptions,
        testAccount,
        undefined
      );

      expect(signer._options).toBe(customOptions);
    });
  });

  // Note: signAndSend tests require mocking Aptos SDK network calls
  // These are covered in integration tests
});

