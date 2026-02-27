import { describe, it, expect, beforeEach, vi } from "vitest";
import { Network } from "@aptos-labs/ts-sdk";
import { WalletCore } from "../src/WalletCore";
import { createMockWallet, TEST_ACCOUNT, TEST_NETWORK } from "./mocks/wallet";

// Mock getAptosWallets to return our mock wallets
vi.mock("@aptos-labs/wallet-standard", async () => {
  const actual = await vi.importActual("@aptos-labs/wallet-standard");
  return {
    ...actual,
    getAptosWallets: vi.fn(() => ({
      aptosWallets: [],
      on: vi.fn(() => () => {}),
    })),
    isWalletWithRequiredFeatureSet: vi.fn(() => true),
  };
});

// Mock SDK wallets
vi.mock("../src/sdkWallets", () => ({
  getSDKWallets: vi.fn(() => []),
}));

describe("WalletCore", () => {
  let walletCore: WalletCore;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("constructor", () => {
    it("should create instance with default options", () => {
      walletCore = new WalletCore();
      expect(walletCore).toBeInstanceOf(WalletCore);
    });

    it("should create instance with opt-in wallets", () => {
      walletCore = new WalletCore(["Petra", "Nightly"]);
      expect(walletCore).toBeInstanceOf(WalletCore);
    });

    it("should create instance with dapp config", () => {
      walletCore = new WalletCore([], { network: Network.MAINNET });
      expect(walletCore).toBeInstanceOf(WalletCore);
    });

    it("should create instance with telemetry disabled", () => {
      walletCore = new WalletCore([], undefined, true);
      expect(walletCore).toBeInstanceOf(WalletCore);
    });

    it("should create instance with hide wallets", () => {
      walletCore = new WalletCore([], undefined, false, ["Petra Web"]);
      expect(walletCore).toBeInstanceOf(WalletCore);
    });
  });

  describe("isConnected", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should return false when not connected", () => {
      expect(walletCore.isConnected()).toBe(false);
    });
  });

  describe("wallet getter", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should return null when no wallet is set", () => {
      expect(walletCore.wallet).toBeNull();
    });
  });

  describe("account getter", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should return null when no account is set", () => {
      expect(walletCore.account).toBeNull();
    });
  });

  describe("network getter", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should return null when no network is set", () => {
      expect(walletCore.network).toBeNull();
    });
  });

  describe("wallets getter", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should return array of wallets", () => {
      const wallets = walletCore.wallets;
      expect(Array.isArray(wallets)).toBe(true);
    });
  });

  describe("hiddenWallets getter", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should return array of hidden wallets", () => {
      const hiddenWallets = walletCore.hiddenWallets;
      expect(Array.isArray(hiddenWallets)).toBe(true);
    });
  });

  describe("notDetectedWallets getter", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should return array of not detected wallets", () => {
      const notDetectedWallets = walletCore.notDetectedWallets;
      expect(Array.isArray(notDetectedWallets)).toBe(true);
    });
  });

  describe("setWallet", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should set wallet", () => {
      const mockWallet = createMockWallet();
      walletCore.setWallet(mockWallet);
      expect(walletCore.wallet).toBe(mockWallet);
    });

    it("should set wallet to null", () => {
      const mockWallet = createMockWallet();
      walletCore.setWallet(mockWallet);
      walletCore.setWallet(null);
      expect(walletCore.wallet).toBeNull();
    });
  });

  describe("setAccount", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should set account", () => {
      walletCore.setAccount(TEST_ACCOUNT);
      expect(walletCore.account).toBe(TEST_ACCOUNT);
    });

    it("should set account to null", () => {
      walletCore.setAccount(TEST_ACCOUNT);
      walletCore.setAccount(null);
      expect(walletCore.account).toBeNull();
    });
  });

  describe("setNetwork", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should set network", () => {
      walletCore.setNetwork(TEST_NETWORK);
      expect(walletCore.network).toBe(TEST_NETWORK);
    });

    it("should set network to null", () => {
      walletCore.setNetwork(TEST_NETWORK);
      walletCore.setNetwork(null);
      expect(walletCore.network).toBeNull();
    });
  });

  describe("excludeWallet", () => {
    it("should not exclude wallet when optInWallets is empty", () => {
      walletCore = new WalletCore([], undefined, true);
      const mockWallet = createMockWallet({ name: "TestWallet" });
      expect(walletCore.excludeWallet(mockWallet)).toBe(false);
    });

    it("should exclude wallet not in optInWallets", () => {
      walletCore = new WalletCore(["Petra"], undefined, true);
      const mockWallet = createMockWallet({ name: "OtherWallet" });
      expect(walletCore.excludeWallet(mockWallet)).toBe(true);
    });

    it("should not exclude wallet in optInWallets", () => {
      walletCore = new WalletCore(["Petra"], undefined, true);
      const mockWallet = createMockWallet({ name: "Petra" });
      expect(walletCore.excludeWallet(mockWallet)).toBe(false);
    });
  });

  describe("hideWallet", () => {
    it("should not hide wallet when hideWallets is empty", () => {
      walletCore = new WalletCore([], undefined, true, []);
      const mockWallet = createMockWallet({ name: "TestWallet" });
      expect(walletCore.hideWallet(mockWallet)).toBe(false);
    });

    it("should hide wallet in hideWallets list", () => {
      walletCore = new WalletCore([], undefined, true, ["Petra Web"]);
      const mockWallet = createMockWallet({ name: "Petra Web" });
      expect(walletCore.hideWallet(mockWallet)).toBe(true);
    });

    it("should not hide wallet not in hideWallets list", () => {
      walletCore = new WalletCore([], undefined, true, ["Petra Web"]);
      const mockWallet = createMockWallet({ name: "Nightly" });
      expect(walletCore.hideWallet(mockWallet)).toBe(false);
    });
  });

  describe("event emitter", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should emit connect event", () => {
      const connectHandler = vi.fn();
      walletCore.on("connect", connectHandler);
      walletCore.emit("connect", TEST_ACCOUNT);
      expect(connectHandler).toHaveBeenCalledWith(TEST_ACCOUNT);
    });

    it("should emit disconnect event", () => {
      const disconnectHandler = vi.fn();
      walletCore.on("disconnect", disconnectHandler);
      walletCore.emit("disconnect");
      expect(disconnectHandler).toHaveBeenCalled();
    });

    it("should emit networkChange event", () => {
      const networkChangeHandler = vi.fn();
      walletCore.on("networkChange", networkChangeHandler);
      walletCore.emit("networkChange", TEST_NETWORK);
      expect(networkChangeHandler).toHaveBeenCalledWith(TEST_NETWORK);
    });

    it("should emit accountChange event", () => {
      const accountChangeHandler = vi.fn();
      walletCore.on("accountChange", accountChangeHandler);
      walletCore.emit("accountChange", TEST_ACCOUNT);
      expect(accountChangeHandler).toHaveBeenCalledWith(TEST_ACCOUNT);
    });
  });

  describe("connect", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should return undefined for non-existent wallet", async () => {
      const result = await walletCore.connect("NonExistentWallet");
      expect(result).toBeUndefined();
    });
  });

  describe("disconnect", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should throw when no wallet is connected", async () => {
      await expect(walletCore.disconnect()).rejects.toThrow();
    });
  });

  describe("signMessage", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should throw when no wallet is connected", async () => {
      await expect(
        walletCore.signMessage({ message: "test", nonce: "123" }),
      ).rejects.toThrow();
    });
  });

  describe("signTransaction", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should throw when no wallet is connected", async () => {
      await expect(
        walletCore.signTransaction({ transactionOrPayload: {} as any }),
      ).rejects.toThrow();
    });
  });

  describe("signAndSubmitTransaction", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should throw when no wallet is connected", async () => {
      await expect(
        walletCore.signAndSubmitTransaction({
          data: {
            function: "0x1::coin::transfer",
            typeArguments: [],
            functionArguments: [],
          },
        }),
      ).rejects.toThrow();
    });

    it("should detect scam transaction", async () => {
      const mockWallet = createMockWallet();
      walletCore.setWallet(mockWallet);
      walletCore.setAccount(TEST_ACCOUNT);
      walletCore.setNetwork(TEST_NETWORK);

      await expect(
        walletCore.signAndSubmitTransaction({
          data: {
            function: "0x1::account::rotate_authentication_key_call",
            typeArguments: [],
            functionArguments: [],
          },
        }),
      ).rejects.toThrow("SCAM SITE DETECTED");
    });
  });

  describe("changeNetwork", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should throw when no wallet is connected", async () => {
      await expect(walletCore.changeNetwork(Network.TESTNET)).rejects.toThrow();
    });
  });

  describe("onAccountChange", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should throw when no wallet is connected", async () => {
      await expect(walletCore.onAccountChange()).rejects.toThrow();
    });
  });

  describe("onNetworkChange", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should throw when no wallet is connected", async () => {
      await expect(walletCore.onNetworkChange()).rejects.toThrow();
    });
  });

  describe("signMessageAndVerify", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should throw when no wallet is connected", async () => {
      await expect(
        walletCore.signMessageAndVerify({ message: "test", nonce: "123" }),
      ).rejects.toThrow();
    });
  });

  describe("submitTransaction", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should throw when no wallet is connected", async () => {
      await expect(
        walletCore.submitTransaction({
          transaction: {} as any,
          senderAuthenticator: {} as any,
        }),
      ).rejects.toThrow();
    });
  });

  describe("signIn", () => {
    beforeEach(() => {
      walletCore = new WalletCore([], undefined, true);
    });

    it("should throw for non-existent wallet", async () => {
      await expect(
        walletCore.signIn({
          walletName: "NonExistentWallet",
          input: {
            domain: "test.example.com",
            nonce: "test-nonce-123",
          },
        }),
      ).rejects.toThrow(/not found/i);
    });
  });
});
