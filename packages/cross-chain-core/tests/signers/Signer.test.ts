import { describe, it, expect } from "vitest";
import { Signer } from "../../src/providers/wormhole/signers/Signer";
import { testnetChains, Context } from "../../src/config";
import type { AdapterWallet } from "@aptos-labs/wallet-adapter-core";

describe("Signer", () => {
  const mockChainConfig = testnetChains.Solana!;
  const mockAddress = "SolanaAddress123";
  const mockOptions = {};
  const mockWallet = {} as AdapterWallet;

  describe("constructor", () => {
    it("should create signer with required properties", () => {
      const signer = new Signer(
        mockChainConfig,
        mockAddress,
        mockOptions,
        mockWallet
      );

      expect(signer).toBeDefined();
      expect(signer._chain).toBe(mockChainConfig);
      expect(signer._address).toBe(mockAddress);
      expect(signer._options).toBe(mockOptions);
      expect(signer._wallet).toBe(mockWallet);
    });

    it("should initialize claimedTransactionHashes as empty string", () => {
      const signer = new Signer(
        mockChainConfig,
        mockAddress,
        mockOptions,
        mockWallet
      );

      expect(signer._claimedTransactionHashes).toBe("");
    });

    it("should accept optional crossChainCore", () => {
      const mockCrossChainCore = {} as any;
      const signer = new Signer(
        mockChainConfig,
        mockAddress,
        mockOptions,
        mockWallet,
        mockCrossChainCore
      );

      expect(signer._crossChainCore).toBe(mockCrossChainCore);
    });

    it("should accept optional sponsorAccount", () => {
      const mockSponsorAccount = {} as any;
      const signer = new Signer(
        mockChainConfig,
        mockAddress,
        mockOptions,
        mockWallet,
        undefined,
        mockSponsorAccount
      );

      expect(signer._sponsorAccount).toBe(mockSponsorAccount);
    });
  });

  describe("chain()", () => {
    it("should return the chain key", () => {
      const signer = new Signer(
        mockChainConfig,
        mockAddress,
        mockOptions,
        mockWallet
      );

      expect(signer.chain()).toBe("Solana");
    });

    it("should return correct key for Ethereum chain", () => {
      const ethConfig = testnetChains.Sepolia!;
      const signer = new Signer(ethConfig, mockAddress, mockOptions, mockWallet);

      expect(signer.chain()).toBe("Sepolia");
    });

    it("should return correct key for Aptos chain", () => {
      const aptosConfig = testnetChains.Aptos!;
      const signer = new Signer(
        aptosConfig,
        mockAddress,
        mockOptions,
        mockWallet
      );

      expect(signer.chain()).toBe("Aptos");
    });
  });

  describe("address()", () => {
    it("should return the address", () => {
      const signer = new Signer(
        mockChainConfig,
        mockAddress,
        mockOptions,
        mockWallet
      );

      expect(signer.address()).toBe(mockAddress);
    });

    it("should return different address when constructed with different value", () => {
      const differentAddress = "DifferentAddress456";
      const signer = new Signer(
        mockChainConfig,
        differentAddress,
        mockOptions,
        mockWallet
      );

      expect(signer.address()).toBe(differentAddress);
    });
  });

  describe("claimedTransactionHashes()", () => {
    it("should initially return empty string", () => {
      const signer = new Signer(
        mockChainConfig,
        mockAddress,
        mockOptions,
        mockWallet
      );

      expect(signer.claimedTransactionHashes()).toBe("");
    });

    it("should return updated value after internal modification", () => {
      const signer = new Signer(
        mockChainConfig,
        mockAddress,
        mockOptions,
        mockWallet
      );

      // Directly modify internal state for testing
      signer._claimedTransactionHashes = "txHash123";

      expect(signer.claimedTransactionHashes()).toBe("txHash123");
    });
  });

  describe("signer for different chain contexts", () => {
    it("should create signer for Solana context", () => {
      const solanaConfig = testnetChains.Solana!;
      const signer = new Signer(
        solanaConfig,
        "SolanaAddr",
        mockOptions,
        mockWallet
      );

      expect(signer._chain.context).toBe(Context.SOLANA);
    });

    it("should create signer for Ethereum context", () => {
      const ethConfig = testnetChains.Sepolia!;
      const signer = new Signer(ethConfig, "0xEthAddr", mockOptions, mockWallet);

      expect(signer._chain.context).toBe(Context.ETH);
    });

    it("should create signer for Aptos context", () => {
      const aptosConfig = testnetChains.Aptos!;
      const signer = new Signer(
        aptosConfig,
        "0xAptosAddr",
        mockOptions,
        mockWallet
      );

      expect(signer._chain.context).toBe(Context.APTOS);
    });

    it("should create signer for Sui context", () => {
      const suiConfig = testnetChains.Sui!;
      const signer = new Signer(suiConfig, "0xSuiAddr", mockOptions, mockWallet);

      expect(signer._chain.context).toBe(Context.SUI);
    });
  });

  // Note: signAndSend tests require mocking chain-specific implementations
  // and are covered in integration tests
});

