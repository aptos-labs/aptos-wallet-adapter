import { Network as AptosNetwork } from "@aptos-labs/ts-sdk";
import { UserResponseStatus } from "@aptos-labs/wallet-standard";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CrossChainCore } from "../../src/CrossChainCore";
import { signAndSendTransaction } from "../../src/providers/wormhole/signers/AptosSigner";

const mockBuildSimple = vi.fn();
const mockSubmitSimple = vi.fn();
const mockWaitForTransaction = vi.fn();

vi.mock("@aptos-labs/ts-sdk", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@aptos-labs/ts-sdk")>();
  return {
    ...actual,
    Aptos: vi.fn().mockImplementation(() => ({
      transaction: {
        build: { simple: mockBuildSimple },
        sign: vi.fn(),
        submit: { simple: mockSubmitSimple },
        signAsFeePayer: vi.fn(),
      },
      waitForTransaction: mockWaitForTransaction,
    })),
  };
});

describe("AptosSigner – signAndSendTransaction", () => {
  const mockSenderAuthenticator = { toUint8Array: () => new Uint8Array() };

  function makeWallet() {
    return {
      features: {
        "aptos:account": {
          account: vi.fn().mockResolvedValue({
            address: { toString: () => "0x1" },
          }),
        },
        "aptos:signTransaction": {
          signTransaction: vi.fn().mockResolvedValue({
            status: UserResponseStatus.APPROVED,
            args: mockSenderAuthenticator,
          }),
        },
      },
    } as any;
  }

  function makeRequest() {
    return {
      transaction: {
        functionArguments: [
          { bcsToBytes: () => new Uint8Array([100, 0, 0, 0, 0, 0, 0, 0]) },
          { bcsToBytes: () => new Uint8Array([1, 0, 0, 0]) },
          { bcsToBytes: () => new Uint8Array(32).fill(1) },
          { bcsToBytes: () => new Uint8Array(32).fill(2) },
        ],
      },
    } as any;
  }

  beforeEach(() => {
    mockBuildSimple.mockReset().mockResolvedValue({ rawTransaction: "mock" });
    mockSubmitSimple.mockReset().mockResolvedValue({ hash: "0xmocktxhash" });
    mockWaitForTransaction
      .mockReset()
      .mockResolvedValue({ hash: "0xmocktxhash" });
  });

  it("should pass expireTimestamp option when getExpireTimestamp is configured", async () => {
    const crossChainCore = new CrossChainCore({
      dappConfig: {
        aptosNetwork: AptosNetwork.TESTNET,
        getExpireTimestamp: () => 1700000000,
      },
    });

    await signAndSendTransaction(
      makeRequest(),
      makeWallet(),
      undefined,
      AptosNetwork.TESTNET,
      crossChainCore,
    );

    expect(mockBuildSimple).toHaveBeenCalledWith(
      expect.objectContaining({
        options: { expireTimestamp: 1700000000 },
      }),
    );
  });

  it("should pass expireTimestamp option when getExpireTimestamp returns 0", async () => {
    const crossChainCore = new CrossChainCore({
      dappConfig: {
        aptosNetwork: AptosNetwork.TESTNET,
        getExpireTimestamp: () => 0,
      },
    });

    await signAndSendTransaction(
      makeRequest(),
      makeWallet(),
      undefined,
      AptosNetwork.TESTNET,
      crossChainCore,
    );

    expect(mockBuildSimple).toHaveBeenCalledWith(
      expect.objectContaining({
        options: { expireTimestamp: 0 },
      }),
    );
  });

  it("should omit options when getExpireTimestamp is not configured", async () => {
    const crossChainCore = new CrossChainCore({
      dappConfig: {
        aptosNetwork: AptosNetwork.TESTNET,
      },
    });

    await signAndSendTransaction(
      makeRequest(),
      makeWallet(),
      undefined,
      AptosNetwork.TESTNET,
      crossChainCore,
    );

    const callArg = mockBuildSimple.mock.calls[0][0];
    expect(callArg).not.toHaveProperty("options");
  });

  it("should omit options when crossChainCore is not provided", async () => {
    await signAndSendTransaction(
      makeRequest(),
      makeWallet(),
      undefined,
      AptosNetwork.TESTNET,
    );

    const callArg = mockBuildSimple.mock.calls[0][0];
    expect(callArg).not.toHaveProperty("options");
  });

  it("should throw for NaN expireTimestamp", async () => {
    const crossChainCore = new CrossChainCore({
      dappConfig: {
        aptosNetwork: AptosNetwork.TESTNET,
        getExpireTimestamp: () => NaN,
      },
    });

    await expect(
      signAndSendTransaction(
        makeRequest(),
        makeWallet(),
        undefined,
        AptosNetwork.TESTNET,
        crossChainCore,
      ),
    ).rejects.toThrow("getExpireTimestamp returned an invalid value");
  });

  it("should throw for negative expireTimestamp", async () => {
    const crossChainCore = new CrossChainCore({
      dappConfig: {
        aptosNetwork: AptosNetwork.TESTNET,
        getExpireTimestamp: () => -1,
      },
    });

    await expect(
      signAndSendTransaction(
        makeRequest(),
        makeWallet(),
        undefined,
        AptosNetwork.TESTNET,
        crossChainCore,
      ),
    ).rejects.toThrow("getExpireTimestamp returned an invalid value");
  });

  it("should throw for non-integer expireTimestamp", async () => {
    const crossChainCore = new CrossChainCore({
      dappConfig: {
        aptosNetwork: AptosNetwork.TESTNET,
        getExpireTimestamp: () => 1700000000.5,
      },
    });

    await expect(
      signAndSendTransaction(
        makeRequest(),
        makeWallet(),
        undefined,
        AptosNetwork.TESTNET,
        crossChainCore,
      ),
    ).rejects.toThrow("getExpireTimestamp returned an invalid value");
  });

  it("should throw for Infinity expireTimestamp", async () => {
    const crossChainCore = new CrossChainCore({
      dappConfig: {
        aptosNetwork: AptosNetwork.TESTNET,
        getExpireTimestamp: () => Infinity,
      },
    });

    await expect(
      signAndSendTransaction(
        makeRequest(),
        makeWallet(),
        undefined,
        AptosNetwork.TESTNET,
        crossChainCore,
      ),
    ).rejects.toThrow("getExpireTimestamp returned an invalid value");
  });
});
