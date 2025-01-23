// src/index.ts
import {
  APTOS_CHAINS as APTOS_CHAINS2,
  UserResponseStatus as UserResponseStatus2
} from "@aptos-labs/wallet-standard";
import { ethers as ethers2 } from "ethers";
import {
  AdapterWallet,
  WalletReadyState
} from "@aptos-labs/wallet-adapter-aggregator-core";

// src/utils.ts
import {
  APTOS_CHAINS,
  UserResponseStatus
} from "@aptos-labs/wallet-standard";
import { ethers } from "ethers";
var convertEip6963WalletToAptosWallet = (eip6963Wallet) => {
  const wallet = {
    accounts: [],
    chains: APTOS_CHAINS,
    features: {
      ...APTOS_REQUIRED_FEATURES(eip6963Wallet),
      ...EIP6963_ADDITIONAL_FEATURES(eip6963Wallet)
    },
    icon: eip6963Wallet.info.icon,
    name: eip6963Wallet.info.name,
    url: Eip6963WalletUrls[eip6963Wallet.info.name],
    version: "1.0.0"
  };
  return wallet;
};
var APTOS_REQUIRED_FEATURES = (eip6963Wallet) => {
  return {
    "aptos:account": {
      account: async () => {
        throw new Error("Not yet implemented");
      },
      version: "1.0.0"
    },
    "aptos:connect": {
      connect: async () => {
        throw new Error("Not yet implemented");
      },
      version: "1.0.0"
    },
    "aptos:disconnect": {
      disconnect: async () => {
        try {
          eip6963Wallet.provider.on("disconnect", (error) => {
            console.error("EIP-6963 wallet disconnected", error);
          });
        } catch (error) {
          throw new Error("Failed to disconnect").message;
        }
      },
      version: "1.0.0"
    },
    "aptos:network": {
      network: async () => {
        const chainId = await eip6963Wallet.provider.request({
          method: "eth_chainId"
        });
        return { name: parseInt(chainId, 16), chainId };
      },
      version: "1.0.0"
    },
    "aptos:signMessage": {
      signMessage: async (message) => {
        const accounts = await eip6963Wallet.provider.request({ method: "eth_requestAccounts" }).catch(console.error);
        const signature = await eip6963Wallet.provider.request({
          method: "personal_sign",
          params: [message.message, accounts[0]]
        });
        const response = {
          fullMessage: message.message,
          message: message.message,
          nonce: message.nonce,
          prefix: "APTOS",
          signature
        };
        return {
          status: UserResponseStatus.APPROVED,
          args: response
        };
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
        throw new Error("Not yet implemented");
      },
      version: "1.0.0"
    },
    "aptos:onNetworkChange": {
      onNetworkChange: async (callback) => {
        eip6963Wallet.provider.on("chainChanged", (chainId) => {
          console.log("chainId", chainId);
          callback({
            name: parseInt(chainId),
            chainId: parseInt(chainId)
          });
        });
      },
      version: "1.0.0"
    }
  };
};
var EIP6963_ADDITIONAL_FEATURES = (eip6963Wallet) => {
  const features = {
    "eip6963:account": {
      account: async () => {
        const accounts = await eip6963Wallet.provider.request({ method: "eth_requestAccounts" }).catch(console.error);
        return {
          address: accounts[0],
          publicKey: ethers.getBytes(accounts[0])
        };
      },
      version: "1.0.0"
    },
    "eip6963:connect": {
      connect: async () => {
        try {
          const accounts = await eip6963Wallet.provider.request({ method: "eth_requestAccounts" }).catch((error) => {
            throw new Error("Error connecting to wallet" + error).message;
          });
          return {
            args: {
              address: accounts[0],
              publicKey: ethers.getBytes(accounts[0])
            },
            status: UserResponseStatus.APPROVED
          };
        } catch (error) {
          if (error instanceof Error && error.message.includes("refused connection")) {
            return {
              status: UserResponseStatus.REJECTED
            };
          }
          throw error;
        }
      },
      version: "1.0.0"
    },
    "eip6963:sendTransaction": {
      sendTransaction: async (transaction, provider) => {
        try {
          const signer = await provider.getSigner();
          if (!signer) {
            throw new Error("No signer found");
          }
          const response = await signer.sendTransaction(transaction);
          const receipt = await response.wait();
          return {
            status: UserResponseStatus.APPROVED,
            args: (receipt == null ? void 0 : receipt.hash) || ""
          };
        } catch (error) {
          if (error instanceof Error && error.message.includes("rejected")) {
            return {
              status: UserResponseStatus.REJECTED
            };
          }
          throw new Error(error).message;
        }
      },
      version: "1.0.0"
    },
    "eip6963:onAccountChange": {
      onAccountChange: async (callback) => {
        eip6963Wallet.provider.on(
          "accountsChanged",
          (accounts) => {
            const accountInfo = {
              address: accounts[0],
              publicKey: ethers.getBytes(accounts[0])
            };
            callback(accountInfo);
          }
        );
      },
      version: "1.0.0"
    }
  };
  return features;
};

