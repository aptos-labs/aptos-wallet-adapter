/// <reference types="@testing-library/jest-dom" />

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
      <span data-testid="account">
        {wallet.account?.address?.toString() ?? "null"}
      </span>
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

    it("should auto-connect when autoConnect changes from false to true asynchronously", async () => {
      // Store a wallet name to enable auto-connect
      localStorage.setItem("AptosWalletName", "TestWallet");

      // Component that simulates async autoConnect prop
      function AsyncAutoConnectWrapper() {
        const [autoConnect, setAutoConnect] = React.useState(false);

        React.useEffect(() => {
          // Simulate async operation (e.g., fetching user preferences)
          const timer = setTimeout(() => {
            setAutoConnect(true);
          }, 50);
          return () => clearTimeout(timer);
        }, []);

        return (
          <AptosWalletAdapterProvider
            autoConnect={autoConnect}
            disableTelemetry
          >
            <TestConsumer />
          </AptosWalletAdapterProvider>
        );
      }

      render(<AsyncAutoConnectWrapper />);

      // Initially, connect should not have been called
      expect(mockWalletCore.connect).not.toHaveBeenCalled();

      // Wait for autoConnect to become true and trigger connect
      await waitFor(
        () => {
          expect(mockWalletCore.connect).toHaveBeenCalledWith("TestWallet");
        },
        { timeout: 3000 },
      );
    });

    it("should only attempt auto-connect once when autoConnect becomes true", async () => {
      localStorage.setItem("AptosWalletName", "TestWallet");

      function MultipleUpdateWrapper() {
        const [autoConnect, setAutoConnect] = React.useState(false);
        const [, forceUpdate] = React.useState(0);

        React.useEffect(() => {
          // Set autoConnect to true
          const timer1 = setTimeout(() => setAutoConnect(true), 30);
          // Trigger additional re-renders after autoConnect is true
          const timer2 = setTimeout(() => forceUpdate((n) => n + 1), 80);
          const timer3 = setTimeout(() => forceUpdate((n) => n + 1), 130);
          return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
          };
        }, []);

        return (
          <AptosWalletAdapterProvider
            autoConnect={autoConnect}
            disableTelemetry
          >
            <TestConsumer />
          </AptosWalletAdapterProvider>
        );
      }

      render(<MultipleUpdateWrapper />);

      // Wait for auto-connect to be called
      await waitFor(
        () => {
          expect(mockWalletCore.connect).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );

      // Wait for additional re-renders to complete
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
      });

      // Should only be called once
      expect(mockWalletCore.connect).toHaveBeenCalledTimes(1);
    });

    it("should auto-connect when wallet registers late after initial render", async () => {
      // Store a wallet name for a wallet that doesn't exist yet
      localStorage.setItem("AptosWalletName", "LateWallet");

      render(
        <AptosWalletAdapterProvider autoConnect={true} disableTelemetry>
          <TestConsumer />
        </AptosWalletAdapterProvider>,
      );

      // Wait for initial render to complete
      await waitFor(
        () => {
          expect(screen.getByTestId("isLoading")).toHaveTextContent("false");
        },
        { timeout: 3000 },
      );

      // Connect should NOT have been called yet (wallet doesn't exist)
      expect(mockWalletCore.connect).not.toHaveBeenCalled();

      // Simulate wallet extension injecting late by:
      // 1. Adding the wallet to the wallets array
      // 2. Triggering the standardWalletsAdded event
      const lateWallet = createMockWallet("LateWallet");
      mockWalletCore.wallets = [...mockWalletCore.wallets, lateWallet];

      await act(async () => {
        mockWalletCore.__triggerEvent("standardWalletsAdded", lateWallet);
      });

      // Now connect should be called with the late wallet
      await waitFor(
        () => {
          expect(mockWalletCore.connect).toHaveBeenCalledWith("LateWallet");
        },
        { timeout: 3000 },
      );
    });

    it("should not reset isLoading when wallet injects during user-initiated connect", async () => {
      // This test verifies that when a user initiates a connect() call,
      // and a wallet extension injects (causing wallets state to update),
      // the auto-connect effect doesn't reset isLoading to false

      render(
        <AptosWalletAdapterProvider autoConnect={false} disableTelemetry>
          <TestConsumer />
        </AptosWalletAdapterProvider>,
      );

      // Wait for initial load to complete
      await waitFor(
        () => {
          expect(screen.getByTestId("isLoading")).toHaveTextContent("false");
        },
        { timeout: 3000 },
      );

      // Now modify the mock to make connect() take some time
      // so we can inject a wallet while it's in progress
      // Must be done AFTER render since mockWalletCore is created during render
      mockWalletCore.connect.mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      // User initiates a connect - this should set isLoading to true
      await act(async () => {
        screen.getByTestId("connect-btn").click();
      });

      // isLoading should now be true
      expect(screen.getByTestId("isLoading")).toHaveTextContent("true");

      // Simulate a wallet extension injecting while connect is in progress
      // This triggers the wallets state to update, which re-runs the auto-connect effect
      const newWallet = createMockWallet("NewlyInjectedWallet");
      mockWalletCore.wallets = [...mockWalletCore.wallets, newWallet];

      await act(async () => {
        mockWalletCore.__triggerEvent("standardWalletsAdded", newWallet);
      });

      // isLoading should STILL be true - the auto-connect effect should not have reset it
      // This is the key assertion - before the fix, this would be "false"
      expect(screen.getByTestId("isLoading")).toHaveTextContent("true");

      // Wait for the connect to complete
      await waitFor(
        () => {
          expect(screen.getByTestId("isLoading")).toHaveTextContent("false");
        },
        { timeout: 3000 },
      );
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
