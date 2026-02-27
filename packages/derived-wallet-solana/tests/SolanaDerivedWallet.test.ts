import { describe, it, expect, beforeEach } from "vitest";
import { APTOS_CHAINS, UserResponseStatus } from "@aptos-labs/wallet-standard";
import {
  Network,
  NetworkToChainId,
  NetworkToNodeAPI,
} from "@aptos-labs/ts-sdk";
import { SolanaDerivedWallet } from "../src/SolanaDerivedWallet";
import { SolanaDerivedPublicKey } from "../src/SolanaDerivedPublicKey";
import { defaultSolanaAuthenticationFunction } from "../src/shared";
import {
  createConnectedMockSolanaWallet,
  TEST_SOLANA_KEYPAIR,
} from "./mocks/solanaWallet";
import type { StandardWalletAdapter } from "@solana/wallet-standard-wallet-adapter-base";

describe("SolanaDerivedWallet", () => {
  let mockSolanaWallet: StandardWalletAdapter;
  let wallet: SolanaDerivedWallet;

  beforeEach(() => {
    mockSolanaWallet = createConnectedMockSolanaWallet({
      keypair: TEST_SOLANA_KEYPAIR,
      name: "Test Solana Wallet",
    });
    wallet = new SolanaDerivedWallet(mockSolanaWallet);
  });

  describe("constructor", () => {
    it("should create wallet from Solana wallet adapter", () => {
      expect(wallet).toBeDefined();
      expect(wallet).toBeInstanceOf(SolanaDerivedWallet);
    });

    it("should set wallet name with (Solana) suffix", () => {
      expect(wallet.name).toBe("Test Solana Wallet (Solana)");
    });

    it("should set wallet icon from solana wallet", () => {
      expect(wallet.icon).toBe(mockSolanaWallet.icon);
    });

    it("should set wallet url from solana wallet", () => {
      expect(wallet.url).toBe(mockSolanaWallet.url);
    });

    it("should set version to 1.0.0", () => {
      expect(wallet.version).toBe("1.0.0");
    });

    it("should set chains to APTOS_CHAINS", () => {
      expect(wallet.chains).toBe(APTOS_CHAINS);
    });

    it("should default to MAINNET network", () => {
      expect(wallet.defaultNetwork).toBe(Network.MAINNET);
    });

    it("should allow custom default network", () => {
      const testnetWallet = new SolanaDerivedWallet(mockSolanaWallet, {
        defaultNetwork: Network.TESTNET,
      });
      expect(testnetWallet.defaultNetwork).toBe(Network.TESTNET);
    });

    it("should use default authentication function", () => {
      expect(wallet.authenticationFunction).toBe(
        defaultSolanaAuthenticationFunction,
      );
    });

    it("should allow custom authentication function", () => {
      const customAuthFunction = "0x1::custom::authenticate";
      const customWallet = new SolanaDerivedWallet(mockSolanaWallet, {
        authenticationFunction: customAuthFunction,
      });
      expect(customWallet.authenticationFunction).toBe(customAuthFunction);
    });

    it("should set domain from window.location.host", () => {
      expect(wallet.domain).toBe("test.example.com");
    });
  });

  describe("features", () => {
    it("should have all required Aptos features", () => {
      expect(wallet.features["aptos:connect"]).toBeDefined();
      expect(wallet.features["aptos:disconnect"]).toBeDefined();
      expect(wallet.features["aptos:account"]).toBeDefined();
      expect(wallet.features["aptos:onAccountChange"]).toBeDefined();
      expect(wallet.features["aptos:network"]).toBeDefined();
      expect(wallet.features["aptos:changeNetwork"]).toBeDefined();
      expect(wallet.features["aptos:onNetworkChange"]).toBeDefined();
      expect(wallet.features["aptos:signMessage"]).toBeDefined();
      expect(wallet.features["aptos:signTransaction"]).toBeDefined();
    });

    it("should have correct feature versions", () => {
      expect(wallet.features["aptos:connect"].version).toBe("1.0.0");
      expect(wallet.features["aptos:signMessage"].version).toBe("1.0.0");
      expect(wallet.features["aptos:signTransaction"].version).toBe("1.0.0");
    });
  });

  describe("connect", () => {
    it("should return approved response with account info", async () => {
      const response = await wallet.connect();

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args).toBeDefined();
        expect(response.args.address).toBeDefined();
      }
    });

    it("should return account with derived public key", async () => {
      const response = await wallet.connect();

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args.publicKey).toBeInstanceOf(SolanaDerivedPublicKey);
      }
    });

    it("should derive Aptos address from Solana public key", async () => {
      const response = await wallet.connect();

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        // Address should be a valid 32-byte Aptos address
        expect(response.args.address.toString()).toMatch(/^0x[a-f0-9]{64}$/i);
      }
    });
  });

  describe("getActiveAccount", () => {
    it("should return active account info", async () => {
      const accountInfo = await wallet.getActiveAccount();

      expect(accountInfo).toBeDefined();
      expect(accountInfo.publicKey).toBeInstanceOf(SolanaDerivedPublicKey);
    });

    it("should return consistent address for same solana account", async () => {
      const account1 = await wallet.getActiveAccount();
      const account2 = await wallet.getActiveAccount();

      expect(account1.address.toString()).toBe(account2.address.toString());
    });
  });

  describe("getActiveNetwork", () => {
    it("should return current network info", async () => {
      const networkInfo = await wallet.getActiveNetwork();

      expect(networkInfo.name).toBe(Network.MAINNET);
      expect(networkInfo.chainId).toBe(NetworkToChainId[Network.MAINNET]);
      expect(networkInfo.url).toBe(NetworkToNodeAPI[Network.MAINNET]);
    });

    it("should reflect default network setting", async () => {
      const testnetWallet = new SolanaDerivedWallet(mockSolanaWallet, {
        defaultNetwork: Network.TESTNET,
      });

      const networkInfo = await testnetWallet.getActiveNetwork();

      expect(networkInfo.name).toBe(Network.TESTNET);
      expect(networkInfo.chainId).toBe(NetworkToChainId[Network.TESTNET]);
    });
  });

  describe("changeNetwork", () => {
    it("should change network successfully", async () => {
      const response = await wallet.changeNetwork({
        name: Network.TESTNET,
        chainId: NetworkToChainId[Network.TESTNET],
        url: NetworkToNodeAPI[Network.TESTNET],
      });

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args.success).toBe(true);
      }

      const newNetwork = await wallet.getActiveNetwork();
      expect(newNetwork.name).toBe(Network.TESTNET);
    });

    it("should throw for custom network", async () => {
      await expect(
        wallet.changeNetwork({
          name: Network.CUSTOM,
          url: "https://custom.node.com",
        }),
      ).rejects.toThrow("Custom network not currently supported");
    });

    it("should notify listeners on network change", async () => {
      let notifiedNetwork: { name: Network } | null = null;

      wallet.onActiveNetworkChange((network) => {
        notifiedNetwork = network;
      });

      await wallet.changeNetwork({
        name: Network.TESTNET,
        chainId: NetworkToChainId[Network.TESTNET],
        url: NetworkToNodeAPI[Network.TESTNET],
      });

      expect(notifiedNetwork).not.toBeNull();
      expect(notifiedNetwork!.name).toBe(Network.TESTNET);
    });
  });

  describe("onActiveAccountChange", () => {
    it("should register account change listener", async () => {
      let callbackCalled = false;

      wallet.onActiveAccountChange(() => {
        callbackCalled = true;
      });

      // Emit connect event from the mock wallet
      (mockSolanaWallet as any).emit("connect", TEST_SOLANA_KEYPAIR.publicKey);

      expect(callbackCalled).toBe(true);
    });

    it("should unregister listeners when passed null callback marker", () => {
      const callback = () => {};
      wallet.onActiveAccountChange(callback);
      // Create a null callback marker (function with _isNull property)
      const nullCallback = Object.assign(() => {}, { _isNull: true });
      // Should not throw
      wallet.onActiveAccountChange(nullCallback as any);
    });
  });

  describe("onActiveNetworkChange", () => {
    it("should register network change listener", async () => {
      let receivedNetwork: any = null;

      wallet.onActiveNetworkChange((network) => {
        receivedNetwork = network;
      });

      await wallet.changeNetwork({
        name: Network.TESTNET,
        chainId: NetworkToChainId[Network.TESTNET],
        url: NetworkToNodeAPI[Network.TESTNET],
      });

      expect(receivedNetwork).not.toBeNull();
      expect(receivedNetwork.name).toBe(Network.TESTNET);
    });

    it("should unregister listeners when passed null callback marker", () => {
      const callback = () => {};
      wallet.onActiveNetworkChange(callback);
      // Create a null callback marker (function with _isNull property)
      const nullCallback = Object.assign(() => {}, { _isNull: true });
      // Should not throw
      wallet.onActiveNetworkChange(nullCallback as any);
    });
  });

  describe("signMessage", () => {
    it("should sign a message", async () => {
      const response = await wallet.signMessage({
        message: "Hello, Aptos!",
        nonce: "12345678",
      });

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args.message).toBe("Hello, Aptos!");
        expect(response.args.nonce).toBe("12345678");
        expect(response.args.prefix).toBe("APTOS");
      }
    });

    it("should include signature in response", async () => {
      const response = await wallet.signMessage({
        message: "Test",
        nonce: "nonce",
      });

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args.signature).toBeDefined();
      }
    });
  });

  // Note: signTransaction tests require network access to build transactions.
  // These are tested via integration tests.
});
