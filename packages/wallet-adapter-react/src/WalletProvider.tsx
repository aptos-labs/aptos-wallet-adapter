import * as React from "react";
import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { WalletContext } from "./useWallet";
import { WalletCore } from "@aptos/wallet-adapter-core";
import {
  AccountInfo,
  NetworkInfo,
  WalletName,
  Wallet,
  WalletInfo,
  SignMessagePayload,
} from "@aptos/wallet-adapter-core/src/types";
import { Types } from "aptos";

export type { Wallet, WalletName } from "@aptos/wallet-adapter-core/src/types";

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
  const [walletCore, _] = useState(new WalletCore(plugins));
  const [{ connected, account, network, wallet }, setState] =
    useState(initialState);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    console.log("walletCore.wallets", walletCore.wallets);
    setWallets([...walletCore.wallets]);
  }, []);
  console.log("AptosWalletAdapterProvider", wallets);

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
  }, []);

  useEffect(() => {
    if (connected) {
      walletCore.onAccountChange();
      walletCore.onNetworkChange();
    }
  }, [walletCore, connected]);

  // Handle the adapter's connect event
  const handleConnect = useCallback(() => {
    setState((state) => {
      return {
        ...state,
        connected: true,
        account: walletCore.account,
        network: walletCore.network,
        wallet: walletCore.wallet,
      };
    });
  }, [connected]);

  // Handle the adapter's disconnect event
  const handleDisconnect = useCallback(() => {
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
  }, [connected]);

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

  useEffect(() => {
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
  }, [connected]);

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