// src/index.ts
var Eip6963Wallets2 = /* @__PURE__ */ ((Eip6963Wallets3) => {
  Eip6963Wallets3["PhantomWallet"] = "Phantom";
  Eip6963Wallets3["MetaMaskWallet"] = "MetaMask";
  Eip6963Wallets3["BackpackWallet"] = "Backpack";
  Eip6963Wallets3["CoinbaseWallet"] = "Coinbase Wallet";
  Eip6963Wallets3["NightlyWallet"] = "Nightly";
  Eip6963Wallets3["RabbyWallet"] = "Rabby Wallet";
  return Eip6963Wallets3;
})(Eip6963Wallets2 || {});
var Eip6963WalletUrls = {
  ["Phantom" /* PhantomWallet */]: "https://phantom.app/",
  ["MetaMask" /* MetaMaskWallet */]: "https://metamask.io/",
  ["Backpack" /* BackpackWallet */]: "https://www.backpack.app/",
  ["Coinbase Wallet" /* CoinbaseWallet */]: "https://www.coinbase.com/wallet",
  ["Nightly" /* NightlyWallet */]: "https://nightly.app/",
  ["Rabby Wallet" /* RabbyWallet */]: "https://rabby.io/"
};
function fetchEthereumWallets() {
  const wallets = [];
  const convertedWallets = [];
  const handleWalletDiscovery = (event) => {
    const wallet = event.detail;
    if (!wallets.some((w) => w.info.uuid === wallet.info.uuid)) {
      wallets.push(wallet);
      convertedWallets.push(
        new Eip6963Wallet(convertEip6963WalletToAptosWallet(wallet), wallet)
      );
    }
  };
  window.addEventListener("eip6963:announceProvider", (event) => {
    handleWalletDiscovery(event);
  });
  window.dispatchEvent(new Event("eip6963:requestProvider"));
  return convertedWallets;
}
var Eip6963Wallet = class extends AdapterWallet {
  constructor(eip6963Wallet, eip6963WalletProvider) {
    super();
    this.version = "1.0.0";
    this.accounts = [];
    this.connected = false;
    this.eip6963Wallet = eip6963Wallet;
    this.eip6963WalletProvider = eip6963WalletProvider;
  }
  get icon() {
    return this.eip6963Wallet.icon;
  }
  get name() {
    return this.eip6963Wallet.name;
  }
  get url() {
    return Eip6963WalletUrls[this.eip6963Wallet.name];
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
    return await this.eip6963Wallet.features["eip6963:account"].account();
  }
  async getConnectedNetwork() {
    return await this.eip6963Wallet.features["aptos:network"].network();
  }
  async connect() {
    const result = await this.eip6963Wallet.features["eip6963:connect"].connect();
    if (result.status === UserResponseStatus2.REJECTED) {
      throw new Error("User rejected the request").message;
    }
    await this.onAccountChange();
    await this.onNetworkChange();
    this.provider = new ethers2.BrowserProvider(
      await this.eip6963WalletProvider.provider,
      "any"
    );
    this.connected = true;
    return result.args;
  }
  async disconnect() {
    try {
      if (!this.connected) {
        return;
      }
      await this.eip6963Wallet.features["aptos:disconnect"].disconnect();
      this.connected = false;
    } catch (error) {
      throw new Error(error).message;
    }
  }
  async signMessage(message) {
    const result = await this.eip6963Wallet.features["aptos:signMessage"].signMessage(
      message
    );
    if (result.status === UserResponseStatus2.REJECTED) {
      throw new Error("User rejected the request").message;
    }
    return result.args;
  }
  async signTransaction(transaction) {
    throw new Error("Not implemented");
  }
  async sendTransaction(transaction) {
    if (!this.provider) {
      throw new Error("Provider not connected");
    }
    const result = await this.eip6963Wallet.features["eip6963:sendTransaction"].sendTransaction(transaction, this.provider);
    if (result.status === UserResponseStatus2.REJECTED) {
      throw new Error("User rejected the request").message;
    }
    return result.args;
  }
  async onAccountChange() {
    await this.eip6963Wallet.features["eip6963:onAccountChange"].onAccountChange((account) => {
      this.emit("accountChange", account);
    });
  }
  async onNetworkChange() {
    await this.eip6963Wallet.features["aptos:onNetworkChange"].onNetworkChange(
      (newNetwork) => {
        this.emit("networkChange", newNetwork);
      }
    );
  }
};
export {
  Eip6963Wallet,
  Eip6963WalletUrls,
  Eip6963Wallets2 as Eip6963Wallets,
  fetchEthereumWallets
};
//# sourceMappingURL=index.mjs.map