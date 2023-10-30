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
  TransactionOptions,
  TxnBuilderTypes,
  Types,
  InputGenerateTransactionData,
} from "@aptos-labs/wallet-adapter-core";
import { WalletCore } from "@aptos-labs/wallet-adapter-core";

export interface AptosWalletProviderProps {
  children: ReactNode;
  plugins: ReadonlyArray<Wallet>;
  autoConnect?: boolean;
  onError?: (error: any) => void;
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

  // a local state to track whether wallet connect request is loading
  // https://github.com/aptos-labs/aptos-wallet-adapter/issues/94
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const walletCore = useMemo(() => new WalletCore(plugins), []);
  const [wallets, setWallets] = useState<ReadonlyArray<Wallet>>(
    walletCore.wallets
  );

  const connect = async (walletName: WalletName) => {
    try {
      setIsLoading(true);
      await walletCore.connect(walletName);
    } catch (error: any) {
      console.log("connect error", error);
      if (onError) onError(error);
      else throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      await walletCore.disconnect();
    } catch (e) {
      console.log("disconnect error", e);
      if (onError) onError(e);
    }
  };

  const signAndSubmitTransaction = async (
    transaction: Types.TransactionPayload,
    options?: TransactionOptions
  ) => {
    try {
      return await walletCore.signAndSubmitTransaction(transaction, options);
    } catch (error: any) {
      if (onError) onError(error);
      else throw error;
    }
  };

  const signAndSubmitBCSTransaction = async (
    transaction: TxnBuilderTypes.TransactionPayload,
    options?: TransactionOptions
  ) => {
    try {
      return await walletCore.signAndSubmitBCSTransaction(transaction, options);
    } catch (error: any) {
      throw error;
    }
  };

  const signTransaction = async (
    transaction: Types.TransactionPayload,
    options?: TransactionOptions
  ) => {
    try {
      return await walletCore.signTransaction(transaction, options);
    } catch (error: any) {
      if (onError) onError(error);
      else throw error;
    }
  };

  const signMessage = async (message: SignMessagePayload) => {
    try {
      return await walletCore.signMessage(message);
    } catch (error: any) {
      if (onError) onError(error);
      else throw error;
      return null;
    }
  };

  const signMessageAndVerify = async (message: SignMessagePayload) => {
    try {
      return await walletCore.signMessageAndVerify(message);
    } catch (error: any) {
      if (onError) onError(error);
      else throw error;
      return false;
    }
  };

  const signMultiAgentTransaction = async (
      transaction: TxnBuilderTypes.MultiAgentRawTransaction | TxnBuilderTypes.FeePayerRawTransaction,
  ) => {
    try {
      return await walletCore.signMultiAgentTransaction(transaction);
    } catch (error: any) {
      if (onError) onError(error);
      else throw error;
      return false;
    }
  }

  const submitTransaction = async (
      transaction: InputGenerateTransactionData,
  ) => {
    try {
      return await walletCore.submitTransaction(transaction);
    } catch (error: any) {
      if (onError) onError(error);
      else throw error;
      return false;
    }
  }

  useEffect(() => {
    if (autoConnect) {
      if (localStorage.getItem("AptosWalletName")) {
        connect(localStorage.getItem("AptosWalletName") as WalletName);
      } else {
        // if we dont use autoconnect set the connect is loading to false
        setIsLoading(false);
      }
    }
  }, wallets);

  useEffect(() => {
    if (connected) {
      walletCore.onAccountChange();
      walletCore.onNetworkChange();
    }
  }, [...wallets, connected]);

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

  // Whenever the readyState of any supported wallet changes we produce a new wallets state array
  // which in turn causes consumers of the `useWallet` hook to re-render.
  // See https://github.com/aptos-labs/aptos-wallet-adapter/pull/129#issuecomment-1519026572 for reasoning.
  const handleReadyStateChange = (wallet: Wallet) => {
    setWallets((wallets) => [...wallets]);
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
  }, [...wallets, connected]);

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
        signAndSubmitBCSTransaction,
        signTransaction,
        signMessage,
        signMessageAndVerify,
        signMultiAgentTransaction,
        submitTransaction,
        isLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
