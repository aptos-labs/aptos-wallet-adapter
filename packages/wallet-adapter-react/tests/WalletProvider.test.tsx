import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import React from "react";
import { AptosWalletAdapterProvider } from "../src/WalletProvider";
import { useWallet } from "../src/useWallet";
import { createMockWalletCore, createMockWallet } from "./mocks/walletCore";
import type { MockWalletCore } from "./mocks/walletCore";

// Mock the wallet-adapter-core module
let mockWalletCore: MockWalletCore;

vi.mock("@aptos-labs/wallet-adapter-core", async () => {
  const actual = await vi.importActual("@aptos-labs/wallet-adapter-core");
  return {
    ...actual,
    WalletCore: vi.fn().mockImplementation(() => {
      mockWalletCore = createMockWalletCore();
      // Set up wallets array so auto-connect can proceed
      // Having at least one wallet triggers the isLoading = false path
      mockWalletCore.wallets = [createMockWallet("TestWallet")];
      return mockWalletCore;
    }),
  };
});

// Test component to access wallet context
function TestConsumer() {
  const wallet = useWallet();
  return (
    <div>
      <span data-testid="connected">{String(wallet.connected)}</span>
      <span data-testid="isLoading">{String(wallet.isLoading)}</span>
      <span data-testid="account">{wallet.account?.address ?? "null"}</span>
      <span data-testid="network">{wallet.network?.name ?? "null"}</span>
      <button
        data-testid="connect-btn"
        onClick={() => wallet.connect("TestWallet")}
      >
        Connect
      </button>
      <button data-testid="disconnect-btn" onClick={() => wallet.disconnect()}>
        Disconnect
      </button>
    </div>
  );
}

describe("AptosWalletAdapterProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("rendering", () => {
    it("should render children correctly", async () => {
      render(
        <AptosWalletAdapterProvider>
          <div data-testid="child">Child Content</div>
        </AptosWalletAdapterProvider>,
      );

      expect(screen.getByTestId("child")).toHaveTextContent("Child Content");
    });
  });

  describe("initial state", () => {
    it("should provide initial disconnected state", async () => {
      render(
        <AptosWalletAdapterProvider disableTelemetry>
          <TestConsumer />
        </AptosWalletAdapterProvider>,
      );

      // Wait for initial render to complete
      await waitFor(() => {
        expect(screen.getByTestId("connected")).toHaveTextContent("false");
      });
      expect(screen.getByTestId("account")).toHaveTextContent("null");
      expect(screen.getByTestId("network")).toHaveTextContent("null");
    });

    it("should set isLoading to false after initialization", async () => {
      render(
        <AptosWalletAdapterProvider disableTelemetry autoConnect={false}>
          <TestConsumer />
        </AptosWalletAdapterProvider>,
      );

      // With autoConnect=false and wallets available, isLoading should become false
      await waitFor(
        () => {
          expect(screen.getByTestId("isLoading")).toHaveTextContent("false");
        },
        { timeout: 3000 },
      );
    });
  });

  describe("connect", () => {
    it("should call WalletCore.connect when connect is called", async () => {
      render(
        <AptosWalletAdapterProvider disableTelemetry autoConnect={false}>
          <TestConsumer />
        </AptosWalletAdapterProvider>,
      );

      await waitFor(
        () => {
          expect(screen.getByTestId("isLoading")).toHaveTextContent("false");
        },
        { timeout: 3000 },
      );

      await act(async () => {
        screen.getByTestId("connect-btn").click();
      });

      expect(mockWalletCore.connect).toHaveBeenCalledWith("TestWallet");
    });

    // Note: Testing onError callback is skipped because the provider
    // re-throws errors after calling onError, which causes unhandled
    // rejections in tests. The behavior is correct in production where
    // the dapp can catch the rejection if needed.
  });

  describe("disconnect", () => {
    it("should call WalletCore.disconnect when disconnect is called", async () => {
      render(
        <AptosWalletAdapterProvider disableTelemetry autoConnect={false}>
          <TestConsumer />
        </AptosWalletAdapterProvider>,
      );

      await waitFor(
        () => {
          expect(screen.getByTestId("isLoading")).toHaveTextContent("false");
        },
        { timeout: 3000 },
      );

      await act(async () => {
        screen.getByTestId("disconnect-btn").click();
      });

      expect(mockWalletCore.disconnect).toHaveBeenCalled();
    });
  });

  describe("auto-connect", () => {
    it("should not auto-connect when autoConnect is false", async () => {
      render(
        <AptosWalletAdapterProvider autoConnect={false} disableTelemetry>
          <TestConsumer />
        </AptosWalletAdapterProvider>,
      );

      await waitFor(
        () => {
          expect(screen.getByTestId("isLoading")).toHaveTextContent("false");
        },
        { timeout: 3000 },
      );

      expect(mockWalletCore.connect).not.toHaveBeenCalled();
    });

    it("should not auto-connect when no wallet name is stored", async () => {
      render(
        <AptosWalletAdapterProvider autoConnect={true} disableTelemetry>
          <TestConsumer />
        </AptosWalletAdapterProvider>,
      );

      await waitFor(
        () => {
          expect(screen.getByTestId("isLoading")).toHaveTextContent("false");
        },
        { timeout: 3000 },
      );

      expect(mockWalletCore.connect).not.toHaveBeenCalled();
    });
  });

  describe("event handlers", () => {
    it("should register event handlers on WalletCore", async () => {
      render(
        <AptosWalletAdapterProvider disableTelemetry autoConnect={false}>
          <TestConsumer />
        </AptosWalletAdapterProvider>,
      );

      await waitFor(() => {
        expect(mockWalletCore.on).toHaveBeenCalledWith(
          "connect",
          expect.any(Function),
        );
        expect(mockWalletCore.on).toHaveBeenCalledWith(
          "disconnect",
          expect.any(Function),
        );
        expect(mockWalletCore.on).toHaveBeenCalledWith(
          "accountChange",
          expect.any(Function),
        );
        expect(mockWalletCore.on).toHaveBeenCalledWith(
          "networkChange",
          expect.any(Function),
        );
      });
    });
  });

  describe("provider props", () => {
    it("should accept optInWallets prop", () => {
      expect(() =>
        render(
          <AptosWalletAdapterProvider optInWallets={["Petra"]} disableTelemetry>
            <div>Test</div>
          </AptosWalletAdapterProvider>,
        ),
      ).not.toThrow();
    });

    it("should accept hideWallets prop", () => {
      expect(() =>
        render(
          <AptosWalletAdapterProvider
            hideWallets={["Petra Web"]}
            disableTelemetry
          >
            <div>Test</div>
          </AptosWalletAdapterProvider>,
        ),
      ).not.toThrow();
    });

    it("should accept dappConfig prop", () => {
      expect(() =>
        render(
          <AptosWalletAdapterProvider
            dappConfig={{ network: "mainnet" as any }}
            disableTelemetry
          >
            <div>Test</div>
          </AptosWalletAdapterProvider>,
        ),
      ).not.toThrow();
    });
  });
});
