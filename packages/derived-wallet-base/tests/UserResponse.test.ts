import { describe, it, expect } from "vitest";
import { UserResponseStatus } from "@aptos-labs/wallet-standard";
import {
  makeUserApproval,
  makeUserRejection,
  mapUserResponse,
} from "../src/UserResponse";

describe("UserResponse", () => {
  describe("makeUserApproval", () => {
    it("should create an approved response with the given args", () => {
      const args = { signature: "0x123", hash: "0xabc" };
      const response = makeUserApproval(args);

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      expect(response.args).toEqual(args);
    });

    it("should work with primitive args", () => {
      const response = makeUserApproval("simple-string");

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      expect(response.args).toBe("simple-string");
    });

    it("should work with null args", () => {
      const response = makeUserApproval(null);

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      expect(response.args).toBeNull();
    });
  });

  describe("makeUserRejection", () => {
    it("should create a rejected response", () => {
      const response = makeUserRejection();

      expect(response.status).toBe(UserResponseStatus.REJECTED);
    });
  });

  describe("mapUserResponse", () => {
    describe("with sync mapping function", () => {
      it("should map approved response args", () => {
        const original = makeUserApproval({ value: 10 });
        const mapped = mapUserResponse(original, (args) => ({
          value: args.value * 2,
        }));

        expect(mapped.status).toBe(UserResponseStatus.APPROVED);
        if (mapped.status === UserResponseStatus.APPROVED) {
          expect(mapped.args).toEqual({ value: 20 });
        }
      });

      it("should pass through rejected response without calling map function", () => {
        const original = makeUserRejection();
        let mapFnCalled = false;

        const mapped = mapUserResponse(original, () => {
          mapFnCalled = true;
          return { transformed: true };
        });

        expect(mapped.status).toBe(UserResponseStatus.REJECTED);
        expect(mapFnCalled).toBe(false);
      });

      it("should handle type transformations", () => {
        const original = makeUserApproval({ count: 5 });
        const mapped = mapUserResponse(original, (args) =>
          `count-${args.count}`
        );

        expect(mapped.status).toBe(UserResponseStatus.APPROVED);
        if (mapped.status === UserResponseStatus.APPROVED) {
          expect(mapped.args).toBe("count-5");
        }
      });
    });

    describe("with async mapping function", () => {
      it("should map approved response args asynchronously", async () => {
        const original = makeUserApproval({ value: 10 });
        const mapped = await mapUserResponse(original, async (args) => ({
          value: args.value * 3,
        }));

        expect(mapped.status).toBe(UserResponseStatus.APPROVED);
        if (mapped.status === UserResponseStatus.APPROVED) {
          expect(mapped.args).toEqual({ value: 30 });
        }
      });

      it("should pass through rejected response without calling async map function", async () => {
        const original = makeUserRejection();
        let mapFnCalled = false;

        const mapped = mapUserResponse(original, async () => {
          mapFnCalled = true;
          return { transformed: true };
        });

        // For rejected responses, mapUserResponse returns synchronously
        expect(mapped).not.toBeInstanceOf(Promise);
        expect((mapped as any).status).toBe(UserResponseStatus.REJECTED);
        expect(mapFnCalled).toBe(false);
      });

      it("should handle async transformations that take time", async () => {
        const original = makeUserApproval("input");
        const mapped = await mapUserResponse(original, async (args) => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          return `processed-${args}`;
        });

        expect(mapped.status).toBe(UserResponseStatus.APPROVED);
        if (mapped.status === UserResponseStatus.APPROVED) {
          expect(mapped.args).toBe("processed-input");
        }
      });
    });
  });
});

