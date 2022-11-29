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
import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { WalletCore } from "@aptos/wallet-adapter-core";
import { jsx } from "react/jsx-runtime";
var initialState = {
  connected: false,
  account: null,
  network: null,
  wallet: null
};
var AptosWalletAdapterProvider = ({
  children,
  plugins,
  autoConnect = false
}) => {
  const [{ connected, account, network, wallet }, setState] = useState(initialState);
  const walletCore = useMemo(() => new WalletCore(plugins), []);
  const [wallets, setWallets] = useState(walletCore.wallets);
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
  }, [wallets]);
  useEffect(() => {
    if (connected) {
      walletCore.onAccountChange();
      walletCore.onNetworkChange();
    }
  }, [wallets, connected]);
  const handleConnect = () => {
    setState((state) => {
      return {
        ...state,
        connected: true,
        account: walletCore.account,
        network: walletCore.network,
        wallet: walletCore.wallet
      };
    });
  };
  const handleDisconnect = () => {
    if (!connected)
      return;
    setState((state) => {
      return {
        ...state,
        connected: false,
        account: walletCore.account,
        network: walletCore.network,
        wallet: null
      };
    });
  };
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
  const handleReadyStateChange = (wallet2) => {
    setWallets((prevWallets) => {
      const index = prevWallets.findIndex(
        (currWallet) => currWallet === wallet2
      );
      if (index === -1)
        return prevWallets;
      return [
        ...prevWallets.slice(0, index),
        wallet2,
        ...prevWallets.slice(index + 1)
      ];
    });
  };
  useEffect(() => {
    walletCore.on("connect", handleConnect);
    walletCore.on("disconnect", handleDisconnect);
    walletCore.on("accountChange", handleAccountChange);
    walletCore.on("networkChange", handleNetworkChange);
    walletCore.on("readyStateChange", handleReadyStateChange);
    return () => {
      walletCore.off("connect", handleConnect);
      walletCore.off("disconnect", handleDisconnect);
      walletCore.off("accountChange", handleAccountChange);
      walletCore.off("networkChange", handleNetworkChange);
      walletCore.off("readyStateChange", handleReadyStateChange);
    };
  }, [wallets, connected]);
  return /* @__PURE__ */ jsx(WalletContext.Provider, {
    value: {
      connect,
      account,
      network,
      connected,
      disconnect,
      wallet,
      wallets,
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
