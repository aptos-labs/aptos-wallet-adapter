/**
 * Mock Wallet implementations for testing WalletCore
 */
import { vi } from "vitest";
import {
  UserResponseStatus,
  type AccountInfo,
  type NetworkInfo,
} from "@aptos-labs/wallet-standard";
import { WalletReadyState } from "../../src/constants";
import type { AdapterWallet } from "../../src/WalletCore";

// Test account info
export const TEST_ACCOUNT = {
  address: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  publicKey: new Uint8Array(32).fill(1),
} as unknown as AccountInfo;

// Test network info
export const TEST_NETWORK: NetworkInfo = {
  name: "mainnet" as any,
  chainId: 1,
  url: "https://fullnode.mainnet.aptoslabs.com/v1",
};

/**
 * Creates a mock AIP-62 compatible wallet for testing.
 * This is a minimal mock that provides the structure needed for WalletCore tests.
 */
export function createMockWallet(
  options: { name?: string } = {},
): AdapterWallet {
  const { name = "Mock Wallet" } = options;

  return {
    name,
    icon: "data:image/svg+xml,<svg></svg>" as any,
    url: "https://mock-wallet.example.com",
    version: "1.0.0",
    chains: ["aptos:mainnet", "aptos:testnet", "aptos:devnet"],
    accounts: [TEST_ACCOUNT] as any,
    features: {
      "aptos:connect": {
        version: "1.0.0",
        connect: vi.fn(async () => ({
          status: UserResponseStatus.APPROVED,
          args: TEST_ACCOUNT,
        })),
      },
      "aptos:disconnect": {
        version: "1.0.0",
        disconnect: vi.fn(async () => {}),
      },
      "aptos:network": {
        version: "1.0.0",
        network: vi.fn(async () => TEST_NETWORK),
      },
      "aptos:signMessage": {
        version: "1.0.0",
        signMessage: vi.fn(),
      },
      "aptos:signTransaction": {
        version: "1.0.0",
        signTransaction: vi.fn(),
      },
      "aptos:onAccountChange": {
        version: "1.0.0",
        onAccountChange: vi.fn(async () => {}),
      },
      "aptos:onNetworkChange": {
        version: "1.0.0",
        onNetworkChange: vi.fn(async () => {}),
      },
      "aptos:signAndSubmitTransaction": {
        version: "1.1.0",
        signAndSubmitTransaction: vi.fn(),
      },
      "aptos:changeNetwork": {
        version: "1.0.0",
        changeNetwork: vi.fn(),
      },
    } as any,
    readyState: WalletReadyState.Installed,
    isAptosNativeWallet: true,
  } as AdapterWallet;
}
