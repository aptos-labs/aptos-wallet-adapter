// src/index.ts
import {
  AdapterWallet,
  WalletReadyState
} from "@aptos-labs/wallet-adapter-aggregator-core";
import {
  WalletCore
} from "@aptos-labs/wallet-adapter-core";
import {
  APTOS_CHAINS
} from "@aptos-labs/wallet-standard";
var getAptosWallets = () => {
  const walletCore = new WalletCore();
  const wallets = walletCore.wallets.map(
    (wallet) => new AptosWallet(wallet, walletCore)
  );
  return wallets;
};
var AptosWallet = class extends AdapterWallet {
  constructor(aptosWallet, walletCore) {
    super();
    this.version = "1.0.0";
    this.accounts = [];
    this.connected = false;
    this.aptosWallet = aptosWallet;
    this.walletCore = walletCore;
  }
  get icon() {
    return this.aptosWallet.icon;
  }
  get name() {
    return this.aptosWallet.name;
  }
  get url() {
    return this.aptosWallet.url;
  }
  get readyState() {
    return WalletReadyState.Installed;
  }
  get chains() {
    return APTOS_CHAINS;
  }
  get isConnected() {
    return this.connected;
  }
  async getAccount() {
    const account = await this.walletCore.account;
    if (!account) {
      throw new Error("Account not found");
    }
    return account;
  }
  async getConnectedNetwork() {
    const network = await this.walletCore.network;
    if (!network) {
      throw new Error("Network not found");
    }
    return network;
  }
  async connect() {
    await this.walletCore.connect(this.name);
    this.onAccountChange();
    this.connected = true;
    return this.walletCore.account;
  }
  async disconnect() {
    if (!this.connected) {
      return;
    }
    this.walletCore.off("accountChange");
    await this.walletCore.disconnect();
    this.connected = false;
  }
  async signMessage(message) {
    const result = await this.walletCore.signMessage(message);
    return result;
  }
  async signTransaction(args) {
    const result = await this.walletCore.signTransaction(args);
    return result;
  }
  onAccountChange() {
    this.walletCore.onAccountChange();
    this.walletCore.on(
      "accountChange",
      async (accountInfo) => {
        this.emit("accountChange", accountInfo);
      }
    );
  }
  async onNetworkChange(callback) {
    await this.walletCore.onNetworkChange();
  }
};
export {
  AptosWallet,
  getAptosWallets
};
//# sourceMappingURL=index.mjs.map