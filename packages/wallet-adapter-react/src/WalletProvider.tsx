import * as React from "react";
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { WalletContext } from "./useWallet";
import type {
  AccountInfo,
  NetworkInfo,
  SignMessagePayload,
  Wallet,
  WalletInfo,
  WalletName,
} from "@aptos-labs/wallet-adapter-core";
import { WalletCore } from "@aptos-labs/wallet-adapter-core";

import { Types } from "aptos";

export interface AptosWalletProviderProps {
  children: ReactNode;
  plugins: Wallet[];
  autoConnect?: boolean;
}

const initialState: {
  account: AccountInfo | null;
  network: NetworkInfo | null;
  connected: boolean;
  wallet: WalletInfo | null;
} = {
  connected: false,
  account: null,
  network: null,
  wallet: null,
};

export const AptosWalletAdapterProvider: FC<AptosWalletProviderProps> = ({
  children,
  plugins,
  autoConnect = false,
}: AptosWalletProviderProps) => {
  const [{ connected, account, network, wallet }, setState] =
    useState(initialState);

  const walletCore = useMemo(() => new WalletCore(plugins), []);
  const [wallets, setWallets] = useState<Wallet[]>(walletCore.wallets);

  const connect = (walletName: WalletName) => {
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

  const signAndSubmitTransaction = async (
    transaction: Types.TransactionPayload
  ) => {
    try {
      return await walletCore.signAndSubmitTransaction(transaction);
    } catch (error: any) {
      throw error;
    }
  };

  const signTransaction = async (transaction: Types.TransactionPayload) => {
    try {
      return await walletCore.signTransaction(transaction);
    } catch (error: any) {
      throw error;
    }
  };

  const signMessage = async (message: SignMessagePayload) => {
    try {
      return await walletCore.signMessage(message);
    } catch (error: any) {
      throw error;
    }
  };

  useEffect(() => {
    if (autoConnect) {
      if (localStorage.getItem("AptosWalletName")) {
        connect(localStorage.getItem("AptosWalletName") as WalletName);
      }
    }
  }, [wallets]);

  useEffect(() => {
    if (connected) {
      walletCore.onAccountChange();
      walletCore.onNetworkChange();
    }
  }, [wallets, connected]);

  // Handle the adapter's connect event
  const handleConnect = () => {
    setState((state) => {
      return {
        ...state,
        connected: true,
        account: walletCore.account,
        network: walletCore.network,
        wallet: walletCore.wallet,
      };
    });
  };

  // Handle the adapter's disconnect event
  const handleDisconnect = () => {
    if (!connected) return;
    setState((state) => {
      return {
        ...state,
        connected: false,
        account: walletCore.account,
        network: walletCore.network,
        wallet: null,
      };
    });
  };

  // Handle the adapter's account change event
  const handleAccountChange = useCallback(() => {
    if (!connected) return;
    if (!walletCore.wallet) return;
    setState((state) => {
      return {
        ...state,
        account: walletCore.account,
      };
    });
  }, [connected]);

  // Handle the adapter's network event
  const handleNetworkChange = useCallback(() => {
    if (!connected) return;
    if (!walletCore.wallet) return;
    setState((state) => {
      return {
        ...state,
        network: walletCore.network,
      };
    });
  }, [connected]);

  // Handle the adapter's ready state change event
  const handleReadyStateChange = (wallet: Wallet) => {
    setWallets((prevWallets) => {
      const index = prevWallets.findIndex(
        (currWallet) => currWallet === wallet
      );
      if (index === -1) return prevWallets;

      return [
        ...prevWallets.slice(0, index),
        wallet,
        ...prevWallets.slice(index + 1),
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

  return (
    <WalletContext.Provider
      value={{
        connect,
        account,
        network,
        connected,
        disconnect,
        wallet,
        wallets,
        signAndSubmitTransaction,
        signTransaction,
        signMessage,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
