import { describe, it, expect } from "vitest";
import {
  WalletError,
  WalletNotSelectedError,
  WalletNotReadyError,
  WalletLoadError,
  WalletConfigError,
  WalletConnectionError,
  WalletDisconnectedError,
  WalletDisconnectionError,
  WalletAccountError,
  WalletGetNetworkError,
  WalletAccountChangeError,
  WalletNetworkChangeError,
  WalletPublicKeyError,
  WalletKeypairError,
  WalletNotConnectedError,
  WalletSendTransactionError,
  WalletSignMessageError,
  WalletSignMessageAndVerifyError,
  WalletSignAndSubmitMessageError,
  WalletSignTransactionError,
  WalletTimeoutError,
  WalletWindowBlockedError,
  WalletWindowClosedError,
  WalletResponseError,
  WalletNotSupportedMethod,
  WalletChangeNetworkError,
  WalletSubmitTransactionError,
  WalletNotFoundError,
} from "../src/error";

describe("Error Classes", () => {
  describe("WalletError (base class)", () => {
    it("should create error with message", () => {
      const error = new WalletError("Test error message");
      expect(error.message).toBe("Test error message");
      expect(error).toBeInstanceOf(Error);
    });

    it("should create error with message and inner error", () => {
      const innerError = new Error("Inner error");
      const error = new WalletError("Outer error", innerError);
      expect(error.message).toBe("Outer error");
      expect(error.error).toBe(innerError);
    });

    it("should create error without message", () => {
      const error = new WalletError();
      expect(error.message).toBe("");
    });
  });

  describe("WalletNotSelectedError", () => {
    it("should have correct name", () => {
      const error = new WalletNotSelectedError("No wallet selected");
      expect(error.name).toBe("WalletNotSelectedError");
      expect(error.message).toBe("No wallet selected");
    });

    it("should be instanceof WalletError", () => {
      const error = new WalletNotSelectedError();
      expect(error).toBeInstanceOf(WalletError);
    });
  });

  describe("WalletNotReadyError", () => {
    it("should have correct name", () => {
      const error = new WalletNotReadyError("Wallet not ready");
      expect(error.name).toBe("WalletNotReadyError");
      expect(error.message).toBe("Wallet not ready");
    });
  });

  describe("WalletLoadError", () => {
    it("should have correct name", () => {
      const error = new WalletLoadError("Failed to load wallet");
      expect(error.name).toBe("WalletLoadError");
    });
  });

  describe("WalletConfigError", () => {
    it("should have correct name", () => {
      const error = new WalletConfigError("Invalid config");
      expect(error.name).toBe("WalletConfigError");
    });
  });

  describe("WalletConnectionError", () => {
    it("should have correct name", () => {
      const error = new WalletConnectionError("Connection failed");
      expect(error.name).toBe("WalletConnectionError");
    });
  });

  describe("WalletDisconnectedError", () => {
    it("should have correct name", () => {
      const error = new WalletDisconnectedError("Wallet disconnected");
      expect(error.name).toBe("WalletDisconnectedError");
    });
  });

  describe("WalletDisconnectionError", () => {
    it("should have correct name", () => {
      const error = new WalletDisconnectionError("Disconnection failed");
      expect(error.name).toBe("WalletDisconnectionError");
    });
  });

  describe("WalletAccountError", () => {
    it("should have correct name", () => {
      const error = new WalletAccountError("Account error");
      expect(error.name).toBe("WalletAccountError");
    });
  });

  describe("WalletGetNetworkError", () => {
    it("should have correct name", () => {
      const error = new WalletGetNetworkError("Failed to get network");
      expect(error.name).toBe("WalletGetNetworkError");
    });
  });

  describe("WalletAccountChangeError", () => {
    it("should have correct name", () => {
      const error = new WalletAccountChangeError("Account change failed");
      expect(error.name).toBe("WalletAccountChangeError");
    });
  });

  describe("WalletNetworkChangeError", () => {
    it("should have correct name", () => {
      const error = new WalletNetworkChangeError("Network change failed");
      expect(error.name).toBe("WalletNetworkChangeError");
    });
  });

  describe("WalletPublicKeyError", () => {
    it("should have correct name", () => {
      const error = new WalletPublicKeyError("Public key error");
      expect(error.name).toBe("WalletPublicKeyError");
    });
  });

  describe("WalletKeypairError", () => {
    it("should have correct name", () => {
      const error = new WalletKeypairError("Keypair error");
      expect(error.name).toBe("WalletKeypairError");
    });
  });

  describe("WalletNotConnectedError", () => {
    it("should have correct name", () => {
      const error = new WalletNotConnectedError("Wallet not connected");
      expect(error.name).toBe("WalletNotConnectedError");
    });
  });

  describe("WalletSendTransactionError", () => {
    it("should have correct name", () => {
      const error = new WalletSendTransactionError("Send failed");
      expect(error.name).toBe("WalletSendTransactionError");
    });
  });

  describe("WalletSignMessageError", () => {
    it("should have correct name", () => {
      const error = new WalletSignMessageError("Sign message failed");
      expect(error.name).toBe("WalletSignMessageError");
    });
  });

  describe("WalletSignMessageAndVerifyError", () => {
    it("should have correct name", () => {
      const error = new WalletSignMessageAndVerifyError("Sign and verify failed");
      expect(error.name).toBe("WalletSignMessageAndVerifyError");
    });
  });

  describe("WalletSignAndSubmitMessageError", () => {
    it("should have correct name", () => {
      const error = new WalletSignAndSubmitMessageError("Sign and submit failed");
      expect(error.name).toBe("WalletSignAndSubmitMessageError");
    });
  });

  describe("WalletSignTransactionError", () => {
    it("should have correct name", () => {
      const error = new WalletSignTransactionError("Sign transaction failed");
      expect(error.name).toBe("WalletSignTransactionError");
    });
  });

  describe("WalletTimeoutError", () => {
    it("should have correct name", () => {
      const error = new WalletTimeoutError("Request timed out");
      expect(error.name).toBe("WalletTimeoutError");
    });
  });

  describe("WalletWindowBlockedError", () => {
    it("should have correct name", () => {
      const error = new WalletWindowBlockedError("Window blocked");
      expect(error.name).toBe("WalletWindowBlockedError");
    });
  });

  describe("WalletWindowClosedError", () => {
    it("should have correct name", () => {
      const error = new WalletWindowClosedError("Window closed");
      expect(error.name).toBe("WalletWindowClosedError");
    });
  });

  describe("WalletResponseError", () => {
    it("should have correct name", () => {
      const error = new WalletResponseError("Invalid response");
      expect(error.name).toBe("WalletResponseError");
    });
  });

  describe("WalletNotSupportedMethod", () => {
    it("should have correct name", () => {
      const error = new WalletNotSupportedMethod("Method not supported");
      expect(error.name).toBe("WalletNotSupportedMethod");
    });
  });

  describe("WalletChangeNetworkError", () => {
    it("should have correct name", () => {
      const error = new WalletChangeNetworkError("Change network failed");
      expect(error.name).toBe("WalletChangeNetworkError");
    });
  });

  describe("WalletSubmitTransactionError", () => {
    it("should have correct name", () => {
      const error = new WalletSubmitTransactionError("Submit transaction failed");
      expect(error.name).toBe("WalletSubmitTransactionError");
    });
  });

  describe("WalletNotFoundError", () => {
    it("should have correct name", () => {
      const error = new WalletNotFoundError("Wallet not found");
      expect(error.name).toBe("WalletNotFoundError");
    });
  });

  describe("Error inheritance chain", () => {
    it("all errors should be instances of Error", () => {
      const errors = [
        new WalletNotSelectedError(),
        new WalletNotReadyError(),
        new WalletLoadError(),
        new WalletConfigError(),
        new WalletConnectionError(),
        new WalletDisconnectedError(),
        new WalletDisconnectionError(),
        new WalletAccountError(),
        new WalletGetNetworkError(),
        new WalletAccountChangeError(),
        new WalletNetworkChangeError(),
        new WalletPublicKeyError(),
        new WalletKeypairError(),
        new WalletNotConnectedError(),
        new WalletSendTransactionError(),
        new WalletSignMessageError(),
        new WalletSignMessageAndVerifyError(),
        new WalletSignAndSubmitMessageError(),
        new WalletSignTransactionError(),
        new WalletTimeoutError(),
        new WalletWindowBlockedError(),
        new WalletWindowClosedError(),
        new WalletResponseError(),
        new WalletNotSupportedMethod(),
        new WalletChangeNetworkError(),
        new WalletSubmitTransactionError(),
        new WalletNotFoundError(),
      ];

      errors.forEach((error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(WalletError);
      });
    });
  });
});

