import { describe, it, expect, beforeEach } from "vitest";
import { UserResponseStatus } from "@aptos-labs/wallet-standard";
import { Ed25519Signature } from "@aptos-labs/ts-sdk";
import { signAptosMessageWithSolana } from "../src/signAptosMessage";
import { defaultSolanaAuthenticationFunction } from "../src/shared";
import {
  createConnectedMockSolanaWallet,
  createMockSolanaWallet,
  TEST_SOLANA_KEYPAIR,
} from "./mocks/solanaWallet";
import type { StandardWalletAdapter } from "@solana/wallet-standard-wallet-adapter-base";

describe("signAptosMessage", () => {
  let mockWallet: StandardWalletAdapter;
  const testDomain = "test.example.com";

  beforeEach(() => {
    mockWallet = createConnectedMockSolanaWallet({
      keypair: TEST_SOLANA_KEYPAIR,
    });
  });

  describe("signAptosMessageWithSolana", () => {
    it("should sign a simple message", async () => {
      const response = await signAptosMessageWithSolana({
        solanaWallet: mockWallet,
        authenticationFunction: defaultSolanaAuthenticationFunction,
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

    it("should return Ed25519Signature", async () => {
      const response = await signAptosMessageWithSolana({
        solanaWallet: mockWallet,
        authenticationFunction: defaultSolanaAuthenticationFunction,
        messageInput: {
          message: "Test message",
          nonce: "nonce123",
        },
        domain: testDomain,
      });

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args.signature).toBeInstanceOf(Ed25519Signature);
      }
    });

    it("should include full message in response", async () => {
      const response = await signAptosMessageWithSolana({
        solanaWallet: mockWallet,
        authenticationFunction: defaultSolanaAuthenticationFunction,
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
      const response = await signAptosMessageWithSolana({
        solanaWallet: mockWallet,
        authenticationFunction: defaultSolanaAuthenticationFunction,
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
      const response = await signAptosMessageWithSolana({
        solanaWallet: mockWallet,
        authenticationFunction: defaultSolanaAuthenticationFunction,
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
      const response = await signAptosMessageWithSolana({
        solanaWallet: mockWallet,
        authenticationFunction: defaultSolanaAuthenticationFunction,
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

    it("should throw if wallet does not support signMessage", async () => {
      const walletWithoutSignMessage = {
        ...mockWallet,
        signMessage: undefined,
      } as unknown as StandardWalletAdapter;

      await expect(
        signAptosMessageWithSolana({
          solanaWallet: walletWithoutSignMessage,
          authenticationFunction: defaultSolanaAuthenticationFunction,
          messageInput: {
            message: "Test",
            nonce: "test",
          },
          domain: testDomain,
        })
      ).rejects.toThrow("solana:signMessage not available");
    });

    it("should throw if account not connected", async () => {
      const disconnectedWallet = createMockSolanaWallet({
        keypair: TEST_SOLANA_KEYPAIR,
      });
      // Wallet is not connected by default

      await expect(
        signAptosMessageWithSolana({
          solanaWallet: disconnectedWallet,
          authenticationFunction: defaultSolanaAuthenticationFunction,
          messageInput: {
            message: "Test",
            nonce: "test",
          },
          domain: testDomain,
        })
      ).rejects.toThrow("Account not connected");
    });
  });
});

