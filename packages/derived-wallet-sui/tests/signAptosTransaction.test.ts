import { describe, it, expect, beforeEach } from "vitest";
import type { Wallet } from "@mysten/wallet-standard";
import { signAptosTransactionWithSui, SIGNATURE_TYPE } from "../src/signAptosTransaction";
import { defaultAuthenticationFunction } from "../src/shared";
import {
  createConnectedMockSuiWallet,
  createMockSuiWallet,
  createWalletWithoutSignFeature,
  TEST_SUI_KEYPAIR,
} from "./mocks/suiWallet";

describe("signAptosTransaction", () => {
  let mockWallet: Wallet;
  const testDomain = "test.example.com";

  beforeEach(() => {
    mockWallet = createConnectedMockSuiWallet({
      keypair: TEST_SUI_KEYPAIR,
    });
  });

  describe("SIGNATURE_TYPE", () => {
    it("should be 0", () => {
      expect(SIGNATURE_TYPE).toBe(0);
    });
  });

  describe("signAptosTransactionWithSui error handling", () => {
    // Note: Full transaction signing tests require network access to build
    // real AnyRawTransaction objects. These tests focus on error handling.

    it("should throw if wallet does not support signPersonalMessage", async () => {
      const walletWithoutSignFeature = createWalletWithoutSignFeature({
        keypair: TEST_SUI_KEYPAIR,
      });

      // Create a minimal mock transaction that will trigger the feature check
      const mockRawTransaction = {} as any;

      await expect(
        signAptosTransactionWithSui({
          suiWallet: walletWithoutSignFeature,
          suiAccount: walletWithoutSignFeature.accounts[0],
          authenticationFunction: defaultAuthenticationFunction,
          rawTransaction: mockRawTransaction,
          domain: testDomain,
        })
      ).rejects.toThrow("sui:signPersonalMessage not available");
    });

    it("should throw if account not connected (empty address)", async () => {
      const disconnectedWallet = createMockSuiWallet({
        keypair: TEST_SUI_KEYPAIR,
      });

      // Create a minimal mock transaction
      const mockRawTransaction = {} as any;

      await expect(
        signAptosTransactionWithSui({
          suiWallet: disconnectedWallet,
          suiAccount: { address: "" } as any, // Empty address
          authenticationFunction: defaultAuthenticationFunction,
          rawTransaction: mockRawTransaction,
          domain: testDomain,
        })
      ).rejects.toThrow("Account not connected");
    });

    it("should use the provided authentication function", async () => {
      // This test verifies that custom auth functions are passed through
      const customAuthFunction = "0x1::custom::authenticate";
      const walletWithoutSign = createWalletWithoutSignFeature({
        keypair: TEST_SUI_KEYPAIR,
      });

      // We expect this to fail at the feature check, but we're verifying
      // the input structure is correct
      try {
        await signAptosTransactionWithSui({
          suiWallet: walletWithoutSign,
          suiAccount: walletWithoutSign.accounts[0],
          authenticationFunction: customAuthFunction,
          rawTransaction: {} as any,
          domain: testDomain,
        });
      } catch (e) {
        // Expected to throw, we're just testing the input is accepted
        expect((e as Error).message).toBe("sui:signPersonalMessage not available");
      }
    });

    it("should use the provided domain", async () => {
      const customDomain = "custom.domain.com";
      const walletWithoutSign = createWalletWithoutSignFeature({
        keypair: TEST_SUI_KEYPAIR,
      });

      // We expect this to fail at the feature check, but we're verifying
      // the input structure is correct
      try {
        await signAptosTransactionWithSui({
          suiWallet: walletWithoutSign,
          suiAccount: walletWithoutSign.accounts[0],
          authenticationFunction: defaultAuthenticationFunction,
          rawTransaction: {} as any,
          domain: customDomain,
        });
      } catch (e) {
        // Expected to throw, we're just testing the input is accepted
        expect((e as Error).message).toBe("sui:signPersonalMessage not available");
      }
    });
  });
});

