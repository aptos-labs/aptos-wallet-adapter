// src/index.ts
import EventEmitter from "eventemitter3";
var WalletReadyState = /* @__PURE__ */ ((WalletReadyState2) => {
  WalletReadyState2["Installed"] = "Installed";
  WalletReadyState2["NotDetected"] = "NotDetected";
  return WalletReadyState2;
})(WalletReadyState || {});
var AdapterWallet = class extends EventEmitter {
  sendTransaction(transaction) {
    throw new Error("Not implemented");
  }
  getAccountUsdcBalance() {
    throw new Error("Not implemented");
  }
};
export {
  AdapterWallet,
  WalletReadyState
};
//# sourceMappingURL=index.mjs.map