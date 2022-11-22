// src/index.ts
import { EventEmitter } from "eventemitter3";

// src/error/index.ts
var WalletError = class extends Error {
  constructor(message, error) {
    super(message);
    this.error = error;
  }
};
var WalletNotSelectedError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletNotSelectedError";
  }
};
var WalletNotReadyError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletNotReadyError";
  }
};
var WalletConnectionError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletConnectionError";
  }
};
var WalletDisconnectionError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletDisconnectionError";
  }
};
var WalletAccountError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletAccountError";
  }
};
var WalletGetNetworkError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletGetNetworkError";
  }
};
var WalletAccountChangeError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletAccountChangeError";
  }
};
var WalletNetworkChangeError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletNetworkChangeError";
  }
};
var WalletNotConnectedError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletNotConnectedError";
  }
};
var WalletSignMessageError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletSignMessageError";
  }
};
var WalletSignAndSubmitMessageError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletSignAndSubmitMessageError";
  }
};
var WalletSignTransactionError = class extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletSignTransactionError";
  }
};

// src/utils/scopePollingDetectionStrategy.ts
function scopePollingDetectionStrategy(detect) {
  if (typeof window === "undefined" || typeof document === "undefined")
    return;
  const disposers = [];
  function detectAndDispose() {
    const detected = detect();
    if (detected) {
      for (const dispose of disposers) {
        dispose();
      }
    }
  }
  const interval = setInterval(detectAndDispose, 1e3);
  disposers.push(() => clearInterval(interval));
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", detectAndDispose, {
      once: true
    });
    disposers.push(
      () => document.removeEventListener("DOMContentLoaded", detectAndDispose)
    );
  }
  if (document.readyState !== "complete") {
    window.addEventListener("load", detectAndDispose, { once: true });
    disposers.push(() => window.removeEventListener("load", detectAndDispose));
  }
  detectAndDispose();
}

// src/utils/localStorage.ts
var LOCAL_STORAGE_ITEM_KEY = "AptosWalletName";
function setLocalStorage(walletName) {
  localStorage.setItem(LOCAL_STORAGE_ITEM_KEY, walletName);
}
function removeLocalStorage() {
  localStorage.removeItem(LOCAL_STORAGE_ITEM_KEY);
}

// src/index.ts
var WalletCore = class extends EventEmitter {
  constructor(plugins) {
    super();
    this._wallets = null;
    this._wallet = null;
    this._account = null;
    this._network = null;
    this._connecting = false;
    this._connected = false;
    this._wallets = plugins;
    this._wallets.forEach((wallet) => {
      wallet.readyState = typeof window === "undefined" || typeof document === "undefined" ? "Unsupported" /* Unsupported */ : "NotDetected" /* NotDetected */;
      if (typeof window !== "undefined" && wallet.readyState !== "Unsupported" /* Unsupported */) {
        scopePollingDetectionStrategy(() => {
          if ("provider" in wallet && wallet.provider) {
            wallet.readyState = "Installed" /* Installed */;
            return true;
          }
          return false;
        });
      }
    });
  }
  isWalletExists() {
    if (!this._connected || this._connecting || !this._wallet)
      throw new WalletNotConnectedError().name;
    if (!(this._wallet.readyState === "Loadable" /* Loadable */ || this._wallet.readyState === "Installed" /* Installed */))
      throw new WalletNotReadyError().name;
    return true;
  }
  clearData() {
    this.setWallet(null);
    this.setAccount(null);
    this.setNetwork(null);
    removeLocalStorage();
  }
  setWallet(wallet) {
    this._wallet = wallet;
  }
  setAccount(account) {
    this._account = account;
  }
  setNetwork(network) {
    this._network = network;
  }
  isConnected() {
    return this._connected;
  }
  get wallet() {
    try {
      if (!this._wallet)
        return null;
      return {
        name: this._wallet.name,
        icon: this._wallet.icon,
        url: this._wallet.url
      };
    } catch (error) {
      throw new WalletNotSelectedError(error).message;
    }
  }
  get account() {
    try {
      return this._account;
    } catch (error) {
      throw new WalletAccountError(error).message;
    }
  }
  get network() {
    try {
      return this._network;
    } catch (error) {
      throw new WalletGetNetworkError(error).message;
    }
  }
  async connect(walletName) {
    var _a;
    try {
      this._connecting = true;
      const selectedWallet = (_a = this._wallets) == null ? void 0 : _a.find(
        (wallet) => wallet.name === walletName
      );
      if (!selectedWallet)
        return;
      this.setWallet(selectedWallet);
      const account = await selectedWallet.connect();
      this.setAccount({ ...account });
      const network = await selectedWallet.network();
      this.setNetwork({ ...network });
      setLocalStorage(selectedWallet.name);
      this._connected = true;
      this.emit("connect", account);
    } catch (error) {
      this.clearData();
      throw new WalletConnectionError(error).message;
    } finally {
      this._connecting = false;
    }
  }
  async disconnect() {
    var _a;
    try {
      await ((_a = this._wallet) == null ? void 0 : _a.disconnect());
      this._connected = false;
      this.clearData();
      this.emit("disconnect");
    } catch (error) {
      throw new WalletDisconnectionError(error).message;
    }
  }
  async signAndSubmitTransaction(transaction) {
    var _a;
    try {
      this.isWalletExists();
      const response = await ((_a = this._wallet) == null ? void 0 : _a.signAndSubmitTransaction(
        transaction
      ));
      return response;
    } catch (error) {
      const errMsg = typeof error == "object" && "message" in error ? error.message : error;
      throw new WalletSignAndSubmitMessageError(errMsg).message;
    }
  }
  async signTransaction(transaction) {
    try {
      if (this._wallet && !("signTransaction" in this._wallet))
        return null;
      this.isWalletExists();
      const response = await this._wallet.signTransaction(transaction);
      return response;
    } catch (error) {
      const errMsg = typeof error == "object" && "message" in error ? error.message : error;
      throw new WalletSignTransactionError(errMsg).message;
    }
  }
  async signMessage(message) {
    var _a;
    try {
      this.isWalletExists();
      if (!this._wallet)
        return null;
      const response = await ((_a = this._wallet) == null ? void 0 : _a.signMessage(message));
      return response;
    } catch (error) {
      const errMsg = typeof error == "object" && "message" in error ? error.message : error;
      throw new WalletSignMessageError(errMsg).message;
    }
  }
  async onAccountChange() {
    var _a;
    try {
      this.isWalletExists();
      await ((_a = this._wallet) == null ? void 0 : _a.onAccountChange((data) => {
        this.setAccount({ ...data });
        this.emit("accountChange", this._account);
      }));
    } catch (error) {
      const errMsg = typeof error == "object" && "message" in error ? error.message : error;
      throw new WalletAccountChangeError(errMsg).message;
    }
  }
  async onNetworkChange() {
    var _a;
    try {
      this.isWalletExists();
      await ((_a = this._wallet) == null ? void 0 : _a.onNetworkChange((data) => {
        this.setNetwork({ ...data });
        this.emit("networkChange", this._network);
      }));
    } catch (error) {
      const errMsg = typeof error == "object" && "message" in error ? error.message : error;
      throw new WalletNetworkChangeError(errMsg).message;
    }
  }
};
export {
  WalletCore
};
