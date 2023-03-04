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
  WalletError,
} from "@aptos-labs/wallet-adapter-core";
import { WalletCore } from "@aptos-labs/wallet-adapter-core";

import { Types } from "aptos";

export interface AptosWalletProviderProps {
  children: ReactNode;
  plugins: Wallet[];
  autoConnect?: boolean;
  onError?: (error: WalletError) => void;
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
  onError,
}: AptosWalletProviderProps) => {
  const [{ connected, account, network, wallet }, setState] =
    useState(initialState);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const walletCore = useMemo(() => new WalletCore(plugins), []);
  const [wallets, setWallets] = useState<Wallet[]>(walletCore.wallets);

  const connect = async (walletName: WalletName) => {
    try {
      setIsLoading(true);
      await walletCore.connect(walletName);
      await walletCore.setAnsName();
    } catch (error) {
      (onError || console.error)(error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      await walletCore.disconnect();
    } catch (error) {
      (onError || console.error)(error);
    }
  };

  const signAndSubmitTransaction = async (
    transaction: Types.TransactionPayload
  ) => {
    try {
      return await walletCore.signAndSubmitTransaction(transaction);
    } catch (error: any) {
      (onError || console.error)(error);
    }
  };

  const signTransaction = async (transaction: Types.TransactionPayload) => {
    try {
      return await walletCore.signTransaction(transaction);
    } catch (error: any) {
      (onError || console.error)(error);
    }
  };

  const signMessage = async (message: SignMessagePayload) => {
    try {
      return await walletCore.signMessage(message);
    } catch (error: any) {
      (onError || console.error)(error);
    }
  };

  const signMessageAndVerify = async (message: SignMessagePayload) => {
    try {
      return await walletCore.signMessageAndVerify(message);
    } catch (error: any) {
      (onError || console.error)(error);
    }
  };

  const fetchANSname = async () => {
    try {
      return await walletCore.setAnsName();
    } catch (error: any) {
      (onError || console.error)(error);
    }
  };

  useEffect(() => {
    const tryAutoConnect = async () => {
      await connect(localStorage.getItem("AptosWalletName") as WalletName);
    };

    if (autoConnect) {
      if (localStorage.getItem("AptosWalletName")) {
        tryAutoConnect();
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
        signMessageAndVerify,
        isLoading,
        fetchANSname,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
