import { describe, it, expect } from "vitest";
import { UserResponseStatus } from "@aptos-labs/wallet-standard";
import {
  defaultAuthenticationFunction,
  wrapSuiUserResponse,
} from "../src/shared";

describe("shared", () => {
  describe("defaultAuthenticationFunction", () => {
    it("should be the correct authentication function", () => {
      expect(defaultAuthenticationFunction).toBe(
        "0x1::sui_derivable_account::authenticate"
      );
    });

    it("should be a valid Move function identifier format", () => {
      expect(defaultAuthenticationFunction).toMatch(
        /^0x[a-f0-9]+::\w+::\w+$/i
      );
    });
  });

  describe("wrapSuiUserResponse", () => {
    it("should wrap successful promise as approved user response", async () => {
      const testValue = { data: "test" };
      const promise = Promise.resolve(testValue);

      const response = await wrapSuiUserResponse(promise);

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args).toEqual(testValue);
      }
    });

    it("should wrap Uint8Array result as approved", async () => {
      const signature = new Uint8Array([1, 2, 3, 4]);
      const promise = Promise.resolve(signature);

      const response = await wrapSuiUserResponse(promise);

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args).toEqual(signature);
      }
    });

    it("should convert error with code 4001 to rejection (OKX wallet)", async () => {
      const error = { code: 4001, message: "User rejected" };
      const promise = Promise.reject(error);

      const response = await wrapSuiUserResponse(promise);

      expect(response.status).toBe(UserResponseStatus.REJECTED);
    });

    it("should convert error with rejected message to rejection", async () => {
      const error = new Error("Transaction rejected by user");
      const promise = Promise.reject(error);

      const response = await wrapSuiUserResponse(promise);

      expect(response.status).toBe(UserResponseStatus.REJECTED);
    });

    it("should convert error with denied message to rejection", async () => {
      const error = new Error("Request denied");
      const promise = Promise.reject(error);

      const response = await wrapSuiUserResponse(promise);

      expect(response.status).toBe(UserResponseStatus.REJECTED);
    });

    it("should re-throw errors with different messages", async () => {
      const error = new Error("Connection failed");
      const promise = Promise.reject(error);

      await expect(wrapSuiUserResponse(promise)).rejects.toThrow(
        "Connection failed"
      );
    });

    it("should re-throw non-object errors", async () => {
      const promise = Promise.reject("string error");

      await expect(wrapSuiUserResponse(promise)).rejects.toBe("string error");
    });

    it("should handle null/undefined results", async () => {
      const nullPromise = Promise.resolve(null);
      const undefinedPromise = Promise.resolve(undefined);

      const nullResponse = await wrapSuiUserResponse(nullPromise);
      const undefinedResponse = await wrapSuiUserResponse(undefinedPromise);

      expect(nullResponse.status).toBe(UserResponseStatus.APPROVED);
      expect(undefinedResponse.status).toBe(UserResponseStatus.APPROVED);
    });

    it("should handle object results", async () => {
      const signResult = {
        signature: "base64signature",
        bytes: "base64bytes",
      };
      const promise = Promise.resolve(signResult);

      const response = await wrapSuiUserResponse(promise);

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args).toEqual(signResult);
      }
    });

    it("should be case insensitive when checking rejection message", async () => {
      const lowerCaseError = new Error("user rejected the request");
      const upperCaseError = new Error("USER REJECTED THE REQUEST");
      const mixedCaseError = new Error("User REJECTED The Request");

      const response1 = await wrapSuiUserResponse(Promise.reject(lowerCaseError));
      const response2 = await wrapSuiUserResponse(Promise.reject(upperCaseError));
      const response3 = await wrapSuiUserResponse(Promise.reject(mixedCaseError));

      expect(response1.status).toBe(UserResponseStatus.REJECTED);
      expect(response2.status).toBe(UserResponseStatus.REJECTED);
      expect(response3.status).toBe(UserResponseStatus.REJECTED);
    });
  });
});

