/**
 * Mock Solana Wallet Adapter for testing
 */
import { Keypair, PublicKey } from "@solana/web3.js";
import { createSignInMessage } from "@solana/wallet-standard-util";
import type { SolanaSignInInputWithRequiredFields } from "@solana/wallet-standard-util";
import type { StandardWalletAdapter } from "@solana/wallet-standard-wallet-adapter-base";
import type { WalletIcon } from "@aptos-labs/wallet-standard";
import nacl from "tweetnacl";

type EventCallback = (...args: unknown[]) => void;

export interface MockSolanaWalletOptions {
  keypair: Keypair;
  name?: string;
  supportSignIn?: boolean;
  initiallyConnected?: boolean;
}

/**
 * Creates a mock Solana wallet adapter that simulates wallet behavior
 */
export function createMockSolanaWallet(
  options: MockSolanaWalletOptions
): StandardWalletAdapter & { emit: (event: string, ...args: unknown[]) => void } {
  const {
    keypair,
    name = "Mock Solana Wallet",
    supportSignIn = true,
    initiallyConnected = false,
  } = options;

  const eventListeners: Map<string, Set<EventCallback>> = new Map();
  let isConnected = initiallyConnected;
  let currentPublicKey: PublicKey | null = initiallyConnected
    ? keypair.publicKey
    : null;

  const wallet = {
    name,
    icon: "data:image/svg+xml,<svg></svg>" as WalletIcon,
    url: "https://mock.solana.wallet",
    get publicKey() {
      return currentPublicKey;
    },
    get connected() {
      return isConnected;
    },
    connecting: false,
    readyState: "Installed" as const,

    connect: async () => {
      if (isConnected) {
        // Already connected, no-op
        return;
      }
      isConnected = true;
      currentPublicKey = keypair.publicKey;
      // Emit connect event
      eventListeners.get("connect")?.forEach((cb) => cb(currentPublicKey));
    },

    disconnect: async () => {
      isConnected = false;
      currentPublicKey = null;
      // Emit disconnect event
      eventListeners.get("disconnect")?.forEach((cb) => cb());
    },

    signMessage: async (message: Uint8Array): Promise<Uint8Array> => {
      if (!isConnected) {
        throw new Error("Wallet not connected");
      }
      return nacl.sign.detached(message, keypair.secretKey);
    },

    signIn: supportSignIn
      ? async (input: SolanaSignInInputWithRequiredFields) => {
          if (!isConnected) {
            throw new Error("Wallet not connected");
          }
          const message = createSignInMessage(input);
          const signature = nacl.sign.detached(message, keypair.secretKey);
          return {
            account: {
              address: keypair.publicKey.toBase58(),
              publicKey: keypair.publicKey.toBytes(),
              chains: ["solana:mainnet"],
              features: [],
            },
            signature,
            signatureType: "ed25519" as const,
            signedMessage: message,
          };
        }
      : undefined,

    on: (event: string, callback: EventCallback) => {
      if (!eventListeners.has(event)) {
        eventListeners.set(event, new Set());
      }
      eventListeners.get(event)!.add(callback);
    },

    off: (event: string, callback?: EventCallback) => {
      if (callback) {
        eventListeners.get(event)?.delete(callback);
      } else {
        eventListeners.delete(event);
      }
    },

    // Helper to emit events (for testing)
    emit: (event: string, ...args: unknown[]) => {
      eventListeners.get(event)?.forEach((cb) => cb(...args));
    },
  } as StandardWalletAdapter & {
    emit: (event: string, ...args: unknown[]) => void;
  };

  return wallet;
}

/**
 * Creates a pre-connected mock Solana wallet
 */
export function createConnectedMockSolanaWallet(
  options: MockSolanaWalletOptions
): StandardWalletAdapter {
  return createMockSolanaWallet({ ...options, initiallyConnected: true });
}

/**
 * Test keypair - DO NOT USE IN PRODUCTION
 * Generated deterministically for testing purposes only
 */
export const TEST_SOLANA_KEYPAIR = Keypair.fromSeed(
  new Uint8Array(32).fill(1) // Deterministic seed for reproducible tests
);

/**
 * Derived from TEST_SOLANA_KEYPAIR
 */
export const TEST_SOLANA_PUBLIC_KEY = TEST_SOLANA_KEYPAIR.publicKey;
