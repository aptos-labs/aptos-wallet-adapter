// src/useWallet.tsx
import { createContext, useContext } from "react";
var DEFAULT_COUNTEXT = {
  connected: false
};
var WalletContext = createContext(
  DEFAULT_COUNTEXT
);
function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletContextState");
  }
  return context;
}

// src/WalletProvider.tsx
import { useCallback, useEffect, useState } from "react";
import { WalletCore } from "@aptos/wallet-adapter-core";
import { Fragment, jsx } from "react/jsx-runtime";
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
  const [walletCore, _] = useState(new WalletCore(plugins));
  const [{ connected, account, network }, setState] = useState(initialState);
  const [isDone, setIsDone] = useState(false);
  useEffect(() => {
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
  useEffect(() => {
    if (autoConnect) {
      if (localStorage.getItem("AptosWalletName")) {
        connect(localStorage.getItem("AptosWalletName"));
      }
    }
  }, []);
  useEffect(() => {
    if (connected) {
      walletCore.onAccountChange();
      walletCore.onNetworkChange();
    }
  }, [walletCore, connected]);
  const handleConnect = useCallback(() => {
    setState((state) => {
      return {
        ...state,
        connected: true,
        account: walletCore.account,
        network: walletCore.network
      };
    });
  }, [connected]);
  const handleDisconnect = useCallback(() => {
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
  const handleAccountChange = useCallback(() => {
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
  const handleNetworkChange = useCallback(() => {
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
  useEffect(() => {
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
    return /* @__PURE__ */ jsx(Fragment, {});
  }
  return /* @__PURE__ */ jsx(WalletContext.Provider, {
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
export {
  AptosWalletAdapterProvider,
  useWallet
};
