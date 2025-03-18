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
  AptosSignInInput,
  AptosSignInOutput,
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
          throw new Error("No account found").message;
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
        } catch (e: any) {
          if (e instanceof WalletConnectionError) {
            return {
              status: UserResponseStatus.REJECTED,
            };
          }
          throw new Error("Error connecting to wallet" + e).message;
        }
      },
      version: "1.0.0",
    },
    "aptos:disconnect": {
      disconnect: async () => {
        try {
          await solanaWallet.disconnect();
        } catch (e: any) {
          throw new Error("Failed to disconnect" + e).message;
        }
      },
      version: "1.0.0",
    },
    "aptos:network": {
      network: async () => {
        throw new Error(
          "Fetch network info not supported by Solana wallet adapter"
        ).message;
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
            address: deriveAccountInfoFromSolanaPublicKey(
              new PublicKey(solanaWallet.publicKey!)
            ).address.toString(),
            // application?: string;
            // chainId?: number; // TODO: get chain id once Solana RPC/Connection config is supported
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
        } catch (e: any) {
          if (e instanceof Error && e.message.includes("rejected")) {
            return {
              status: UserResponseStatus.REJECTED,
            };
          }
          throw new Error("Error signing message" + e).message;
        }
      },
      version: "1.0.0",
    },
    "aptos:signTransaction": {
      signTransaction: async (transaction: AnyRawTransaction) => {
        throw new Error("signTransaction not yet implemented").message;
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
        ).message;
      },
      version: "1.0.0",
    },
    "aptos:signIn": {
      signIn: async (input: AptosSignInInput) => {
        try {
          if (!solanaWallet.signIn) {
            throw new Error(`signIn not supported in ${solanaWallet.name}`)
              .message;
          }

          const signInInput = {
            domain: window.location.host,
            statement: input.statement,
            nonce: Math.random().toString(36).slice(2),
            uri: input.uri,
            version: input.version,
            chainId: input.chainId,
            issuedAt: input.issuedAt,
            expirationTime: input.expirationTime,
            notBefore: input.notBefore,
          };
          const result = await solanaWallet.signIn(signInInput);
          const response: AptosSignInOutput = {
            account: deriveAccountInfoFromSolanaPublicKey(
              new PublicKey(result.account.publicKey)
            ),
            input: {
              ...input,
              domain: input.uri || "",
              address: deriveAccountInfoFromSolanaPublicKey(
                new PublicKey(result.account.publicKey)
              ).address.toString(),
              uri: input.uri || "",
              version: input.version || "0.1.0",
              chainId: input.chainId || "1", // TODO: get chain id once Solana RPC/Connection config is supported
            },
            plainText: new TextDecoder().decode(result.signedMessage),
            signingMessage: result.signedMessage,
            signature:
              result.signatureType === "ed25519"
                ? new Ed25519Signature(result.signature)
                : (result.signature as any),
            type: result.signatureType || "ed25519",
          };
          return {
            status: UserResponseStatus.APPROVED,
            args: response,
          };
        } catch (e: any) {
          if (e instanceof Error && e.message.includes("rejected")) {
            return {
              status: UserResponseStatus.REJECTED,
            };
          }
          throw new Error("Error signing in" + e).message;
        }
      },
      version: "0.1.0",
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
        if (!solanaWallet.signTransaction)
          throw new Error("signTransaction not supported").message;
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
          throw new Error("Error signing transaction" + e).message;
        }
      },
      version: "1.0.0",
    },
  };
};
