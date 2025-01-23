"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  SolanaWallet: () => SolanaWallet,
  getSolanaStandardWallets: () => getSolanaStandardWallets
});
module.exports = __toCommonJS(src_exports);
var import_wallet_standard2 = require("@aptos-labs/wallet-standard");
var import_wallet_adapter_base2 = require("@solana/wallet-adapter-base");
var import_app = require("@wallet-standard/app");
var import_wallet_standard_wallet_adapter_base = require("@solana/wallet-standard-wallet-adapter-base");
var import_wallet_adapter_aggregator_core = require("@aptos-labs/wallet-adapter-aggregator-core");

// src/utils.ts
var import_ts_sdk = require("@aptos-labs/ts-sdk");
var import_wallet_standard = require("@aptos-labs/wallet-standard");
var import_web3 = require("@solana/web3.js");
var import_wallet_adapter_base = require("@solana/wallet-adapter-base");
var deriveAccountInfoFromSolanaPublicKey = (solanaPublicKey) => {
  const publicKey = new import_ts_sdk.Ed25519PublicKey(solanaPublicKey.toBytes());
  const address = publicKey.authKey().derivedAddress();
  return new import_wallet_standard.AccountInfo({ address, publicKey });
};
var convertSolanaWalletToAptosWallet = (solanaWallet) => {
  const wallet = {
    accounts: [],
    chains: import_wallet_standard.APTOS_CHAINS,
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
            return { status: import_wallet_standard.UserResponseStatus.REJECTED };
          }
          return {
            args: deriveAccountInfoFromSolanaPublicKey(solanaWallet.publicKey),
            status: import_wallet_standard.UserResponseStatus.APPROVED
          };
        } catch (e) {
          console.log("e", e);
          if (e instanceof import_wallet_adapter_base.WalletConnectionError) {
            return {
              status: import_wallet_standard.UserResponseStatus.REJECTED
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
            signature: new import_ts_sdk.Ed25519Signature(signature)
          };
          return {
            status: import_wallet_standard.UserResponseStatus.APPROVED,
            args: response
          };
        } catch (e) {
          if (e instanceof Error && e.message.includes("rejected")) {
            return {
              status: import_wallet_standard.UserResponseStatus.REJECTED
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
                new import_web3.PublicKey(account.accounts[0].publicKey)
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
            status: import_wallet_standard.UserResponseStatus.APPROVED,
            args: signature
          };
        } catch (e) {
          if (e instanceof Error && e.message.includes("rejected")) {
            return {
              status: import_wallet_standard.UserResponseStatus.REJECTED
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
  return (0, import_app.getWallets)().get().filter(import_wallet_adapter_base2.isWalletAdapterCompatibleStandardWallet).map(
    (wallet) => new SolanaWallet(
      convertSolanaWalletToAptosWallet(
        new import_wallet_standard_wallet_adapter_base.StandardWalletAdapter({ wallet })
      )
    )
  );
}
var SolanaWallet = class extends import_wallet_adapter_aggregator_core.AdapterWallet {
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
    return import_wallet_adapter_aggregator_core.WalletReadyState.Installed;
  }
  get chains() {
    return import_wallet_standard2.APTOS_CHAINS;
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
    if (result.status === import_wallet_standard2.UserResponseStatus.REJECTED) {
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
    if (result.status === import_wallet_standard2.UserResponseStatus.REJECTED) {
      throw new Error("User rejected the request").message;
    }
    return result.args;
  }
  async signTransaction(transaction) {
    const result = await this.solanaWallet.features["solana:signTransaction"].signTransaction(transaction);
    if (result.status === import_wallet_standard2.UserResponseStatus.REJECTED) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SolanaWallet,
  getSolanaStandardWallets
});
//# sourceMappingURL=index.js.map