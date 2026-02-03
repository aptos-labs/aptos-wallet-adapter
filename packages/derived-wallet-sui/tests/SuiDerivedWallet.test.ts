import { describe, it, expect, beforeEach } from "vitest";
import { APTOS_CHAINS, UserResponseStatus } from "@aptos-labs/wallet-standard";
import {
  Network,
  NetworkToChainId,
  NetworkToNodeAPI,
} from "@aptos-labs/ts-sdk";
import type { Wallet } from "@mysten/wallet-standard";
import { SuiDerivedWallet } from "../src/SuiDerivedWallet";
import { SuiDerivedPublicKey } from "../src/SuiDerivedPublicKey";
import { defaultAuthenticationFunction } from "../src/shared";
import {
  createConnectedMockSuiWallet,
  TEST_SUI_KEYPAIR,
} from "./mocks/suiWallet";

describe("SuiDerivedWallet", () => {
  let mockSuiWallet: Wallet;
  let wallet: SuiDerivedWallet;

  beforeEach(() => {
    mockSuiWallet = createConnectedMockSuiWallet({
      keypair: TEST_SUI_KEYPAIR,
      name: "Test Sui Wallet",
    });
    wallet = new SuiDerivedWallet(mockSuiWallet);
  });

  describe("constructor", () => {
    it("should create wallet from Sui wallet", () => {
      expect(wallet).toBeDefined();
      expect(wallet).toBeInstanceOf(SuiDerivedWallet);
    });

    it("should set wallet name with (Sui) suffix", () => {
      expect(wallet.name).toBe("Test Sui Wallet (Sui)");
    });

    it("should set wallet icon from sui wallet", () => {
      expect(wallet.icon).toBe(mockSuiWallet.icon);
    });

    it("should set wallet url to empty string", () => {
      // Sui wallet standard does not have a URL
      expect(wallet.url).toBe("");
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
      const testnetWallet = new SuiDerivedWallet(mockSuiWallet, {
        defaultNetwork: Network.TESTNET,
      });
      expect(testnetWallet.defaultNetwork).toBe(Network.TESTNET);
    });

    it("should use default authentication function", () => {
      expect(wallet.authenticationFunction).toBe(defaultAuthenticationFunction);
    });

    it("should allow custom authentication function", () => {
      const customAuthFunction = "0x1::custom::authenticate";
      const customWallet = new SuiDerivedWallet(mockSuiWallet, {
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
        expect(response.args.publicKey).toBeInstanceOf(SuiDerivedPublicKey);
      }
    });

    it("should derive Aptos address from Sui account", async () => {
      const response = await wallet.connect();

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        // Address should be a valid 32-byte Aptos address
        expect(response.args.address.toString()).toMatch(/^0x[a-f0-9]{64}$/i);
      }
    });
  });

  describe("disconnect", () => {
    it("should disconnect from the underlying Sui wallet", async () => {
      // Verify wallet is connected initially
      expect(mockSuiWallet.accounts.length).toBe(1);

      await wallet.disconnect();

      // Verify disconnect was called on the underlying wallet
      expect(mockSuiWallet.accounts.length).toBe(0);
    });

    it("should not throw when disconnecting", async () => {
      await expect(wallet.disconnect()).resolves.not.toThrow();
    });
  });

  describe("getActiveAccount", () => {
    it("should return active account info", async () => {
      const accountInfo = await wallet.getActiveAccount();

      expect(accountInfo).toBeDefined();
      expect(accountInfo.publicKey).toBeInstanceOf(SuiDerivedPublicKey);
    });

    it("should return consistent address for same sui account", async () => {
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
      const testnetWallet = new SuiDerivedWallet(mockSuiWallet, {
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

    it("should use default chainId if not provided", async () => {
      let notifiedNetwork: { chainId?: number } | null = null;

      wallet.onActiveNetworkChange((network) => {
        notifiedNetwork = network;
      });

      await wallet.changeNetwork({
        name: Network.TESTNET,
      });

      expect(notifiedNetwork).not.toBeNull();
      expect(notifiedNetwork!.chainId).toBe(NetworkToChainId[Network.TESTNET]);
    });
  });

  describe("onActiveAccountChange", () => {
    it("should throw not implemented error", () => {
      expect(() => {
        wallet.onActiveAccountChange(() => {});
      }).toThrow("Not implemented");
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

    it("should clear listeners when passed null callback marker", () => {
      const callback = () => {};
      wallet.onActiveNetworkChange(callback);

      // Create a null callback marker (function with _isNull property)
      const nullCallback = Object.assign(() => {}, { _isNull: true });
      // Should not throw
      wallet.onActiveNetworkChange(nullCallback as any);

      // Verify listeners were cleared
      expect(wallet.onActiveNetworkChangeListeners.size).toBe(0);
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
