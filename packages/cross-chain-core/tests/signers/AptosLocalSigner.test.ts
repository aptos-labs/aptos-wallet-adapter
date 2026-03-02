import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  Account,
  Ed25519PrivateKey,
  Network as AptosNetwork,
  PrivateKey,
  PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";
import {
  AptosLocalSigner,
  signAndSendTransaction,
} from "../../src/providers/wormhole/signers/AptosLocalSigner";
import { CrossChainCore } from "../../src/CrossChainCore";

const mockBuildSimple = vi.fn();
const mockSign = vi.fn();
const mockSubmitSimple = vi.fn();
const mockWaitForTransaction = vi.fn();

vi.mock("@aptos-labs/ts-sdk", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@aptos-labs/ts-sdk")>();
  return {
    ...actual,
    Aptos: vi.fn().mockImplementation(() => ({
      transaction: {
        build: { simple: mockBuildSimple },
        sign: mockSign,
        submit: { simple: mockSubmitSimple },
        signAsFeePayer: vi.fn(),
      },
      waitForTransaction: mockWaitForTransaction,
    })),
  };
});

describe("AptosLocalSigner", () => {
  // Create a test account using a deterministic private key (AIP-80 compliant format)
  const testPrivateKey = new Ed25519PrivateKey(
    PrivateKey.formatPrivateKey(
      "0x0000000000000000000000000000000000000000000000000000000000000001",
      PrivateKeyVariants.Ed25519,
    ),
  );
  const testAccount = Account.fromPrivateKey({ privateKey: testPrivateKey });
  const mockOptions = {};
  const mockCrossChainCore = {
    _dappConfig: { aptosNetwork: AptosNetwork.TESTNET },
  } as unknown as CrossChainCore;

  describe("constructor", () => {
    it("should create signer with required properties", () => {
      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        undefined,
        mockCrossChainCore,
      );

      expect(signer).toBeDefined();
      expect(signer._chain).toBe("Aptos");
      expect(signer._options).toBe(mockOptions);
      expect(signer._wallet).toBe(testAccount);
      expect(signer._crossChainCore).toBe(mockCrossChainCore);
    });

    it("should initialize claimedTransactionHashes as empty array", () => {
      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        undefined,
        mockCrossChainCore,
      );

      expect(signer._claimedTransactionHashes).toEqual([]);
    });

    it("should accept sponsor account (Account type)", () => {
      const sponsorPrivateKey = new Ed25519PrivateKey(
        PrivateKey.formatPrivateKey(
          "0x0000000000000000000000000000000000000000000000000000000000000002",
          PrivateKeyVariants.Ed25519,
        ),
      );
      const sponsorAccount = Account.fromPrivateKey({
        privateKey: sponsorPrivateKey,
      });

      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        sponsorAccount,
        mockCrossChainCore,
      );

      expect(signer._sponsorAccount).toBe(sponsorAccount);
    });

    it("should accept sponsor account (GasStationApiKey)", () => {
      const gasStationKey = {
        [AptosNetwork.TESTNET]: "gas-station-api-key",
      };

      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        gasStationKey,
        mockCrossChainCore,
      );

      expect(signer._sponsorAccount).toBe(gasStationKey);
    });
  });

  describe("chain()", () => {
    it("should return the chain", () => {
      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        undefined,
        mockCrossChainCore,
      );

      expect(signer.chain()).toBe("Aptos");
    });
  });

  describe("address()", () => {
    it("should return the wallet account address", () => {
      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        undefined,
        mockCrossChainCore,
      );

      expect(signer.address()).toBe(testAccount.accountAddress.toString());
    });

    it("should return valid Aptos address format", () => {
      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        undefined,
        mockCrossChainCore,
      );

      // Aptos addresses are 64 hex characters prefixed with 0x
      expect(signer.address()).toMatch(/^0x[a-f0-9]{64}$/i);
    });
  });

  describe("claimedTransactionHashes()", () => {
    it("should initially return empty string", () => {
      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        undefined,
        mockCrossChainCore,
      );

      expect(signer.claimedTransactionHashes()).toBe("");
    });

    it("should return updated value after internal modification", () => {
      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        undefined,
        mockCrossChainCore,
      );

      // Directly modify internal state for testing
      signer._claimedTransactionHashes = ["0xabc123def456"];

      expect(signer.claimedTransactionHashes()).toBe("0xabc123def456");
    });

    it("should join multiple hashes with comma", () => {
      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        undefined,
        mockCrossChainCore,
      );

      signer._claimedTransactionHashes = ["0xhash1", "0xhash2"];

      expect(signer.claimedTransactionHashes()).toBe("0xhash1,0xhash2");
    });
  });

  describe("properties", () => {
    it("should expose wallet as _wallet", () => {
      const signer = new AptosLocalSigner(
        "Aptos",
        mockOptions,
        testAccount,
        undefined,
        mockCrossChainCore,
      );

      expect(signer._wallet).toBe(testAccount);
      expect(signer._wallet.accountAddress).toBeDefined();
    });

    it("should expose options as _options", () => {
      const customOptions = { custom: "option" };
      const signer = new AptosLocalSigner(
        "Aptos",
        customOptions,
        testAccount,
        undefined,
        mockCrossChainCore,
      );

      expect(signer._options).toBe(customOptions);
    });
  });

  describe("signAndSendTransaction – expireTimestamp forwarding", () => {
    beforeEach(() => {
      mockBuildSimple.mockReset().mockResolvedValue({ rawTransaction: "mock" });
      mockSign
        .mockReset()
        .mockResolvedValue({ toUint8Array: () => new Uint8Array() });
      mockSubmitSimple
        .mockReset()
        .mockResolvedValue({ hash: "0xmocktxhash" });
      mockWaitForTransaction
        .mockReset()
        .mockResolvedValue({ hash: "0xmocktxhash" });
    });

    function makeRequest() {
      return {
        transaction: {
          functionArguments: ["arg1", "arg2"],
        },
      } as any;
    }

    function makeCrossChainCore(getExpireTimestamp?: () => number) {
      return {
        _dappConfig: {
          aptosNetwork: AptosNetwork.TESTNET,
          getExpireTimestamp,
        },
      } as unknown as CrossChainCore;
    }

    it("should pass expireTimestamp option when getExpireTimestamp returns a value", async () => {
      const crossChainCore = makeCrossChainCore(() => 1700000000);

      await signAndSendTransaction(
        makeRequest(),
        testAccount,
        undefined,
        crossChainCore,
      );

      expect(mockBuildSimple).toHaveBeenCalledWith(
        expect.objectContaining({
          options: { expireTimestamp: 1700000000 },
        }),
      );
    });

    it("should pass expireTimestamp option when getExpireTimestamp returns 0", async () => {
      const crossChainCore = makeCrossChainCore(() => 0);

      await signAndSendTransaction(
        makeRequest(),
        testAccount,
        undefined,
        crossChainCore,
      );

      expect(mockBuildSimple).toHaveBeenCalledWith(
        expect.objectContaining({
          options: { expireTimestamp: 0 },
        }),
      );
    });

    it("should omit options when getExpireTimestamp is not set in config", async () => {
      const crossChainCore = makeCrossChainCore(undefined);

      await signAndSendTransaction(
        makeRequest(),
        testAccount,
        undefined,
        crossChainCore,
      );

      const callArg = mockBuildSimple.mock.calls[0][0];
      expect(callArg).not.toHaveProperty("options");
    });

    it("should call getExpireTimestamp at build time", async () => {
      const getExpireTimestamp = vi.fn().mockReturnValue(9999999999);
      const crossChainCore = makeCrossChainCore(getExpireTimestamp);

      await signAndSendTransaction(
        makeRequest(),
        testAccount,
        undefined,
        crossChainCore,
      );

      expect(getExpireTimestamp).toHaveBeenCalledOnce();
    });

    it("should throw for NaN expireTimestamp", async () => {
      const crossChainCore = makeCrossChainCore(() => NaN);

      await expect(
        signAndSendTransaction(
          makeRequest(),
          testAccount,
          undefined,
          crossChainCore,
        ),
      ).rejects.toThrow("getExpireTimestamp returned an invalid value");
    });

    it("should throw for negative expireTimestamp", async () => {
      const crossChainCore = makeCrossChainCore(() => -1);

      await expect(
        signAndSendTransaction(
          makeRequest(),
          testAccount,
          undefined,
          crossChainCore,
        ),
      ).rejects.toThrow("getExpireTimestamp returned an invalid value");
    });

    it("should throw for non-integer expireTimestamp", async () => {
      const crossChainCore = makeCrossChainCore(() => 1700000000.5);

      await expect(
        signAndSendTransaction(
          makeRequest(),
          testAccount,
          undefined,
          crossChainCore,
        ),
      ).rejects.toThrow("getExpireTimestamp returned an invalid value");
    });

    it("should throw for Infinity expireTimestamp", async () => {
      const crossChainCore = makeCrossChainCore(() => Infinity);

      await expect(
        signAndSendTransaction(
          makeRequest(),
          testAccount,
          undefined,
          crossChainCore,
        ),
      ).rejects.toThrow("getExpireTimestamp returned an invalid value");
    });
  });
});
