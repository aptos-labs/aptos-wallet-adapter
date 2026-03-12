import { describe, expect, it } from "vitest";
import { TransferError, WithdrawError } from "../src/providers/wormhole/types";

describe("TransferError", () => {
  it("should create an error with message and originChainTxnId", () => {
    const error = new TransferError("Claim failed", "0xsource123");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(TransferError);
    expect(error.message).toBe("Claim failed");
    expect(error.name).toBe("TransferError");
    expect(error.originChainTxnId).toBe("0xsource123");
    expect(error.cause).toBeUndefined();
  });

  it("should preserve the underlying cause", () => {
    const underlying = new Error("RPC timeout");
    const error = new TransferError(
      "Claim failed after source burn",
      "0xburntx456",
      underlying,
    );

    expect(error.cause).toBe(underlying);
    expect(error.originChainTxnId).toBe("0xburntx456");
  });

  it("should be distinguishable from WithdrawError", () => {
    const transferErr = new TransferError("t", "0x1");
    const withdrawErr = new WithdrawError("w", "0x2", "tracking");

    expect(transferErr).toBeInstanceOf(TransferError);
    expect(transferErr).not.toBeInstanceOf(WithdrawError);
    expect(withdrawErr).toBeInstanceOf(WithdrawError);
    expect(withdrawErr).not.toBeInstanceOf(TransferError);
  });

  it("should work with empty originChainTxnId", () => {
    const error = new TransferError("Claim failed", "");

    expect(error.originChainTxnId).toBe("");
  });
});
