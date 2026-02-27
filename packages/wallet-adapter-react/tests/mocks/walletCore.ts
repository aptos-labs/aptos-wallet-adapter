/**
 * Mock WalletCore and related types for testing
 */
import { vi } from "vitest";
import type {
  AccountInfo,
  NetworkInfo,
  AdapterWallet,
  AdapterNotDetectedWallet,
} from "@aptos-labs/wallet-adapter-core";

// Test fixtures
export const TEST_ACCOUNT: AccountInfo = {
  address: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  publicKey: new Uint8Array(32).fill(1),
} as unknown as AccountInfo;

export const TEST_NETWORK: NetworkInfo = {
  name: "mainnet" as any,
  chainId: 1,
  url: "https://fullnode.mainnet.aptoslabs.com/v1",
};

export const createMockWallet = (name = "Mock Wallet"): AdapterWallet => ({
  name,
  icon: "data:image/svg+xml,<svg></svg>" as any,
  url: "https://mock-wallet.example.com",
  version: "1.0.0",
  chains: ["aptos:mainnet", "aptos:testnet", "aptos:devnet"],
  accounts: [TEST_ACCOUNT] as any,
  features: {} as any,
  readyState: "Installed" as any,
  isAptosNativeWallet: true,
});

export const createMockNotDetectedWallet = (
  name = "Not Detected Wallet",
): AdapterNotDetectedWallet => ({
  name,
  icon: "data:image/svg+xml,<svg></svg>" as any,
  url: "https://not-detected-wallet.example.com",
  readyState: "NotDetected" as any,
});

// Mock WalletCore class
export const createMockWalletCore = () => {
  const eventHandlers: Record<string, Function[]> = {};

  return {
    // Properties
    account: null as AccountInfo | null,
    network: null as NetworkInfo | null,
    wallet: null as AdapterWallet | null,
    wallets: [] as AdapterWallet[],
    hiddenWallets: [] as AdapterWallet[],
    notDetectedWallets: [] as AdapterNotDetectedWallet[],

    // Methods
    connect: vi.fn(),
    disconnect: vi.fn(),
    signMessage: vi.fn(),
    signMessageAndVerify: vi.fn(),
    signTransaction: vi.fn(),
    signAndSubmitTransaction: vi.fn(),
    submitTransaction: vi.fn(),
    changeNetwork: vi.fn(),
    signIn: vi.fn(),
    onAccountChange: vi.fn(),
    onNetworkChange: vi.fn(),

    // Event emitter methods
    on: vi.fn((event: string, handler: Function) => {
      if (!eventHandlers[event]) {
        eventHandlers[event] = [];
      }
      eventHandlers[event].push(handler);
    }),
    off: vi.fn((event: string, handler: Function) => {
      if (eventHandlers[event]) {
        eventHandlers[event] = eventHandlers[event].filter(
          (h) => h !== handler,
        );
      }
    }),
    emit: vi.fn((event: string, ...args: any[]) => {
      if (eventHandlers[event]) {
        eventHandlers[event].forEach((handler) => handler(...args));
      }
    }),

    // Test helper to trigger events
    __triggerEvent: (event: string, ...args: any[]) => {
      if (eventHandlers[event]) {
        eventHandlers[event].forEach((handler) => handler(...args));
      }
    },
  };
};

export type MockWalletCore = ReturnType<typeof createMockWalletCore>;
