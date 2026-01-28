import { describe, it, expect, beforeEach } from "vitest";
import { UserResponseStatus } from "@aptos-labs/wallet-standard";
import type { Wallet } from "@mysten/wallet-standard";
import { signAptosMessageWithSui } from "../src/signAptosMessage";
import { defaultAuthenticationFunction } from "../src/shared";
import { SuiDerivedEd25519Signature } from "../src/SuiDerivedSignature";
import {
  createConnectedMockSuiWallet,
  createMockSuiWallet,
  createWalletWithoutSignFeature,
  TEST_SUI_KEYPAIR,
} from "./mocks/suiWallet";

describe("signAptosMessage", () => {
  let mockWallet: Wallet;
  const testDomain = "test.example.com";

  beforeEach(() => {
    mockWallet = createConnectedMockSuiWallet({
      keypair: TEST_SUI_KEYPAIR,
    });
  });

  describe("signAptosMessageWithSui", () => {
    it("should sign a simple message", async () => {
      const response = await signAptosMessageWithSui({
        suiWallet: mockWallet,
        suiAccount: mockWallet.accounts[0],
        authenticationFunction: defaultAuthenticationFunction,
        messageInput: {
          message: "Hello, Aptos!",
          nonce: "12345678",
        },
        domain: testDomain,
      });

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args.message).toBe("Hello, Aptos!");
        expect(response.args.nonce).toBe("12345678");
        expect(response.args.prefix).toBe("APTOS");
      }
    });

    it("should return SuiDerivedEd25519Signature", async () => {
      const response = await signAptosMessageWithSui({
        suiWallet: mockWallet,
        suiAccount: mockWallet.accounts[0],
        authenticationFunction: defaultAuthenticationFunction,
        messageInput: {
          message: "Test message",
          nonce: "nonce123",
        },
        domain: testDomain,
      });

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args.signature).toBeInstanceOf(
          SuiDerivedEd25519Signature
        );
      }
    });

    it("should include full message in response", async () => {
      const response = await signAptosMessageWithSui({
        suiWallet: mockWallet,
        suiAccount: mockWallet.accounts[0],
        authenticationFunction: defaultAuthenticationFunction,
        messageInput: {
          message: "My test message",
          nonce: "abc123",
        },
        domain: testDomain,
      });

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args.fullMessage).toBeDefined();
        expect(typeof response.args.fullMessage).toBe("string");
        // Full message should contain the original message
        expect(response.args.fullMessage).toContain("My test message");
      }
    });

    it("should handle message with address flag", async () => {
      const response = await signAptosMessageWithSui({
        suiWallet: mockWallet,
        suiAccount: mockWallet.accounts[0],
        authenticationFunction: defaultAuthenticationFunction,
        messageInput: {
          message: "Message with address",
          nonce: "addr-nonce",
          address: true,
        },
        domain: testDomain,
      });

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        // When address flag is true, fullMessage should contain an Aptos address
        expect(response.args.fullMessage).toContain("0x");
      }
    });

    it("should handle message with application flag", async () => {
      const response = await signAptosMessageWithSui({
        suiWallet: mockWallet,
        suiAccount: mockWallet.accounts[0],
        authenticationFunction: defaultAuthenticationFunction,
        messageInput: {
          message: "Message with application",
          nonce: "app-nonce",
          application: true,
        },
        domain: testDomain,
      });

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        // When application flag is true, fullMessage should contain the origin
        expect(response.args.fullMessage).toContain("test.example.com");
      }
    });

    it("should handle message with chainId", async () => {
      const response = await signAptosMessageWithSui({
        suiWallet: mockWallet,
        suiAccount: mockWallet.accounts[0],
        authenticationFunction: defaultAuthenticationFunction,
        messageInput: {
          message: "Message with chain ID",
          nonce: "chain-nonce",
          chainId: 2, // Testnet
        },
        domain: testDomain,
      });

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        // Chain ID should be included in full message
        expect(response.args.fullMessage).toContain("2");
      }
    });

    it("should throw if wallet does not support signPersonalMessage", async () => {
      const walletWithoutSignFeature = createWalletWithoutSignFeature({
        keypair: TEST_SUI_KEYPAIR,
      });

      await expect(
        signAptosMessageWithSui({
          suiWallet: walletWithoutSignFeature,
          suiAccount: walletWithoutSignFeature.accounts[0],
          authenticationFunction: defaultAuthenticationFunction,
          messageInput: {
            message: "Test",
            nonce: "test",
          },
          domain: testDomain,
        })
      ).rejects.toThrow("sui:signPersonalMessage not available");
    });

    it("should throw if account not connected", async () => {
      const disconnectedWallet = createMockSuiWallet({
        keypair: TEST_SUI_KEYPAIR,
      });
      // Wallet is not connected by default - accounts array is empty

      await expect(
        signAptosMessageWithSui({
          suiWallet: disconnectedWallet,
          suiAccount: { address: "" } as any, // Empty address
          authenticationFunction: defaultAuthenticationFunction,
          messageInput: {
            message: "Test",
            nonce: "test",
          },
          domain: testDomain,
        })
      ).rejects.toThrow("Account not connected");
    });

    it("should handle different nonce values", async () => {
      const response1 = await signAptosMessageWithSui({
        suiWallet: mockWallet,
        suiAccount: mockWallet.accounts[0],
        authenticationFunction: defaultAuthenticationFunction,
        messageInput: {
          message: "Same message",
          nonce: "nonce1",
        },
        domain: testDomain,
      });

      const response2 = await signAptosMessageWithSui({
        suiWallet: mockWallet,
        suiAccount: mockWallet.accounts[0],
        authenticationFunction: defaultAuthenticationFunction,
        messageInput: {
          message: "Same message",
          nonce: "nonce2",
        },
        domain: testDomain,
      });

      expect(response1.status).toBe(UserResponseStatus.APPROVED);
      expect(response2.status).toBe(UserResponseStatus.APPROVED);

      if (
        response1.status === UserResponseStatus.APPROVED &&
        response2.status === UserResponseStatus.APPROVED
      ) {
        expect(response1.args.nonce).toBe("nonce1");
        expect(response2.args.nonce).toBe("nonce2");
      }
    });
  });
});

