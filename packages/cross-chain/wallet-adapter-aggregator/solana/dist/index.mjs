// src/index.ts
import {
  APTOS_CHAINS as APTOS_CHAINS2,
  UserResponseStatus as UserResponseStatus2
} from "@aptos-labs/wallet-standard";
import { isWalletAdapterCompatibleStandardWallet } from "@solana/wallet-adapter-base";
import { getWallets } from "@wallet-standard/app";
import { StandardWalletAdapter } from "@solana/wallet-standard-wallet-adapter-base";
import {
  AdapterWallet,
  WalletReadyState
} from "@aptos-labs/wallet-adapter-aggregator-core";

// src/utils.ts
import {
  Ed25519PublicKey,
  Ed25519Signature
} from "@aptos-labs/ts-sdk";
import {
  AccountInfo,
  APTOS_CHAINS,
  UserResponseStatus
} from "@aptos-labs/wallet-standard";
import {
  PublicKey
} from "@solana/web3.js";
import { WalletConnectionError } from "@solana/wallet-adapter-base";
var deriveAccountInfoFromSolanaPublicKey = (solanaPublicKey) => {
  const publicKey = new Ed25519PublicKey(solanaPublicKey.toBytes());
  const address = publicKey.authKey().derivedAddress();
  return new AccountInfo({ address, publicKey });
};
var convertSolanaWalletToAptosWallet = (solanaWallet) => {
  const wallet = {
    accounts: [],
    chains: APTOS_CHAINS,
    features: {
      ...APTOS_REQUIRED_FEATURES(solanaWallet),
      ...SOLANA_ADDITIONAL_FEATURES(solanaWallet)
    },
    icon: solanaWallet.icon,
    name: solanaWallet.name,
    url: solanaWallet.url,
    version: "1.0.0"
  };
  return wallet;
};
var APTOS_REQUIRED_FEATURES = (solanaWallet) => {
  return {
    "aptos:account": {
      account: async () => {
        if (!solanaWallet.publicKey) {
          throw new Error("Disconnected");
        }
        return deriveAccountInfoFromSolanaPublicKey(solanaWallet.publicKey);
      },
      version: "1.0.0"
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
            status: UserResponseStatus.APPROVED
          };
        } catch (e) {
          console.log("e", e);
          if (e instanceof WalletConnectionError) {
            return {
              status: UserResponseStatus.REJECTED
            };
          }
          throw e;
        }
      },
      version: "1.0.0"
    },
    "aptos:disconnect": {
      disconnect: async () => {
        try {
          await solanaWallet.disconnect();
        } catch (e) {
          throw new Error("Failed to disconnect");
        }
      },
      version: "1.0.0"
    },
    "aptos:network": {
      network: async () => {
        throw new Error(
          "Fetch network info not supported by Solana wallet adapter"
        );
      },
      version: "1.0.0"
    },
    "aptos:signMessage": {
      signMessage: async (message) => {
        if (!solanaWallet.signMessage)
          throw new Error("Not supported");
        try {
          const messageToSign = new TextEncoder().encode(message.message);
          const signature = await solanaWallet.signMessage(messageToSign);
          const response = {
            fullMessage: message.message,
            message: message.message,
            nonce: message.nonce,
            prefix: "APTOS",
            signature: new Ed25519Signature(signature)
          };
          return {
            status: UserResponseStatus.APPROVED,
            args: response
          };
        } catch (e) {
          if (e instanceof Error && e.message.includes("rejected")) {
            return {
              status: UserResponseStatus.REJECTED
            };
          }
          throw e;
        }
      },
      version: "1.0.0"
    },
    "aptos:signTransaction": {
      signTransaction: async (transaction) => {
        throw new Error("Not yet implemented");
      },
      version: "1.0.0"
    },
    "aptos:onAccountChange": {
      onAccountChange: async (callback) => {
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
      version: "1.0.0"
    },
    "aptos:onNetworkChange": {
      onNetworkChange: async () => {
        throw new Error(
          "onNetworkChange not yet implemented in solana wallet adapter"
        );
      },
      version: "1.0.0"
    }
  };
};
var SOLANA_ADDITIONAL_FEATURES = (solanaWallet) => {
  return {
    "solana:signTransaction": {
      signTransaction: async (transaction) => {
        if (!solanaWallet.signTransaction)
          throw new Error("Not supported");
        try {
          const signature = await solanaWallet.signTransaction(transaction);
          return {
            status: UserResponseStatus.APPROVED,
            args: signature
          };
        } catch (e) {
          if (e instanceof Error && e.message.includes("rejected")) {
            return {
              status: UserResponseStatus.REJECTED
            };
          }
          throw e;
        }
      },
      version: "1.0.0"
    }
  };
};

// src/index.ts
function getSolanaStandardWallets() {
  return getWallets().get().filter(isWalletAdapterCompatibleStandardWallet).map(
    (wallet) => new SolanaWallet(
      convertSolanaWalletToAptosWallet(
        new StandardWalletAdapter({ wallet })
      )
    )
  );
}
var SolanaWallet = class extends AdapterWallet {
  constructor(solanaWallet) {
    super();
    this.version = "1.0.0";
    this.accounts = [];
    this.connected = false;
    this.solanaWallet = solanaWallet;
  }
  get icon() {
    return this.solanaWallet.icon;
  }
  get name() {
    return this.solanaWallet.name;
  }
  get url() {
    return this.solanaWallet.url;
  }
  get readyState() {
    return WalletReadyState.Installed;
  }
  get chains() {
    return APTOS_CHAINS2;
  }
  get isConnected() {
    return this.connected;
  }
  async getAccount() {
    return await this.solanaWallet.features["aptos:account"].account();
  }
  async getConnectedNetwork() {
    return await this.solanaWallet.features["aptos:network"].network();
  }
  async connect() {
    const result = await this.solanaWallet.features["aptos:connect"].connect();
    if (result.status === UserResponseStatus2.REJECTED) {
      throw new Error("User rejected the request").message;
    }
    await this.onAccountChange();
    this.connected = true;
    return result.args;
  }
  async disconnect() {
    if (!this.connected) {
      return;
    }
    await this.solanaWallet.features["aptos:disconnect"].disconnect();
    this.connected = false;
  }
  async signMessage(message) {
    const result = await this.solanaWallet.features["aptos:signMessage"].signMessage(
      message
    );
    if (result.status === UserResponseStatus2.REJECTED) {
      throw new Error("User rejected the request").message;
    }
    return result.args;
  }
  async signTransaction(transaction) {
    const result = await this.solanaWallet.features["solana:signTransaction"].signTransaction(transaction);
    if (result.status === UserResponseStatus2.REJECTED) {
      throw new Error("User rejected");
    }
    return result.args;
  }
  async onAccountChange() {
    await this.solanaWallet.features["aptos:onAccountChange"].onAccountChange(
      async (account) => {
        this.emit("accountChange", account);
      }
    );
  }
  async onNetworkChange(callback) {
    await this.solanaWallet.features["aptos:onNetworkChange"].onNetworkChange(
      callback
    );
  }
};
export {
  SolanaWallet,
  getSolanaStandardWallets
};
//# sourceMappingURL=index.mjs.map