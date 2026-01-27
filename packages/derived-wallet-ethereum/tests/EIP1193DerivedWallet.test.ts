import { describe, it, expect, beforeEach } from "vitest";
import {
  AccountInfo,
  APTOS_CHAINS,
  UserResponseStatus,
} from "@aptos-labs/wallet-standard";
import {
  Network,
  NetworkToChainId,
  NetworkToNodeAPI,
} from "@aptos-labs/ts-sdk";
import { EIP1193DerivedWallet } from "../src/EIP1193DerivedWallet";
import { EIP1193DerivedPublicKey } from "../src/EIP1193DerivedPublicKey";
import { defaultEthereumAuthenticationFunction } from "../src/shared";
import {
  createMockEIP6963ProviderDetail,
  TEST_PRIVATE_KEY,
  TEST_ETHEREUM_ADDRESS,
} from "./mocks/eip1193Provider";

describe("EIP1193DerivedWallet", () => {
  let wallet: EIP1193DerivedWallet;
  let providerDetail: ReturnType<typeof createMockEIP6963ProviderDetail>;

  beforeEach(() => {
    providerDetail = createMockEIP6963ProviderDetail({
      privateKey: TEST_PRIVATE_KEY,
      name: "Test Wallet",
      rdns: "com.test.wallet",
    });
    wallet = new EIP1193DerivedWallet(providerDetail);
  });

  describe("constructor", () => {
    it("should create wallet from EIP6963 provider detail", () => {
      expect(wallet).toBeDefined();
      expect(wallet).toBeInstanceOf(EIP1193DerivedWallet);
    });

    it("should set wallet name with (Ethereum) suffix", () => {
      expect(wallet.name).toBe("Test Wallet (Ethereum)");
    });

    it("should set wallet icon from provider info", () => {
      expect(wallet.icon).toBe(providerDetail.info.icon);
    });

    it("should set wallet url from provider rdns", () => {
      expect(wallet.url).toBe("com.test.wallet");
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
      const testnetWallet = new EIP1193DerivedWallet(providerDetail, {
        defaultNetwork: Network.TESTNET,
      });
      expect(testnetWallet.defaultNetwork).toBe(Network.TESTNET);
    });

    it("should use default authentication function", () => {
      expect(wallet.authenticationFunction).toBe(
        defaultEthereumAuthenticationFunction
      );
    });

    it("should allow custom authentication function", () => {
      const customAuthFunction = "0x1::custom::authenticate";
      const customWallet = new EIP1193DerivedWallet(providerDetail, {
        authenticationFunction: customAuthFunction,
      });
      expect(customWallet.authenticationFunction).toBe(customAuthFunction);
    });

    it("should set domain from window.location.host", () => {
      expect(wallet.domain).toBe("test.example.com");
    });

    it("should trim icon whitespace", () => {
      const detailWithWhitespaceIcon = createMockEIP6963ProviderDetail({
        privateKey: TEST_PRIVATE_KEY,
        icon: "  \n  data:image/svg+xml,<svg></svg>  \n  ",
      });
      const walletWithTrimmedIcon = new EIP1193DerivedWallet(
        detailWithWhitespaceIcon
      );
      expect(walletWithTrimmedIcon.icon).toBe("data:image/svg+xml,<svg></svg>");
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
        expect(response.args).toBeInstanceOf(AccountInfo);
      }
    });

    it("should return account with derived public key", async () => {
      const response = await wallet.connect();

      expect(response.status).toBe(UserResponseStatus.APPROVED);
      if (response.status === UserResponseStatus.APPROVED) {
        expect(response.args.publicKey).toBeInstanceOf(EIP1193DerivedPublicKey);
      }
    });

    it("should derive Aptos address from Ethereum address", async () => {
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

      expect(accountInfo).toBeInstanceOf(AccountInfo);
      expect(accountInfo.publicKey).toBeInstanceOf(EIP1193DerivedPublicKey);
    });

    it("should return consistent address for same ethereum account", async () => {
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
      const testnetWallet = new EIP1193DerivedWallet(providerDetail, {
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
        })
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

      // Emit account change event from the mock provider
      (providerDetail.provider as any).emit("accountsChanged", [
        TEST_ETHEREUM_ADDRESS,
      ]);

      // Wait for async callback
      await new Promise((resolve) => setTimeout(resolve, 100));

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

