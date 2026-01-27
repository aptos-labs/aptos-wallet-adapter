import { describe, it, expect, beforeEach } from "vitest";
import { BrowserProvider } from "ethers";
import { UserResponseStatus } from "@aptos-labs/wallet-standard";
import { signAptosMessageWithEthereum } from "../src/signAptosMessage";
import { EIP1193PersonalSignature } from "../src/EIP1193DerivedSignature";
import { defaultEthereumAuthenticationFunction } from "../src/shared";
import {
  createMockEIP1193Provider,
  TEST_PRIVATE_KEY,
  TEST_ETHEREUM_ADDRESS,
} from "./mocks/eip1193Provider";

describe("signAptosMessage", () => {
  let mockProvider: ReturnType<typeof createMockEIP1193Provider>;
  let browserProvider: BrowserProvider;

  beforeEach(() => {
    mockProvider = createMockEIP1193Provider({ privateKey: TEST_PRIVATE_KEY });
    browserProvider = new BrowserProvider(mockProvider);
  });

  describe("signAptosMessageWithEthereum", () => {
    it("should sign a simple message", async () => {
      const response = await signAptosMessageWithEthereum({
        eip1193Provider: browserProvider,
        authenticationFunction: defaultEthereumAuthenticationFunction,
        messageInput: {
          message: "Hello, Aptos!",
          nonce: "12345678",
        },
      });

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args.message).toBe("Hello, Aptos!");
        expect(response.args.nonce).toBe("12345678");
        expect(response.args.prefix).toBe("APTOS");
      }
    });

    it("should return EIP1193PersonalSignature", async () => {
      const response = await signAptosMessageWithEthereum({
        eip1193Provider: browserProvider,
        authenticationFunction: defaultEthereumAuthenticationFunction,
        messageInput: {
          message: "Test message",
          nonce: "nonce123",
        },
      });

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args.signature).toBeInstanceOf(EIP1193PersonalSignature);
      }
    });

    it("should include full message in response", async () => {
      const response = await signAptosMessageWithEthereum({
        eip1193Provider: browserProvider,
        authenticationFunction: defaultEthereumAuthenticationFunction,
        messageInput: {
          message: "My test message",
          nonce: "abc123",
        },
      });

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args.fullMessage).toBeDefined();
        expect(typeof response.args.fullMessage).toBe("string");
        // Full message should contain the original message
        expect(response.args.fullMessage).toContain("My test message");
      }
    });

    it("should work with raw EIP1193 provider", async () => {
      const response = await signAptosMessageWithEthereum({
        eip1193Provider: mockProvider,
        authenticationFunction: defaultEthereumAuthenticationFunction,
        messageInput: {
          message: "Test with raw provider",
          nonce: "raw-nonce",
        },
      });

      expect(response.status).toBe(UserResponseStatus.APPROVED);
    });

    it("should handle message with address flag", async () => {
      const response = await signAptosMessageWithEthereum({
        eip1193Provider: browserProvider,
        authenticationFunction: defaultEthereumAuthenticationFunction,
        messageInput: {
          message: "Message with address",
          nonce: "addr-nonce",
          address: true,
        },
      });

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        // When address flag is true, fullMessage should contain an Aptos address
        expect(response.args.fullMessage).toContain("0x");
      }
    });

    it("should handle message with application flag", async () => {
      const response = await signAptosMessageWithEthereum({
        eip1193Provider: browserProvider,
        authenticationFunction: defaultEthereumAuthenticationFunction,
        messageInput: {
          message: "Message with application",
          nonce: "app-nonce",
          application: true,
        },
      });

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        // When application flag is true, fullMessage should contain the origin
        expect(response.args.fullMessage).toContain("test.example.com");
      }
    });

    it("should handle message with chainId", async () => {
      const response = await signAptosMessageWithEthereum({
        eip1193Provider: browserProvider,
        authenticationFunction: defaultEthereumAuthenticationFunction,
        messageInput: {
          message: "Message with chain ID",
          nonce: "chain-nonce",
          chainId: 2, // Testnet
        },
      });

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        // Chain ID should be included
        expect(response.args.fullMessage).toContain("2");
      }
    });

    it("should use specified ethereum address when provided", async () => {
      const response = await signAptosMessageWithEthereum({
        eip1193Provider: browserProvider,
        ethereumAddress: TEST_ETHEREUM_ADDRESS as `0x${string}`,
        authenticationFunction: defaultEthereumAuthenticationFunction,
        messageInput: {
          message: "Message for specific address",
          nonce: "specific-nonce",
        },
      });

      expect(response.status).toBe(UserResponseStatus.APPROVED);
    });

    it("should throw if account not connected", async () => {
      // Create a provider that returns no accounts
      const emptyProvider = {
        request: async ({ method }: { method: string }) => {
          if (method === "eth_accounts" || method === "eth_requestAccounts") {
            return [];
          }
          if (method === "eth_chainId") {
            return "0x1";
          }
          throw new Error("Unknown method");
        },
      };

      await expect(
        signAptosMessageWithEthereum({
          eip1193Provider: new BrowserProvider(emptyProvider as any),
          authenticationFunction: defaultEthereumAuthenticationFunction,
          messageInput: {
            message: "Test",
            nonce: "test",
          },
        })
      ).rejects.toThrow("Account not connected");
    });

    it("should throw if specified ethereum address not found", async () => {
      await expect(
        signAptosMessageWithEthereum({
          eip1193Provider: browserProvider,
          ethereumAddress: "0x0000000000000000000000000000000000000000",
          authenticationFunction: defaultEthereumAuthenticationFunction,
          messageInput: {
            message: "Test",
            nonce: "test",
          },
        })
      ).rejects.toThrow("Account not connected");
    });
  });
});

