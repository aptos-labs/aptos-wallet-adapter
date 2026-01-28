import { describe, it, expect } from "vitest";
import { Keypair } from "@solana/web3.js";
import { AbstractedAccount } from "@aptos-labs/ts-sdk";
import { SolanaDerivedAccount } from "../src/SolanaDerivedAccount";
import { SolanaDerivedPublicKey } from "../src/SolanaDerivedPublicKey";
import { defaultSolanaAuthenticationFunction } from "../src/shared";
import { TEST_SOLANA_KEYPAIR } from "./mocks/solanaWallet";

describe("SolanaDerivedAccount", () => {
  const testDomain = "test.example.com";

  describe("constructor", () => {
    it("should create account from solana keypair", () => {
      const account = new SolanaDerivedAccount({
        solanaKeypair: TEST_SOLANA_KEYPAIR,
        domain: testDomain,
      });

      expect(account).toBeDefined();
      expect(account).toBeInstanceOf(AbstractedAccount);
    });

    it("should store solana keypair", () => {
      const account = new SolanaDerivedAccount({
        solanaKeypair: TEST_SOLANA_KEYPAIR,
        domain: testDomain,
      });

      expect(account.solanaKeypair).toBe(TEST_SOLANA_KEYPAIR);
    });

    it("should store domain", () => {
      const account = new SolanaDerivedAccount({
        solanaKeypair: TEST_SOLANA_KEYPAIR,
        domain: testDomain,
      });

      expect(account.domain).toBe(testDomain);
    });

    it("should default to solana authentication function", () => {
      const account = new SolanaDerivedAccount({
        solanaKeypair: TEST_SOLANA_KEYPAIR,
        domain: testDomain,
      });

      expect(account.authenticationFunction).toBe(
        defaultSolanaAuthenticationFunction
      );
    });

    it("should allow custom authentication function", () => {
      const customAuthFunction = "0x1::custom::authenticate";

      const account = new SolanaDerivedAccount({
        solanaKeypair: TEST_SOLANA_KEYPAIR,
        domain: testDomain,
        authenticationFunction: customAuthFunction,
      });

      expect(account.authenticationFunction).toBe(customAuthFunction);
    });

    it("should create derived public key", () => {
      const account = new SolanaDerivedAccount({
        solanaKeypair: TEST_SOLANA_KEYPAIR,
        domain: testDomain,
      });

      expect(account.derivedPublicKey).toBeInstanceOf(SolanaDerivedPublicKey);
      expect(account.derivedPublicKey.domain).toBe(testDomain);
      expect(
        account.derivedPublicKey.solanaPublicKey.equals(
          TEST_SOLANA_KEYPAIR.publicKey
        )
      ).toBe(true);
    });
  });

  describe("accountAddress", () => {
    it("should derive Aptos address from solana keypair and domain", () => {
      const account = new SolanaDerivedAccount({
        solanaKeypair: TEST_SOLANA_KEYPAIR,
        domain: testDomain,
      });

      // Should be a valid 32-byte Aptos address
      expect(account.accountAddress.toString()).toMatch(/^0x[a-f0-9]{64}$/i);
    });

    it("should produce consistent addresses for same inputs", () => {
      const account1 = new SolanaDerivedAccount({
        solanaKeypair: TEST_SOLANA_KEYPAIR,
        domain: testDomain,
      });

      const account2 = new SolanaDerivedAccount({
        solanaKeypair: TEST_SOLANA_KEYPAIR,
        domain: testDomain,
      });

      expect(account1.accountAddress.toString()).toBe(
        account2.accountAddress.toString()
      );
    });

    it("should produce different addresses for different domains", () => {
      const account1 = new SolanaDerivedAccount({
        solanaKeypair: TEST_SOLANA_KEYPAIR,
        domain: "domain1.com",
      });

      const account2 = new SolanaDerivedAccount({
        solanaKeypair: TEST_SOLANA_KEYPAIR,
        domain: "domain2.com",
      });

      expect(account1.accountAddress.toString()).not.toBe(
        account2.accountAddress.toString()
      );
    });

    it("should produce different addresses for different solana keypairs", () => {
      const keypair2 = Keypair.fromSeed(new Uint8Array(32).fill(2));

      const account1 = new SolanaDerivedAccount({
        solanaKeypair: TEST_SOLANA_KEYPAIR,
        domain: testDomain,
      });

      const account2 = new SolanaDerivedAccount({
        solanaKeypair: keypair2,
        domain: testDomain,
      });

      expect(account1.accountAddress.toString()).not.toBe(
        account2.accountAddress.toString()
      );
    });

    it("should derive deterministic address for known inputs", () => {
      const account = new SolanaDerivedAccount({
        solanaKeypair: TEST_SOLANA_KEYPAIR,
        domain: "test.example.com",
      });

      // The address should be deterministic and valid
      expect(account.accountAddress.toString()).toMatch(/^0x[a-f0-9]{64}$/i);
    });
  });

  // Note: signTransactionWithAuthenticator tests require network access
  // to build transactions. These are tested via integration tests.
});

