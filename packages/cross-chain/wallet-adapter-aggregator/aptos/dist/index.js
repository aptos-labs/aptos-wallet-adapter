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
  AptosWallet: () => AptosWallet,
  getAptosWallets: () => getAptosWallets
});
module.exports = __toCommonJS(src_exports);
var import_wallet_adapter_aggregator_core = require("@aptos-labs/wallet-adapter-aggregator-core");
var import_wallet_adapter_core = require("@aptos-labs/wallet-adapter-core");
var import_wallet_standard = require("@aptos-labs/wallet-standard");
var getAptosWallets = () => {
  const walletCore = new import_wallet_adapter_core.WalletCore();
  const wallets = walletCore.wallets.map(
    (wallet) => new AptosWallet(wallet, walletCore)
  );
  return wallets;
};
var AptosWallet = class extends import_wallet_adapter_aggregator_core.AdapterWallet {
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
    return import_wallet_adapter_aggregator_core.WalletReadyState.Installed;
  }
  get chains() {
    return import_wallet_standard.APTOS_CHAINS;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AptosWallet,
  getAptosWallets
});
//# sourceMappingURL=index.js.map