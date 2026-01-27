/**
 * Mock EIP1193 Provider for testing Ethereum wallet interactions
 */
import { Wallet, hashMessage, Signature } from "ethers";
import type { EIP1193Provider, EIP6963ProviderDetail } from "mipd";

type EventCallback = (...args: unknown[]) => void;

export interface MockEIP1193ProviderOptions {
  privateKey: string;
  chainId?: number;
}

/**
 * Creates a mock EIP1193 provider that simulates an Ethereum wallet
 */
export function createMockEIP1193Provider(
  options: MockEIP1193ProviderOptions
): EIP1193Provider {
  const { privateKey, chainId = 1 } = options;
  const wallet = new Wallet(privateKey);

  const eventListeners: Map<string, Set<EventCallback>> = new Map();

  const provider: EIP1193Provider = {
    request: async ({ method, params }: { method: string; params?: unknown[] }) => {
      switch (method) {
        case "eth_requestAccounts":
        case "eth_accounts":
          return [wallet.address];

        case "eth_chainId":
          return `0x${chainId.toString(16)}`;

        case "personal_sign": {
          // personal_sign params: [message, address]
          const message = (params as string[])[0];
          // Use the wallet's signMessage which handles personal_sign format
          const signature = await wallet.signMessage(
            typeof message === "string" && message.startsWith("0x")
              ? Buffer.from(message.slice(2), "hex")
              : message
          );
          return signature;
        }

        case "eth_sign": {
          // eth_sign params: [address, message]
          const messageToSign = (params as string[])[1];
          const messageHash = hashMessage(messageToSign);
          const sig = wallet.signingKey.sign(messageHash);
          return Signature.from(sig).serialized;
        }

        case "wallet_switchEthereumChain":
          // Simulate successful chain switch
          return null;

        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    },

    on: (event: string, callback: EventCallback) => {
      if (!eventListeners.has(event)) {
        eventListeners.set(event, new Set());
      }
      eventListeners.get(event)!.add(callback);
    },

    removeListener: (event: string, callback: EventCallback) => {
      eventListeners.get(event)?.delete(callback);
    },

    // Helper to emit events (for testing account/network changes)
    emit: (event: string, ...args: unknown[]) => {
      eventListeners.get(event)?.forEach((cb) => cb(...args));
    },
  } as EIP1193Provider & { emit: (event: string, ...args: unknown[]) => void };

  return provider;
}

/**
 * Creates a mock EIP6963 provider detail for wallet registration
 */
export function createMockEIP6963ProviderDetail(
  options: MockEIP1193ProviderOptions & {
    name?: string;
    rdns?: string;
    icon?: string;
  }
): EIP6963ProviderDetail {
  const provider = createMockEIP1193Provider(options);

  return {
    info: {
      uuid: "mock-wallet-uuid",
      name: options.name ?? "Mock Wallet",
      rdns: options.rdns ?? "com.mock.wallet",
      icon: (options.icon ?? "data:image/svg+xml,<svg></svg>") as `data:image/${string}`,
    },
    provider,
  };
}

/**
 * Test private key - DO NOT USE IN PRODUCTION
 * This is a well-known test private key for testing purposes only
 */
export const TEST_PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

/**
 * Derived from TEST_PRIVATE_KEY
 */
export const TEST_ETHEREUM_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

