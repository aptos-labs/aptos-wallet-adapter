import { describe, it, expect, vi } from "vitest";
import { UserResponseStatus } from "@aptos-labs/wallet-standard";
import {
  AnyRawTransaction,
  AccountAuthenticatorAbstraction,
} from "@aptos-labs/ts-sdk";
import { WalletError } from "@solana/wallet-adapter-base";
import type { StandardWalletAdapter } from "@solana/wallet-standard-wallet-adapter-base";
import { signAptosTransactionWithSolana } from "../src/signAptosTransaction";
import { defaultSolanaAuthenticationFunction } from "../src/shared";
import {
  createConnectedMockSolanaWallet,
  TEST_SOLANA_KEYPAIR,
} from "./mocks/solanaWallet";

vi.mock("@aptos-labs/ts-sdk", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    generateSigningMessageForTransaction: vi.fn(() => new Uint8Array(32)),
    hashValues: vi.fn(() => new Uint8Array(32).fill(0xaa)),
    AbstractedAccount: {
      generateAccountAbstractionMessage: vi.fn(() => new Uint8Array(32)),
    },
  };
});

vi.mock("../src/createSiwsEnvelope", () => ({
  createSiwsEnvelopeForAptosTransaction: vi.fn(() => ({
    domain: "test.example.com",
    address: "test-address",
    nonce: "0x" + "aa".repeat(32),
    statement: "Test transaction statement",
  })),
}));

const TEST_DOMAIN = "test.example.com";
const FAKE_TX = {} as AnyRawTransaction;

function callSign(wallet: StandardWalletAdapter) {
  return signAptosTransactionWithSolana({
    solanaWallet: wallet,
    authenticationFunction: defaultSolanaAuthenticationFunction,
    rawTransaction: FAKE_TX,
    domain: TEST_DOMAIN,
  });
}

