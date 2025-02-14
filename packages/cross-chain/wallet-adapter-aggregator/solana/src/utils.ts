import {
  AnyRawTransaction,
  Ed25519PublicKey,
  Ed25519Signature,
} from "@aptos-labs/ts-sdk";
import {
  AccountInfo,
  APTOS_CHAINS,
  AptosFeatures,
  AptosOnAccountChangeInput,
  AptosSignMessageInput,
  AptosSignMessageOutput,
  UserResponse,
  UserResponseStatus,
} from "@aptos-labs/wallet-standard";

import {
  PublicKey,
  PublicKey as SolanaPublicKey,
  Transaction,
} from "@solana/web3.js";
import { StandardWalletAdapter } from "@solana/wallet-standard-wallet-adapter-base";
import { SolanaBaseWallet, SolanaFeatures } from ".";
import { WalletConnectionError } from "@solana/wallet-adapter-base";

const deriveAccountInfoFromSolanaPublicKey = (
  solanaPublicKey: SolanaPublicKey
) => {
  const publicKey = new Ed25519PublicKey(solanaPublicKey.toBytes());
  const address = publicKey.authKey().derivedAddress();
  return new AccountInfo({ address, publicKey });
};

export const convertSolanaWalletToAptosWallet = (
  solanaWallet: StandardWalletAdapter
): SolanaBaseWallet => {
  const wallet: SolanaBaseWallet = {
    accounts: [],
    chains: APTOS_CHAINS,
    features: {
      ...APTOS_REQUIRED_FEATURES(solanaWallet),
      ...SOLANA_ADDITIONAL_FEATURES(solanaWallet),
    },
    icon: solanaWallet.icon,
    name: solanaWallet.name,
    url: solanaWallet.url,
    version: "1.0.0",
  };
  return wallet;
};

const APTOS_REQUIRED_FEATURES = (
  solanaWallet: StandardWalletAdapter
): AptosFeatures => {
  return {
    "aptos:account": {
      account: async () => {
        if (!solanaWallet.publicKey) {
          throw new Error("Disconnected");
        }
        return deriveAccountInfoFromSolanaPublicKey(solanaWallet.publicKey);
      },
      version: "1.0.0",
    },
    "aptos:connect": {
      connect: async () => {
        try {
          await solanaWallet.connect();
          if (!solanaWallet.publicKey) {
            return { status: UserResponseStatus.REJECTED };
          }

          return {
            args: deriveAccountInfoFromSolanaPublicKey(solanaWallet.publicKey),
            status: UserResponseStatus.APPROVED,
          };
        } catch (e) {
          console.log("e", e);
          if (e instanceof WalletConnectionError) {
            return {
              status: UserResponseStatus.REJECTED,
            };
          }
          throw e;
        }
      },
      version: "1.0.0",
    },
    "aptos:disconnect": {
      disconnect: async () => {
        try {
          await solanaWallet.disconnect();
        } catch (e) {
          throw new Error("Failed to disconnect");
        }
      },
      version: "1.0.0",
    },
    "aptos:network": {
      network: async () => {
        throw new Error(
          "Fetch network info not supported by Solana wallet adapter"
        );
      },
      version: "1.0.0",
    },
    "aptos:signMessage": {
      signMessage: async (message: AptosSignMessageInput) => {
        if (!solanaWallet.signMessage) throw new Error("Not supported");
        try {
          const messageToSign = new TextEncoder().encode(message.message);
          const signature = await solanaWallet.signMessage(messageToSign);
          const response: AptosSignMessageOutput = {
            // address?: string;
            // application?: string;
            // chainId?: number;
            fullMessage: message.message,
            message: message.message,
            nonce: message.nonce,
            prefix: "APTOS",
            signature: new Ed25519Signature(signature),
          };
          return {
            status: UserResponseStatus.APPROVED,
            args: response,
          };
        } catch (e) {
          if (e instanceof Error && e.message.includes("rejected")) {
            return {
              status: UserResponseStatus.REJECTED,
            };
          }
          throw e;
        }
      },
      version: "1.0.0",
    },
    "aptos:signTransaction": {
      signTransaction: async (transaction: AnyRawTransaction) => {
        throw new Error("Not yet implemented");
      },
      version: "1.0.0",
    },
    "aptos:onAccountChange": {
      onAccountChange: async (callback: AptosOnAccountChangeInput) => {
        if (solanaWallet.wallet.features["standard:events"]) {
          solanaWallet.wallet.features["standard:events"].on(
            "change",
            (account) => {
              if (!account.accounts || account.accounts.length === 0) {
                return;
              }
              const accountInfo = deriveAccountInfoFromSolanaPublicKey(
                new PublicKey(account.accounts[0].publicKey)
              );
              callback(accountInfo);
            }
          );
        }
      },
      version: "1.0.0",
    },
    "aptos:onNetworkChange": {
      onNetworkChange: async () => {
        throw new Error(
          "onNetworkChange not yet implemented in solana wallet adapter"
        );
      },
      version: "1.0.0",
    },
  };
};

const SOLANA_ADDITIONAL_FEATURES = (
  solanaWallet: StandardWalletAdapter
): SolanaFeatures => {
  return {
    "solana:signTransaction": {
      signTransaction: async (
        transaction: Transaction
      ): Promise<UserResponse<Transaction>> => {
        if (!solanaWallet.signTransaction) throw new Error("Not supported");
        try {
          const signature = await solanaWallet.signTransaction(transaction);
          return {
            status: UserResponseStatus.APPROVED,
            args: signature,
          };
        } catch (e) {
          if (e instanceof Error && e.message.includes("rejected")) {
            return {
              status: UserResponseStatus.REJECTED,
            };
          }
          throw e;
        }
      },
      version: "1.0.0",
    },
  };
};
