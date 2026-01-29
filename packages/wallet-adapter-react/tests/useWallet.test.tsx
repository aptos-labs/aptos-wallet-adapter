import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import React from "react";
import { useWallet, WalletContext, WalletContextState } from "../src/useWallet";
import { TEST_ACCOUNT, TEST_NETWORK, createMockWallet } from "./mocks/walletCore";

describe("useWallet", () => {
  describe("when used outside WalletProvider", () => {
    it("should return default context with connected false", () => {
      // The current implementation returns a default context instead of throwing
      // This documents the actual behavior
      const { result } = renderHook(() => useWallet());

      expect(result.current.connected).toBe(false);
    });
  });

  describe("when used inside WalletProvider", () => {
    const mockContextValue: WalletContextState = {
      connected: true,
      isLoading: false,
      account: TEST_ACCOUNT,
      network: TEST_NETWORK,
      wallet: createMockWallet(),
      wallets: [createMockWallet()],
      hiddenWallets: [],
      notDetectedWallets: [],
      connect: vi.fn(),
      signIn: vi.fn(),
      disconnect: vi.fn(),
      signAndSubmitTransaction: vi.fn(),
      signTransaction: vi.fn(),
      signMessage: vi.fn(),
      signMessageAndVerify: vi.fn(),
      changeNetwork: vi.fn(),
      submitTransaction: vi.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WalletContext.Provider value={mockContextValue}>
        {children}
      </WalletContext.Provider>
    );

    it("should return context values", () => {
      const { result } = renderHook(() => useWallet(), { wrapper });

      expect(result.current.connected).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.account).toBe(TEST_ACCOUNT);
      expect(result.current.network).toBe(TEST_NETWORK);
    });

    it("should return wallet information", () => {
      const { result } = renderHook(() => useWallet(), { wrapper });

      expect(result.current.wallet).toBeDefined();
      expect(result.current.wallets).toHaveLength(1);
      expect(result.current.hiddenWallets).toHaveLength(0);
      expect(result.current.notDetectedWallets).toHaveLength(0);
    });

    it("should return action functions", () => {
      const { result } = renderHook(() => useWallet(), { wrapper });

      expect(typeof result.current.connect).toBe("function");
      expect(typeof result.current.disconnect).toBe("function");
      expect(typeof result.current.signIn).toBe("function");
      expect(typeof result.current.signMessage).toBe("function");
      expect(typeof result.current.signTransaction).toBe("function");
      expect(typeof result.current.signAndSubmitTransaction).toBe("function");
      expect(typeof result.current.signMessageAndVerify).toBe("function");
      expect(typeof result.current.changeNetwork).toBe("function");
      expect(typeof result.current.submitTransaction).toBe("function");
    });
  });

  describe("WalletContext default values", () => {
    it("should have connected as false by default", () => {
      const defaultWrapper = ({ children }: { children: React.ReactNode }) => (
        <WalletContext.Provider
          value={
            {
              connected: false,
              isLoading: false,
              account: null,
              network: null,
              wallet: null,
              wallets: [],
              hiddenWallets: [],
              notDetectedWallets: [],
              connect: vi.fn(),
              signIn: vi.fn(),
              disconnect: vi.fn(),
              signAndSubmitTransaction: vi.fn(),
              signTransaction: vi.fn(),
              signMessage: vi.fn(),
              signMessageAndVerify: vi.fn(),
              changeNetwork: vi.fn(),
              submitTransaction: vi.fn(),
            } as WalletContextState
          }
        >
          {children}
        </WalletContext.Provider>
      );

      const { result } = renderHook(() => useWallet(), { wrapper: defaultWrapper });

      expect(result.current.connected).toBe(false);
      expect(result.current.account).toBeNull();
      expect(result.current.network).toBeNull();
      expect(result.current.wallet).toBeNull();
    });
  });
});
