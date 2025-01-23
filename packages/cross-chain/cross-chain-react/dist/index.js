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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  AptosCrossChainWalletProvider: () => AptosCrossChainWalletProvider,
  WalletContext: () => WalletContext,
  useCrossChainWallet: () => useCrossChainWallet
});
module.exports = __toCommonJS(src_exports);
__reExport(src_exports, require("@aptos-labs/cross-chain-core"), module.exports);

// src/WalletProvider.tsx
var import_react2 = require("react");

// src/useWallet.tsx
var import_react = require("react");
var DEFAULT_CONTEXT = {
  connected: false
};
var WalletContext = (0, import_react.createContext)(
  DEFAULT_CONTEXT
);
function useCrossChainWallet() {
  const context = (0, import_react.useContext)(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletContextState");
  }
  return context;
}

// src/WalletProvider.tsx
var import_cross_chain_core = require("@aptos-labs/cross-chain-core");
var import_wallet_adapter_aggregator_solana = require("@aptos-labs/wallet-adapter-aggregator-solana");
var import_wallet_adapter_aggregator_eip6963 = require("@aptos-labs/wallet-adapter-aggregator-eip6963");
var import_wallet_adapter_aggregator_aptos = require("@aptos-labs/wallet-adapter-aggregator-aptos");
var import_jsx_runtime = require("react/jsx-runtime");
var initialState = {
  connected: false,
  account: null,
  wallet: null,
  sourceChain: null,
  setSourceChain: () => {
  }
};
var AptosCrossChainWalletProvider = ({ children, dappConfig, disableTelemetry, onError }) => {
  const [{ connected, wallet, account, sourceChain }, setState] = (0, import_react2.useState)(initialState);
  const [provider, setProvider] = (0, import_react2.useState)();
  const setSourceChain = (chain) => {
    setState((prev) => ({ ...prev, sourceChain: chain }));
  };
  const [crossChainCore, setCrossChainCore] = (0, import_react2.useState)();
  (0, import_react2.useEffect)(() => {
    const crossChainCore2 = new import_cross_chain_core.CrossChainCore({ dappConfig });
    setCrossChainCore(crossChainCore2);
  }, []);
  const getSolanaWallets = () => {
    return (0, import_wallet_adapter_aggregator_solana.getSolanaStandardWallets)();
  };
  const getEthereumWallets = () => {
    return (0, import_wallet_adapter_aggregator_eip6963.fetchEthereumWallets)();
  };
  const getAptosWallets = () => {
    return (0, import_wallet_adapter_aggregator_aptos.getAptosWallets)();
  };
  (0, import_react2.useEffect)(() => {
    if (!wallet)
      return;
    const handleAccountChange = (newAccount) => {
      setState((prev) => ({ ...prev, account: newAccount }));
    };
    const handleNetworkChange = (newNetwork) => {
      console.log("handleNetworkChange not implemented");
    };
    wallet.on("accountChange", handleAccountChange);
    wallet.on("networkChange", handleNetworkChange);
    return () => {
      wallet.off("accountChange", handleAccountChange);
      wallet.off("networkChange", handleNetworkChange);
    };
  }, [wallet]);
  const getQuote = async (amount, sourceChain2) => {
    try {
      const provider2 = crossChainCore == null ? void 0 : crossChainCore.getProvider("Wormhole");
      if (!provider2) {
        throw new Error("Provider not found");
      }
      setProvider(provider2);
      const quote = await (provider2 == null ? void 0 : provider2.getQuote({
        amount,
        sourceChain: sourceChain2
      }));
      return quote;
    } catch (error) {
      if (onError)
        onError(error);
      return Promise.reject(error);
    }
  };
  const initiateTransfer = async (sourceChain2, mainSigner, sponsorAccount) => {
    try {
      if (!provider) {
        throw new Error("Provider is not set");
      }
      const { originChainTxnId, destinationChainTxnId } = await provider.initiateCCTPTransfer({
        sourceChain: sourceChain2,
        wallet,
        destinationAddress: "0x38383091fdd9325e0b8ada990c474da8c7f5aa51580b65eb477885b6ce0a36b7",
        mainSigner,
        sponsorAccount
      });
      return { originChainTxnId, destinationChainTxnId };
    } catch (error) {
      if (onError)
        onError(error);
      return Promise.reject(error);
    }
  };
  const connect = async (wallet2) => {
    try {
      const response = await wallet2.connect();
      console.log("WalletProvider connect response", response);
      setState((state) => ({
        ...state,
        connected: true,
        wallet: wallet2,
        account: response
      }));
    } catch (error) {
      if (onError)
        onError(error);
      return Promise.reject(error);
    }
  };
  const disconnect = async () => {
    try {
      await (wallet == null ? void 0 : wallet.disconnect());
      setState((state) => ({
        ...state,
        connected: false,
        wallet: null
      }));
    } catch (error) {
      if (onError)
        onError(error);
      return Promise.reject(error);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletContext.Provider, {
    value: {
      connected,
      account,
      isLoading: false,
      getSolanaWallets,
      getEthereumWallets,
      getAptosWallets,
      connect,
      disconnect,
      wallet,
      getQuote,
      initiateTransfer,
      sourceChain,
      setSourceChain
    },
    children
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AptosCrossChainWalletProvider,
  WalletContext,
  useCrossChainWallet
});
//# sourceMappingURL=index.js.map