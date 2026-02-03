/**
 * Mock Sui Wallet for testing
 */
import type { Wallet, WalletAccount } from "@mysten/wallet-standard";
import type { WalletIcon } from "@aptos-labs/wallet-standard";
import { toBase64 } from "@mysten/bcs";
import nacl from "tweetnacl";

export interface MockSuiWalletOptions {
  keypair: nacl.SignKeyPair;
  name?: string;
  initiallyConnected?: boolean;
}

/**
 * Test keypair - DO NOT USE IN PRODUCTION
 * Generated deterministically for testing purposes only
 */
export const TEST_SUI_KEYPAIR = nacl.sign.keyPair.fromSeed(
  new Uint8Array(32).fill(1), // Deterministic seed for reproducible tests
);

/**
 * Derive Sui address from public key (simplified for testing)
 * In reality, Sui addresses are derived differently, but for testing
 * we just use a hex representation of the public key
 */
function deriveSuiAddress(publicKey: Uint8Array): string {
  // Sui addresses are 32 bytes hex with 0x prefix
  return (
    "0x" +
    Array.from(publicKey)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

/**
 * Derived from TEST_SUI_KEYPAIR
 */
export const TEST_SUI_ADDRESS = deriveSuiAddress(TEST_SUI_KEYPAIR.publicKey);

/**
 * Creates a mock Sui wallet that simulates wallet behavior
 */
export function createMockSuiWallet(options: MockSuiWalletOptions): Wallet {
  const {
    keypair,
    name = "Mock Sui Wallet",
    initiallyConnected = false,
  } = options;

  const suiAddress = deriveSuiAddress(keypair.publicKey);

  const mockAccount: WalletAccount = {
    address: suiAddress,
    publicKey: keypair.publicKey,
    chains: ["sui:mainnet", "sui:testnet", "sui:devnet"],
    features: ["sui:signPersonalMessage"],
  };

  let accounts: readonly WalletAccount[] = initiallyConnected
    ? [mockAccount]
    : [];

  const wallet: Wallet = {
    name,
    icon: "data:image/svg+xml,<svg></svg>" as WalletIcon,
    version: "1.0.0" as const,
    chains: ["sui:mainnet", "sui:testnet", "sui:devnet"],
    // Use getter so accounts reflects updates after connect/disconnect
    get accounts() {
      return accounts;
    },

    features: {
      "standard:connect": {
        version: "1.0.0" as const,
        connect: async () => {
          accounts = [mockAccount];
          return { accounts };
        },
      },
      "standard:disconnect": {
        version: "1.0.0" as const,
        disconnect: async () => {
          accounts = [];
        },
      },
      "standard:events": {
        version: "1.0.0" as const,
        on: () => () => {},
      },
      "sui:signPersonalMessage": {
        version: "1.0.0" as const,
        signPersonalMessage: async (input: {
          message: Uint8Array;
          account: WalletAccount;
        }) => {
          // Sign the message using Ed25519
          const signature = nacl.sign.detached(
            input.message,
            keypair.secretKey,
          );

          // Sui signatures are: scheme flag (1 byte) + signature (64 bytes) + public key (32 bytes)
          // For Ed25519, scheme flag is 0x00
          const fullSignature = new Uint8Array(1 + 64 + 32);
          fullSignature[0] = 0x00; // Ed25519 scheme flag
          fullSignature.set(signature, 1);
          fullSignature.set(keypair.publicKey, 65);

          return {
            signature: toBase64(fullSignature),
            bytes: toBase64(input.message),
          };
        },
      },
    },
  };

  return wallet;
}

/**
 * Creates a pre-connected mock Sui wallet
 */
export function createConnectedMockSuiWallet(
  options: MockSuiWalletOptions,
): Wallet {
  return createMockSuiWallet({ ...options, initiallyConnected: true });
}

/**
 * Creates a mock wallet without signPersonalMessage feature
 * Useful for testing missing feature handling
 */
export function createWalletWithoutSignFeature(
  options: MockSuiWalletOptions,
): Wallet {
  const wallet = createConnectedMockSuiWallet(options);
  delete (wallet.features as any)["sui:signPersonalMessage"];
  return wallet;
}
