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

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  AptosWalletAdapterProvider: () => AptosWalletAdapterProvider,
  useWallet: () => useWallet
});
module.exports = __toCommonJS(src_exports);

// src/useWallet.tsx
var import_react = require("react");
var DEFAULT_COUNTEXT = {
  connected: false
};
var WalletContext = (0, import_react.createContext)(
  DEFAULT_COUNTEXT
);
function useWallet() {
  const context = (0, import_react.useContext)(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletContextState");
  }
  return context;
}

// src/WalletProvider.tsx
var import_react2 = require("react");
var import_wallet_adapter_core = require("@aptos/wallet-adapter-core");
var import_jsx_runtime = require("react/jsx-runtime");
var initialState = {
  connected: false,
  account: null,
  network: null
};
var AptosWalletAdapterProvider = ({
  children,
  plugins,
  autoConnect = false
}) => {
  const [walletCore, _] = (0, import_react2.useState)(new import_wallet_adapter_core.WalletCore(plugins));
  const [{ connected, account, network }, setState] = (0, import_react2.useState)(initialState);
  const [isDone, setIsDone] = (0, import_react2.useState)(false);
  (0, import_react2.useEffect)(() => {
    setIsDone(true);
  }, []);
  const connect = (walletName) => {
    try {
      walletCore.connect(walletName);
    } catch (e) {
      console.log("connect error", e);
    }
  };
  const disconnect = () => {
    try {
      walletCore.disconnect();
    } catch (e) {
      console.log("disconnect error", e);
    }
  };
  const getWallet = () => {
    return walletCore.wallet;
  };
  const signAndSubmitTransaction = async (transaction) => {
    try {
      return await walletCore.signAndSubmitTransaction(transaction);
    } catch (error) {
      throw error;
    }
  };
  const signTransaction = async (transaction) => {
    try {
      return await walletCore.signTransaction(transaction);
    } catch (error) {
      throw error;
    }
  };
  const signMessage = async (message) => {
    try {
      return await walletCore.signMessage(message);
    } catch (error) {
      throw error;
    }
  };
  (0, import_react2.useEffect)(() => {
    if (autoConnect) {
      if (localStorage.getItem("AptosWalletName")) {
        connect(localStorage.getItem("AptosWalletName"));
      }
    }
  }, []);
  (0, import_react2.useEffect)(() => {
    if (connected) {
      walletCore.onAccountChange();
      walletCore.onNetworkChange();
    }
  }, [walletCore, connected]);
  const handleConnect = (0, import_react2.useCallback)(() => {
    setState((state) => {
      return {
        ...state,
        connected: true,
        account: walletCore.account,
        network: walletCore.network
      };
    });
  }, [connected]);
  const handleDisconnect = (0, import_react2.useCallback)(() => {
    if (!connected)
      return;
    setState((state) => {
      return {
        ...state,
        connected: false,
        account: walletCore.account,
        network: walletCore.network
      };
    });
  }, [connected]);
  const handleAccountChange = (0, import_react2.useCallback)(() => {
    if (!connected)
      return;
    if (!walletCore.wallet)
      return;
    setState((state) => {
      return {
        ...state,
        account: walletCore.account
      };
    });
  }, [connected]);
  const handleNetworkChange = (0, import_react2.useCallback)(() => {
    if (!connected)
      return;
    if (!walletCore.wallet)
      return;
    setState((state) => {
      return {
        ...state,
        network: walletCore.network
      };
    });
  }, [connected]);
  (0, import_react2.useEffect)(() => {
    if (walletCore) {
      walletCore.on("connect", handleConnect);
      walletCore.on("disconnect", handleDisconnect);
      walletCore.on("accountChange", handleAccountChange);
      walletCore.on("networkChange", handleNetworkChange);
      return () => {
        walletCore.off("connect", handleConnect);
        walletCore.off("disconnect", handleDisconnect);
        walletCore.off("accountChange", handleAccountChange);
        walletCore.off("networkChange", handleNetworkChange);
      };
    }
  }, [walletCore, connected]);
  if (!isDone) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, {});
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletContext.Provider, {
    value: {
      connect,
      account,
      network,
      connected,
      disconnect,
      getWallet,
      signAndSubmitTransaction,
      signTransaction,
      signMessage
    },
    children
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AptosWalletAdapterProvider,
  useWallet
});
