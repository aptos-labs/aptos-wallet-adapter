import {
  APTOS_CHAINS,
  AptosFeatures,
  AptosOnAccountChangeInput,
  AptosOnNetworkChangeInput,
  AptosSignMessageInput,
  AptosSignMessageOutput,
  UserResponse,
  UserResponseStatus,
} from "@aptos-labs/wallet-standard";
import { AnyRawTransaction } from "@aptos-labs/ts-sdk";
import { ethers, TransactionRequest, version } from "ethers";
import {
  Eip6963BaseWallet,
  Eip6963Features,
  EIP6963ProviderInfo,
  Eip6963Wallets,
  Eip6963WalletUrls,
} from ".";

export const convertEip6963WalletToAptosWallet = (
  eip6963Wallet: EIP6963ProviderInfo
) => {
  const wallet: Eip6963BaseWallet = {
    accounts: [],
    chains: APTOS_CHAINS,
    features: {
      ...APTOS_REQUIRED_FEATURES(eip6963Wallet),
      ...EIP6963_ADDITIONAL_FEATURES(eip6963Wallet),
    },
    icon: eip6963Wallet.info.icon,
    name: eip6963Wallet.info.name,
    url: Eip6963WalletUrls[eip6963Wallet.info.name as Eip6963Wallets],
    version: "1.0.0",
  };
  return wallet;
};

const APTOS_REQUIRED_FEATURES = (
  eip6963Wallet: EIP6963ProviderInfo
): AptosFeatures => {
  return {
    "aptos:account": {
      account: async () => {
        throw new Error("Not yet implemented");
      },
      version: "1.0.0",
    },
    "aptos:connect": {
      connect: async () => {
        throw new Error("Not yet implemented");
      },
      version: "1.0.0",
    },
    "aptos:disconnect": {
      disconnect: async () => {
        try {
          eip6963Wallet.provider.on("disconnect", (error: any) => {
            console.error("EIP-6963 wallet disconnected", error);
          });
        } catch (error) {
          throw new Error("Failed to disconnect").message;
        }
      },
      version: "1.0.0",
    },
    "aptos:network": {
      network: async () => {
        const chainId = await eip6963Wallet.provider.request({
          method: "eth_chainId",
        });
        /**
         * The returned chain ID is in hexadecimal, need to convert to decimal.
         */
        // TODO: create an internal chainId->name mapping database
        return { name: parseInt(chainId, 16) as any, chainId };
      },
      version: "1.0.0",
    },
    "aptos:signMessage": {
      signMessage: async (message: AptosSignMessageInput) => {
        const accounts = await eip6963Wallet.provider
          .request({ method: "eth_requestAccounts" })
          .catch(console.error);
        const signature = await eip6963Wallet.provider.request({
          method: "personal_sign",
          params: [message.message, accounts[0]],
        });
        const response: AptosSignMessageOutput = {
          // address?: string;
          // application?: string;
          // chainId?: number;
          fullMessage: message.message,
          message: message.message,
          nonce: message.nonce,
          prefix: "APTOS",
          signature: signature as any,
        };
        return {
          status: UserResponseStatus.APPROVED,
          args: response,
        };
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
        throw new Error("Not yet implemented");
      },
      version: "1.0.0",
    },
    "aptos:onNetworkChange": {
      onNetworkChange: async (callback: AptosOnNetworkChangeInput) => {
        eip6963Wallet.provider.on("chainChanged", (chainId: string) => {
          console.log("chainId", chainId);
          callback({
            // TODO: create an internal chainId->name mapping database
            name: parseInt(chainId) as any,
            chainId: parseInt(chainId),
          });
        });
      },
      version: "1.0.0",
    },
  };
};

const EIP6963_ADDITIONAL_FEATURES = (
  eip6963Wallet: EIP6963ProviderInfo
): Eip6963Features => {
  const features: Eip6963Features = {
    "eip6963:account": {
      account: async () => {
        const accounts = await eip6963Wallet.provider
          .request({ method: "eth_requestAccounts" })
          .catch(console.error);
        return {
          address: accounts[0],
          publicKey: ethers.getBytes(accounts[0]),
        };
      },
      version: "1.0.0",
    },
    "eip6963:connect": {
      connect: async () => {
        try {
          const accounts = await eip6963Wallet.provider
            .request({ method: "eth_requestAccounts" })
            .catch((error: any) => {
              throw new Error("Error connecting to wallet" + error).message;
            });

          return {
            args: {
              address: accounts[0],
              publicKey: ethers.getBytes(accounts[0]),
            },
            status: UserResponseStatus.APPROVED,
          };
        } catch (error) {
          if (
            error instanceof Error &&
            error.message.includes("refused connection")
          ) {
            return {
              status: UserResponseStatus.REJECTED,
            };
          }
          throw error;
        }
      },
      version: "1.0.0",
    },
    "eip6963:sendTransaction": {
      sendTransaction: async (
        transaction: TransactionRequest,
        provider: ethers.BrowserProvider
      ): Promise<UserResponse<string>> => {
        try {
          const signer = await provider.getSigner();
          if (!signer) {
            throw new Error("No signer found");
          }
          const response = await signer.sendTransaction(transaction);
          const receipt = await response.wait();
          return {
            status: UserResponseStatus.APPROVED,
            args: receipt?.hash || "",
          };
        } catch (error: any) {
          if (error instanceof Error && error.message.includes("rejected")) {
            return {
              status: UserResponseStatus.REJECTED,
            };
          }
          throw new Error(error).message;
        }
      },
      version: "1.0.0",
    },
    "eip6963:onAccountChange": {
      onAccountChange: async (
        callback: (newAccount: {
          address: string;
          publicKey: Uint8Array<ArrayBufferLike>;
        }) => void
      ) => {
        eip6963Wallet.provider.on(
          "accountsChanged",
          (accounts: Array<string>) => {
            const accountInfo = {
              address: accounts[0],
              publicKey: ethers.getBytes(accounts[0]),
            };
            callback(accountInfo);
          }
        );
      },
      version: "1.0.0",
    },
  };
  return features;
};
