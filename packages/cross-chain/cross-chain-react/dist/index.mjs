// src/index.tsx
export * from "@aptos-labs/cross-chain-core";

// src/WalletProvider.tsx
import { useEffect, useState } from "react";

// src/useWallet.tsx
import { createContext, useContext } from "react";
var DEFAULT_CONTEXT = {
  connected: false
};
var WalletContext = createContext(
  DEFAULT_CONTEXT
);
function useCrossChainWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletContextState");
  }
  return context;
}

// src/WalletProvider.tsx
import {
  CrossChainCore
} from "@aptos-labs/cross-chain-core";
import { getSolanaStandardWallets } from "@aptos-labs/wallet-adapter-aggregator-solana";
import { fetchEthereumWallets as fetchEthereumWalletsAggregator } from "@aptos-labs/wallet-adapter-aggregator-eip6963";
import { getAptosWallets as getAptosStandardWallets } from "@aptos-labs/wallet-adapter-aggregator-aptos";
import { jsx } from "react/jsx-runtime";
var initialState = {
  connected: false,
  account: null,
  wallet: null,
  sourceChain: null,
  setSourceChain: () => {
  }
};
var AptosCrossChainWalletProvider = ({ children, dappConfig, disableTelemetry, onError }) => {
  const [{ connected, wallet, account, sourceChain }, setState] = useState(initialState);
  const [provider, setProvider] = useState();
  const setSourceChain = (chain) => {
    setState((prev) => ({ ...prev, sourceChain: chain }));
  };
  const [crossChainCore, setCrossChainCore] = useState();
  useEffect(() => {
    const crossChainCore2 = new CrossChainCore({ dappConfig });
    setCrossChainCore(crossChainCore2);
  }, []);
  const getSolanaWallets = () => {
    return getSolanaStandardWallets();
  };
  const getEthereumWallets = () => {
    return fetchEthereumWalletsAggregator();
  };
  const getAptosWallets = () => {
    return getAptosStandardWallets();
  };
  useEffect(() => {
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
  return /* @__PURE__ */ jsx(WalletContext.Provider, {
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
export {
  AptosCrossChainWalletProvider,
  WalletContext,
  useCrossChainWallet
};
//# sourceMappingURL=index.mjs.map