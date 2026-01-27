import { describe, it, expect } from "vitest";
import { UserResponseStatus } from "@aptos-labs/wallet-standard";
import {
  defaultEthereumAuthenticationFunction,
  wrapEthersUserResponse,
} from "../src/shared";

describe("shared", () => {
  describe("defaultEthereumAuthenticationFunction", () => {
    it("should be the correct authentication function", () => {
      expect(defaultEthereumAuthenticationFunction).toBe(
        "0x1::ethereum_derivable_account::authenticate"
      );
    });

    it("should be a valid Move function identifier format", () => {
      expect(defaultEthereumAuthenticationFunction).toMatch(
        /^0x[a-f0-9]+::\w+::\w+$/i
      );
    });
  });

  describe("wrapEthersUserResponse", () => {
    it("should wrap successful promise as approved user response", async () => {
      const testValue = { data: "test" };
      const promise = Promise.resolve(testValue);

      const response = await wrapEthersUserResponse(promise);

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args).toEqual(testValue);
      }
    });

    it("should wrap string result as approved", async () => {
      const promise = Promise.resolve("0x1234");

      const response = await wrapEthersUserResponse(promise);

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args).toBe("0x1234");
      }
    });

    it("should convert ACTION_REJECTED error to rejection", async () => {
      // Create an ethers-style ACTION_REJECTED error
      const error = new Error("User rejected the request");
      (error as any).code = "ACTION_REJECTED";

      const promise = Promise.reject(error);

      const response = await wrapEthersUserResponse(promise);

      expect(response.status).toBe(UserResponseStatus.REJECTED);
    });

    it("should re-throw non-rejection errors", async () => {
      const error = new Error("Network error");
      const promise = Promise.reject(error);

      await expect(wrapEthersUserResponse(promise)).rejects.toThrow(
        "Network error"
      );
    });

    it("should re-throw errors with different codes", async () => {
      const error = new Error("Invalid params");
      (error as any).code = "INVALID_ARGUMENT";

      const promise = Promise.reject(error);

      await expect(wrapEthersUserResponse(promise)).rejects.toThrow(
        "Invalid params"
      );
    });

    it("should handle null/undefined results", async () => {
      const nullPromise = Promise.resolve(null);
      const undefinedPromise = Promise.resolve(undefined);

      const nullResponse = await wrapEthersUserResponse(nullPromise);
      const undefinedResponse = await wrapEthersUserResponse(undefinedPromise);

      expect(nullResponse.status).toBe(UserResponseStatus.APPROVED);
      expect(undefinedResponse.status).toBe(UserResponseStatus.APPROVED);
    });

    it("should handle array results", async () => {
      const addresses = ["0x123", "0x456"];
      const promise = Promise.resolve(addresses);

      const response = await wrapEthersUserResponse(promise);

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args).toEqual(addresses);
      }
    });
  });
});

