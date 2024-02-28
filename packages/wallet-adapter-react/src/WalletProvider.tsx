import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { WalletContext } from "./useWallet";
import {
  type AnyRawTransaction,
  type InputSubmitTransactionData,
  type AccountAuthenticator,
  type PendingTransactionResponse,
  type InputTransactionData,
  type AptosSignMessageInput,
  type AptosSignMessageOutput,
  type AccountInfo,
  type NetworkInfo,
  type IAptosWallet,
  WalletCore,
  AptosWalletError,
} from "@aptos-labs/wallet-adapter-core";

export interface AptosWalletProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
  onError?: (error: any) => void;
}

const initialState: {
  account: AccountInfo | undefined;
  network: NetworkInfo | undefined;
  connected: boolean;
  wallet: IAptosWallet | undefined;
} = {
  connected: false,
  account: undefined,
  network: undefined,
  wallet: undefined,
};

export const AptosWalletAdapterProvider: FC<AptosWalletProviderProps> = ({
  children,
  autoConnect = false,
  onError,
}: AptosWalletProviderProps) => {
  const [{ connected, account, network, wallet }, setState] =
    useState(initialState);

  // a local state to track whether wallet connect request is loading
  // https://github.com/aptos-labs/aptos-wallet-adapter/issues/94
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const walletCore: WalletCore = useMemo(() => new WalletCore(), []);

  const [wallets, setWallets] = useState<ReadonlyArray<IAptosWallet>>(
    walletCore.wallets
  );

  const connect = async (
    walletName: string,
    silent?: boolean,
    networkInfo?: NetworkInfo
  ) => {
    try {
      setIsLoading(true);
      await walletCore.connect(walletName, silent, networkInfo);
    } catch (error: any) {
      return handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      await walletCore.disconnect();
    } catch (error: any) {
      return handleError(error);
    }
  };

  const signTransaction = async (
    transaction: AnyRawTransaction,
    asFeePayer?: boolean
  ): Promise<AccountAuthenticator> => {
    try {
      return await walletCore.signTransaction(transaction, asFeePayer);
    } catch (error: any) {
      return handleError(error);
    }
  };

  const signMessage = async (
    message: AptosSignMessageInput
  ): Promise<AptosSignMessageOutput> => {
    try {
      return await walletCore.signMessage(message);
    } catch (error: any) {
      return handleError(error);
    }
  };

  const signMessageAndVerify = async (
    message: AptosSignMessageInput
  ): Promise<boolean> => {
    try {
      return await walletCore.signMessageAndVerify(message);
    } catch (error: any) {
      return handleError(error);
    }
  };

  const submitTransaction = async (
    transaction: InputSubmitTransactionData
  ): Promise<PendingTransactionResponse> => {
    try {
      return await walletCore.submitTransaction(transaction);
    } catch (error: any) {
      return handleError(error);
    }
  };

  const signAndSubmitTransaction = async (
    transaction: InputTransactionData
  ): Promise<PendingTransactionResponse> => {
    try {
      return await walletCore.signAndSubmitTransaction(transaction);
    } catch (error: any) {
      return handleError(error);
    }
  };

  useEffect(() => {
    if (autoConnect) {
      if (connected) return;
      if (localStorage.getItem("AptosWalletName")) {
        connect(localStorage.getItem("AptosWalletName") as string, true);
      } else {
        // if we dont use autoconnect set the connect is loading to false
        setIsLoading(false);
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
        wallet: undefined,
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
  const handleWalletsAddedChange = (wallets: readonly IAptosWallet[]) => {
    setWallets(wallets);
  };

  useEffect(() => {
    walletCore.on("connect", handleConnect);
    walletCore.on("disconnect", handleDisconnect);
    walletCore.on("accountChange", handleAccountChange);
    walletCore.on("networkChange", handleNetworkChange);
    walletCore.on("walletsAdded", handleWalletsAddedChange);
    return () => {
      walletCore.off("connect", handleConnect);
      walletCore.off("disconnect", handleDisconnect);
      walletCore.off("accountChange", handleAccountChange);
      walletCore.off("networkChange", handleNetworkChange);
      walletCore.off("walletsAdded", handleWalletsAddedChange);
    };
  }, [wallets, connected]);

  const handleError = (error: any) => {
    if (onError) {
      if (error instanceof AptosWalletError) {
        onError(JSON.stringify({ code: error.code, message: error.message }));
      }
      onError(error);
    }
    return Promise.reject(error);
  };

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
        submitTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
