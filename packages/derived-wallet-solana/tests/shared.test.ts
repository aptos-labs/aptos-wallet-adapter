import { describe, it, expect } from "vitest";
import { UserResponseStatus } from "@aptos-labs/wallet-standard";
import { WalletError } from "@solana/wallet-adapter-base";
import {
  defaultSolanaAuthenticationFunction,
  wrapSolanaUserResponse,
} from "../src/shared";

describe("shared", () => {
  describe("defaultSolanaAuthenticationFunction", () => {
    it("should be the correct authentication function", () => {
      expect(defaultSolanaAuthenticationFunction).toBe(
        "0x1::solana_derivable_account::authenticate",
      );
    });

    it("should be a valid Move function identifier format", () => {
      expect(defaultSolanaAuthenticationFunction).toMatch(
        /^0x[a-f0-9]+::\w+::\w+$/i,
      );
    });
  });

  describe("wrapSolanaUserResponse", () => {
    it("should wrap successful promise as approved user response", async () => {
      const testValue = { data: "test" };
      const promise = Promise.resolve(testValue);

      const response = await wrapSolanaUserResponse(promise);

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args).toEqual(testValue);
      }
    });

    it("should wrap Uint8Array result as approved", async () => {
      const signature = new Uint8Array([1, 2, 3, 4]);
      const promise = Promise.resolve(signature);

      const response = await wrapSolanaUserResponse(promise);

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args).toEqual(signature);
      }
    });

    it("should convert WalletError with rejection message to rejection", async () => {
      const error = new WalletError("User rejected the request.");
      const promise = Promise.reject(error);

      const response = await wrapSolanaUserResponse(promise);

      expect(response.status).toBe(UserResponseStatus.REJECTED);
    });

    it("should re-throw WalletError with different message", async () => {
      const error = new WalletError("Connection failed");
      const promise = Promise.reject(error);

      await expect(wrapSolanaUserResponse(promise)).rejects.toThrow(
        "Connection failed",
      );
    });

    it("should re-throw non-WalletError errors", async () => {
      const error = new Error("Network error");
      const promise = Promise.reject(error);

      await expect(wrapSolanaUserResponse(promise)).rejects.toThrow(
        "Network error",
      );
    });

    it("should handle null/undefined results", async () => {
      const nullPromise = Promise.resolve(null);
      const undefinedPromise = Promise.resolve(undefined);

      const nullResponse = await wrapSolanaUserResponse(nullPromise);
      const undefinedResponse = await wrapSolanaUserResponse(undefinedPromise);

      expect(nullResponse.status).toBe(UserResponseStatus.APPROVED);
      expect(undefinedResponse.status).toBe(UserResponseStatus.APPROVED);
    });

    it("should handle object results", async () => {
      const signInResult = {
        signature: new Uint8Array([1, 2, 3]),
        signatureType: "ed25519",
      };
      const promise = Promise.resolve(signInResult);

      const response = await wrapSolanaUserResponse(promise);

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args).toEqual(signInResult);
      }
    });
  });
});
