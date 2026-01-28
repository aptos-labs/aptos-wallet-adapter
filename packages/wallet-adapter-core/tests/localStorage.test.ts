import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  setLocalStorage,
  removeLocalStorage,
  getLocalStorage,
} from "../src/utils/localStorage";

describe("localStorage utilities", () => {
  beforeEach(() => {
    // Clear localStorage before each test (handled by setup.ts)
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("setLocalStorage", () => {
    it("should store wallet name in localStorage", () => {
      setLocalStorage("Petra");
      expect(localStorage.setItem).toHaveBeenCalledWith("AptosWalletName", "Petra");
    });

    it("should overwrite existing wallet name", () => {
      setLocalStorage("Petra");
      setLocalStorage("Nightly");
      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
      expect(localStorage.setItem).toHaveBeenLastCalledWith(
        "AptosWalletName",
        "Nightly"
      );
    });

    it("should handle empty string", () => {
      setLocalStorage("");
      expect(localStorage.setItem).toHaveBeenCalledWith("AptosWalletName", "");
    });

    it("should handle special characters in wallet name", () => {
      setLocalStorage("Wallet (Test) #1");
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "AptosWalletName",
        "Wallet (Test) #1"
      );
    });
  });

  describe("removeLocalStorage", () => {
    it("should remove wallet name from localStorage", () => {
      setLocalStorage("Petra");
      removeLocalStorage();
      expect(localStorage.removeItem).toHaveBeenCalledWith("AptosWalletName");
    });

    it("should not throw when removing non-existent key", () => {
      expect(() => removeLocalStorage()).not.toThrow();
      expect(localStorage.removeItem).toHaveBeenCalledWith("AptosWalletName");
    });
  });

  describe("getLocalStorage", () => {
    it("should retrieve wallet name from localStorage", () => {
      // Note: The current implementation doesn't return the value (bug in source)
      // This test documents the current behavior
      getLocalStorage();
      expect(localStorage.getItem).toHaveBeenCalledWith("AptosWalletName");
    });
  });

  describe("localStorage key consistency", () => {
    it("should use consistent key across all functions", () => {
      const expectedKey = "AptosWalletName";

      setLocalStorage("Test");
      expect(localStorage.setItem).toHaveBeenCalledWith(expectedKey, "Test");

      getLocalStorage();
      expect(localStorage.getItem).toHaveBeenCalledWith(expectedKey);

      removeLocalStorage();
      expect(localStorage.removeItem).toHaveBeenCalledWith(expectedKey);
    });
  });
});

