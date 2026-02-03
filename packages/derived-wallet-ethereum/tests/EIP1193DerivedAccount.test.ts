import { describe, it, expect } from "vitest";
import { Wallet } from "ethers";
import { AbstractedAccount } from "@aptos-labs/ts-sdk";
import { EIP1193DerivedAccount } from "../src/EIP1193DerivedAccount";
import { EIP1193DerivedPublicKey } from "../src/EIP1193DerivedPublicKey";
import { defaultEthereumAuthenticationFunction } from "../src/shared";
import {
  TEST_PRIVATE_KEY,
  TEST_ETHEREUM_ADDRESS,
} from "./mocks/eip1193Provider";

describe("EIP1193DerivedAccount", () => {
  const testDomain = "test.example.com";

  describe("constructor", () => {
    it("should create account from ethereum wallet", () => {
      const ethereumWallet = new Wallet(TEST_PRIVATE_KEY);

      const account = new EIP1193DerivedAccount({
        ethereumWallet,
        domain: testDomain,
      });

      expect(account).toBeDefined();
      expect(account).toBeInstanceOf(AbstractedAccount);
    });

    it("should store ethereum wallet", () => {
      const ethereumWallet = new Wallet(TEST_PRIVATE_KEY);

      const account = new EIP1193DerivedAccount({
        ethereumWallet,
        domain: testDomain,
      });

      expect(account.ethereumWallet).toBe(ethereumWallet);
    });

    it("should store domain", () => {
      const ethereumWallet = new Wallet(TEST_PRIVATE_KEY);

      const account = new EIP1193DerivedAccount({
        ethereumWallet,
        domain: testDomain,
      });

      expect(account.domain).toBe(testDomain);
    });

    it("should default scheme to https", () => {
      const ethereumWallet = new Wallet(TEST_PRIVATE_KEY);

      const account = new EIP1193DerivedAccount({
        ethereumWallet,
        domain: testDomain,
      });

      expect(account.scheme).toBe("https");
    });

    it("should allow custom scheme", () => {
      const ethereumWallet = new Wallet(TEST_PRIVATE_KEY);

      const account = new EIP1193DerivedAccount({
        ethereumWallet,
        domain: testDomain,
        scheme: "http",
      });

      expect(account.scheme).toBe("http");
    });

    it("should default to ethereum authentication function", () => {
      const ethereumWallet = new Wallet(TEST_PRIVATE_KEY);

      const account = new EIP1193DerivedAccount({
        ethereumWallet,
        domain: testDomain,
      });

      expect(account.authenticationFunction).toBe(
        defaultEthereumAuthenticationFunction,
      );
    });

    it("should allow custom authentication function", () => {
      const ethereumWallet = new Wallet(TEST_PRIVATE_KEY);
      const customAuthFunction = "0x1::custom::authenticate";

      const account = new EIP1193DerivedAccount({
        ethereumWallet,
        domain: testDomain,
        authenticationFunction: customAuthFunction,
      });

      expect(account.authenticationFunction).toBe(customAuthFunction);
    });

    it("should create derived public key", () => {
      const ethereumWallet = new Wallet(TEST_PRIVATE_KEY);

      const account = new EIP1193DerivedAccount({
        ethereumWallet,
        domain: testDomain,
      });

      expect(account.derivedPublicKey).toBeInstanceOf(EIP1193DerivedPublicKey);
      expect(account.derivedPublicKey.domain).toBe(testDomain);
      expect(account.derivedPublicKey.ethereumAddress.toLowerCase()).toBe(
        TEST_ETHEREUM_ADDRESS.toLowerCase(),
      );
    });
  });

  describe("accountAddress", () => {
    it("should derive Aptos address from ethereum address and domain", () => {
      const ethereumWallet = new Wallet(TEST_PRIVATE_KEY);

      const account = new EIP1193DerivedAccount({
        ethereumWallet,
        domain: testDomain,
      });

      // Should be a valid 32-byte Aptos address
      expect(account.accountAddress.toString()).toMatch(/^0x[a-f0-9]{64}$/i);
    });

    it("should produce consistent addresses for same inputs", () => {
      const ethereumWallet = new Wallet(TEST_PRIVATE_KEY);

      const account1 = new EIP1193DerivedAccount({
        ethereumWallet,
        domain: testDomain,
      });

      const account2 = new EIP1193DerivedAccount({
        ethereumWallet,
        domain: testDomain,
      });

      expect(account1.accountAddress.toString()).toBe(
        account2.accountAddress.toString(),
      );
    });

    it("should produce different addresses for different domains", () => {
      const ethereumWallet = new Wallet(TEST_PRIVATE_KEY);

      const account1 = new EIP1193DerivedAccount({
        ethereumWallet,
        domain: "domain1.com",
      });

      const account2 = new EIP1193DerivedAccount({
        ethereumWallet,
        domain: "domain2.com",
      });

      expect(account1.accountAddress.toString()).not.toBe(
        account2.accountAddress.toString(),
      );
    });

    it("should produce different addresses for different ethereum wallets", () => {
      const wallet1 = new Wallet(TEST_PRIVATE_KEY);
      const wallet2 = new Wallet(
        "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
      );

      const account1 = new EIP1193DerivedAccount({
        ethereumWallet: wallet1,
        domain: testDomain,
      });

      const account2 = new EIP1193DerivedAccount({
        ethereumWallet: wallet2,
        domain: testDomain,
      });

      expect(account1.accountAddress.toString()).not.toBe(
        account2.accountAddress.toString(),
      );
    });

    it("should derive deterministic address for known inputs", () => {
      const ethereumWallet = new Wallet(TEST_PRIVATE_KEY);

      const account = new EIP1193DerivedAccount({
        ethereumWallet,
        domain: "test.example.com",
      });

      // This is the expected derived address for the test private key and domain
      expect(account.accountAddress.toString()).toBe(
        "0xb5de999e1865abd8503ffa88f58159f7540d1fd8427786a8df14c9d60577c9b5",
      );
    });
  });

  // Note: signTransactionWithAuthenticator tests require network access
  // to build transactions. These are tested via integration tests.
});
