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
  InputGenerateTransactionOptions,
  AnyRawTransaction,
  InputSubmitTransactionData,
  AccountAuthenticator,
  PendingTransactionResponse,
  SignMessageResponse,
  WalletName,
  Types,
  InputTransactionData,
  Network,
  AptosStandardSupportedWallet,
  AvailableWallets,
} from "@aptos-labs/wallet-adapter-core";
import { WalletCore } from "@aptos-labs/wallet-adapter-core";

export interface AptosWalletProviderProps {
  children: ReactNode;
  plugins?: ReadonlyArray<Wallet>;
  optInWallets?: ReadonlyArray<AvailableWallets>;
  autoConnect?: boolean;
  aptosConnectConfig?: { network: Network };
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

/**
 * Supported props to pass into the provider
 *
 * @param plugins Non AIP-62 supported wallet plugins array
 * @param optInWallets AIP-62 supported wallet names array to only include in the adapter wallets
 * @param autoConnect A boolean flag to indicate if the adapter should auto connect to a wallet
 * @param aptosConnectConfig A JSON format configurations to connect with AptosConnect
 * @param onError A callback function to execute when there is an error in the adapter
 *
 */
export const AptosWalletAdapterProvider: FC<AptosWalletProviderProps> = ({
  children,
  plugins,
  optInWallets,
  autoConnect = false,
  aptosConnectConfig,
  onError,
}: AptosWalletProviderProps) => {
  const [{ connected, account, network, wallet }, setState] =
    useState(initialState);

  // a local state to track whether wallet connect request is loading
  // https://github.com/aptos-labs/aptos-wallet-adapter/issues/94
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const walletCore = useMemo(
    () => new WalletCore(plugins ?? [], optInWallets ?? [], aptosConnectConfig),
    []
  );
  const [wallets, setWallets] = useState<
    ReadonlyArray<Wallet | AptosStandardSupportedWallet>
  >(walletCore.wallets);

  const connect = async (walletName: WalletName) => {
    try {
      setIsLoading(true);
      await walletCore.connect(walletName);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      await walletCore.disconnect();
    } catch (error) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const signTransaction = async (
    transaction: AnyRawTransaction | Types.TransactionPayload,
    asFeePayer?: boolean,
    options?: InputGenerateTransactionOptions
  ): Promise<AccountAuthenticator> => {
    try {
      return await walletCore.signTransaction(transaction, asFeePayer, options);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const signMessage = async (
    message: SignMessagePayload
  ): Promise<SignMessageResponse> => {
    try {
      return await walletCore.signMessage(message);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const signMessageAndVerify = async (
    message: SignMessagePayload
  ): Promise<boolean> => {
    try {
      return await walletCore.signMessageAndVerify(message);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const submitTransaction = async (
    transaction: InputSubmitTransactionData
  ): Promise<PendingTransactionResponse> => {
    try {
      return await walletCore.submitTransaction(transaction);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const signAndSubmitTransaction = async (
    transaction: InputTransactionData
  ) => {
    try {
      return await walletCore.signAndSubmitTransaction(transaction);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const changeNetwork = async (network: Network) => {
    try {
      return await walletCore.changeNetwork(network);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    if (autoConnect) {
      if (localStorage.getItem("AptosWalletName") && !connected) {
        connect(localStorage.getItem("AptosWalletName") as WalletName);
      } else {
        // if we dont use autoconnect set the connect is loading to false
        setIsLoading(false);
      }
    }
  }, [autoConnect, wallets]);

  useEffect(() => {
    if (connected) {
      walletCore.onAccountChange();
      walletCore.onNetworkChange();
    }
  }, [connected]);

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

  const handleReadyStateChange = (updatedWallet: Wallet) => {
    // Create a new array with updated values
    const updatedWallets = (wallets as Wallet[])?.map((wallet) => {
      if (wallet.name === updatedWallet.name) {
        // Return a new object with updated value
        return { ...wallet, readyState: updatedWallet.readyState };
      }
      return wallet;
    });
    setWallets(updatedWallets);
  };

  const handleStandardWalletsAdded = (
    standardWallet: Wallet | AptosStandardSupportedWallet
  ) => {
    // Manage current wallet state by removing optional duplications
    // as new wallets are coming
    const existingWalletIndex = wallets.findIndex(
      (wallet) => wallet.name == standardWallet.name
    );
    if (existingWalletIndex !== -1) {
      // If wallet exists, replace it with the new wallet
      setWallets((wallets) => [
        ...wallets.slice(0, existingWalletIndex),
        standardWallet,
        ...wallets.slice(existingWalletIndex + 1),
      ]);
    } else {
      // If wallet doesn't exist, add it to the array
      setWallets((wallets) => [...wallets, standardWallet]);
    }
  };

  useEffect(() => {
    walletCore.on("connect", handleConnect);
    walletCore.on("disconnect", handleDisconnect);
    walletCore.on("accountChange", handleAccountChange);
    walletCore.on("networkChange", handleNetworkChange);
    walletCore.on("readyStateChange", handleReadyStateChange);
    walletCore.on("standardWalletsAdded", handleStandardWalletsAdded);
    return () => {
      walletCore.off("connect", handleConnect);
      walletCore.off("disconnect", handleDisconnect);
      walletCore.off("accountChange", handleAccountChange);
      walletCore.off("networkChange", handleNetworkChange);
      walletCore.off("readyStateChange", handleReadyStateChange);
      walletCore.off("standardWalletsAdded", handleStandardWalletsAdded);
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
        submitTransaction,
        changeNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