describe("signAptosTransactionWithSolana fallback behavior", () => {
  describe("when signIn succeeds", () => {
    it("should return an approved authenticator via signIn", async () => {
      const wallet = createConnectedMockSolanaWallet({
        keypair: TEST_SOLANA_KEYPAIR,
        supportSignIn: true,
      });

      const result = await callSign(wallet);

      expect(result.status).toBe(UserResponseStatus.APPROVED);
      if (result.status === UserResponseStatus.APPROVED) {
        expect(result.args).toBeInstanceOf(AccountAuthenticatorAbstraction);
      }
    });

    it("should not call signMessage when signIn succeeds", async () => {
      const wallet = createConnectedMockSolanaWallet({
        keypair: TEST_SOLANA_KEYPAIR,
        supportSignIn: true,
      });
      const signMessageSpy = vi.fn(wallet.signMessage!);
      (wallet as any).signMessage = signMessageSpy;

      await callSign(wallet);

      expect(signMessageSpy).not.toHaveBeenCalled();
    });
  });

  describe("when signIn is not available", () => {
    it("should use signMessage", async () => {
      const wallet = createConnectedMockSolanaWallet({
        keypair: TEST_SOLANA_KEYPAIR,
        supportSignIn: false,
      });

      const result = await callSign(wallet);

      expect(result.status).toBe(UserResponseStatus.APPROVED);
      if (result.status === UserResponseStatus.APPROVED) {
        expect(result.args).toBeInstanceOf(AccountAuthenticatorAbstraction);
      }
    });
  });

  describe("when signIn throws at runtime", () => {
    it("should fall back to signMessage for async non-WalletError", async () => {
      const wallet = createConnectedMockSolanaWallet({
        keypair: TEST_SOLANA_KEYPAIR,
        supportSignIn: true,
      });
      const signMessageSpy = vi.fn(wallet.signMessage!);
      (wallet as any).signIn = async () => {
        throw new Error("not implemented");
      };
      (wallet as any).signMessage = signMessageSpy;

      const result = await callSign(wallet);

      expect(signMessageSpy).toHaveBeenCalled();
      expect(result.status).toBe(UserResponseStatus.APPROVED);
      if (result.status === UserResponseStatus.APPROVED) {
        expect(result.args).toBeInstanceOf(AccountAuthenticatorAbstraction);
      }
    });

    it("should fall back to signMessage for synchronous non-WalletError", async () => {
      const wallet = createConnectedMockSolanaWallet({
        keypair: TEST_SOLANA_KEYPAIR,
        supportSignIn: true,
      });
      const signMessageSpy = vi.fn(wallet.signMessage!);
      (wallet as any).signIn = () => {
        throw new Error("not implemented");
      };
      (wallet as any).signMessage = signMessageSpy;

      const result = await callSign(wallet);

      expect(signMessageSpy).toHaveBeenCalled();
      expect(result.status).toBe(UserResponseStatus.APPROVED);
      if (result.status === UserResponseStatus.APPROVED) {
        expect(result.args).toBeInstanceOf(AccountAuthenticatorAbstraction);
      }
    });

    it("should rethrow if signMessage is not available", async () => {
      const wallet = createConnectedMockSolanaWallet({
        keypair: TEST_SOLANA_KEYPAIR,
        supportSignIn: true,
      });
      (wallet as any).signIn = async () => {
        throw new Error("not implemented");
      };
      (wallet as any).signMessage = undefined;

      await expect(callSign(wallet)).rejects.toThrow("not implemented");
    });

    it("should rethrow synchronous error if signMessage is not available", async () => {
      const wallet = createConnectedMockSolanaWallet({
        keypair: TEST_SOLANA_KEYPAIR,
        supportSignIn: true,
      });
      (wallet as any).signIn = () => {
        throw new Error("not implemented");
      };
      (wallet as any).signMessage = undefined;

      await expect(callSign(wallet)).rejects.toThrow("not implemented");
    });

    it("should NOT fall back when signIn throws a WalletError (non-standard rejection)", async () => {
      const wallet = createConnectedMockSolanaWallet({
        keypair: TEST_SOLANA_KEYPAIR,
        supportSignIn: true,
      });
      const signMessageSpy = vi.fn(wallet.signMessage!);
      (wallet as any).signIn = async () => {
        throw new WalletError("Request denied by user");
      };
      (wallet as any).signMessage = signMessageSpy;

      await expect(callSign(wallet)).rejects.toThrow("Request denied by user");
      expect(signMessageSpy).not.toHaveBeenCalled();
    });

    it("should NOT fall back when signIn throws a synchronous WalletError", async () => {
      const wallet = createConnectedMockSolanaWallet({
        keypair: TEST_SOLANA_KEYPAIR,
        supportSignIn: true,
      });
      const signMessageSpy = vi.fn(wallet.signMessage!);
      (wallet as any).signIn = () => {
        throw new WalletError("Request denied by user");
      };
      (wallet as any).signMessage = signMessageSpy;

      await expect(callSign(wallet)).rejects.toThrow("Request denied by user");
      expect(signMessageSpy).not.toHaveBeenCalled();
    });

    it("should return rejection for WalletError with standard message", async () => {
      const wallet = createConnectedMockSolanaWallet({
        keypair: TEST_SOLANA_KEYPAIR,
        supportSignIn: true,
      });
      const signMessageSpy = vi.fn(wallet.signMessage!);
      (wallet as any).signIn = async () => {
        throw new WalletError("User rejected the request.");
      };
      (wallet as any).signMessage = signMessageSpy;

      const result = await callSign(wallet);

      expect(result.status).toBe(UserResponseStatus.REJECTED);
      expect(signMessageSpy).not.toHaveBeenCalled();
    });
  });

  describe("when neither signIn nor signMessage is available", () => {
    it("should throw 'does not support' error", async () => {
      const wallet = createConnectedMockSolanaWallet({
        keypair: TEST_SOLANA_KEYPAIR,
        supportSignIn: false,
      });
      (wallet as any).signMessage = undefined;

      await expect(callSign(wallet)).rejects.toThrow(
        "does not support SIWS or signMessage",
      );
    });
  });
});
