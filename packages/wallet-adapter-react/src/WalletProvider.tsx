import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
  AptosChangeNetworkOutput,
} from "@aptos-labs/wallet-adapter-core";
import { WalletCore } from "@aptos-labs/wallet-adapter-core";

export interface AptosWalletProviderProps {
  children: ReactNode;
  plugins?: ReadonlyArray<Wallet>;
  optInWallets?: ReadonlyArray<AvailableWallets>;
  autoConnect?: boolean;
  dappConfig?: { network: Network };
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
 * @param dappConfig The dapp configurations to be used by SDK wallets to set their configurations
 * @param onError A callback function to execute when there is an error in the adapter
 *
 */
export const AptosWalletAdapterProvider: FC<AptosWalletProviderProps> = ({
  children,
  plugins,
  optInWallets,
  autoConnect = false,
  dappConfig,
  onError,
}: AptosWalletProviderProps) => {
  const [{ connected, account, network, wallet }, setState] =
    useState(initialState);

  // a local state to track whether wallet connect request is loading
  // https://github.com/aptos-labs/aptos-wallet-adapter/issues/94
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [wallets, setWallets] = useState<
    ReadonlyArray<Wallet | AptosStandardSupportedWallet>
  >([]);

  const walletCoreRef = useRef<WalletCore>();

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

  // Handle the adapter's connect event
  const handleConnect = () => {
    setState((state) => {
      return {
        ...state,
        connected: true,
        account: walletCoreRef?.current?.account || null,
        network: walletCoreRef?.current?.network || null,
        wallet: walletCoreRef?.current?.wallet || null,
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
        account: walletCoreRef?.current?.account || null,
        network: walletCoreRef?.current?.network || null,
        wallet: null,
      };
    });
  };

  // Handle the adapter's account change event
  const handleAccountChange = useCallback(() => {
    if (!connected) return;
    if (!walletCoreRef?.current?.wallet) return;
    setState((state) => {
      return {
        ...state,
        account: walletCoreRef?.current?.account || null,
      };
    });
  }, [connected]);

  // Handle the adapter's network event
  const handleNetworkChange = useCallback(() => {
    if (!connected) return;
    if (!walletCoreRef?.current?.wallet) return;
    setState((state) => {
      return {
        ...state,
        network: walletCoreRef?.current?.network || null,
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

  // Initialize WalletCore on first load and register first load
  // nessecery event listeners
  useEffect(() => {
    const walletCore = new WalletCore(
      plugins ?? [],
      optInWallets ?? [],
      dappConfig
    );
    walletCoreRef.current = walletCore;

    walletCore.on("standardWalletsAdded", handleStandardWalletsAdded);
    walletCore.on("readyStateChange", handleReadyStateChange);

    walletCore.initialize();
    return () => {
      walletCore.off("standardWalletsAdded", handleStandardWalletsAdded);
      walletCore.off("readyStateChange", handleReadyStateChange);
    };
  }, []);

  // Update initial Wallets state once WalletCore has been initialized
  useEffect(() => {
    if (walletCoreRef?.current) {
      setWallets(walletCoreRef?.current?.wallets);
    }
  }, [walletCoreRef]);

  // Register all event listeners
  useEffect(() => {
    walletCoreRef?.current?.on("connect", handleConnect);
    walletCoreRef?.current?.on("disconnect", handleDisconnect);
    walletCoreRef?.current?.on("accountChange", handleAccountChange);
    walletCoreRef?.current?.on("networkChange", handleNetworkChange);
    return () => {
      walletCoreRef?.current?.off("connect", handleConnect);
      walletCoreRef?.current?.off("disconnect", handleDisconnect);
      walletCoreRef?.current?.off("accountChange", handleAccountChange);
      walletCoreRef?.current?.off("networkChange", handleNetworkChange);
    };
  }, [wallets, connected]);

  const connect = async (walletName: WalletName) => {
    try {
      setIsLoading(true);

      await walletCoreRef?.current?.connect(walletName);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      await walletCoreRef?.current?.disconnect();
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
      if (!walletCoreRef.current) {
        throw new Error("WalletCore is not initialized");
      }
      return await walletCoreRef?.current?.signTransaction(
        transaction,
        asFeePayer,
        options
      );
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const signMessage = async (
    message: SignMessagePayload
  ): Promise<SignMessageResponse> => {
    try {
      if (!walletCoreRef.current) {
        throw new Error("WalletCore is not initialized");
      }
      return await walletCoreRef?.current?.signMessage(message);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const signMessageAndVerify = async (
    message: SignMessagePayload
  ): Promise<boolean> => {
    try {
      if (!walletCoreRef.current) {
        throw new Error("WalletCore is not initialized");
      }
      return await walletCoreRef?.current?.signMessageAndVerify(message);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const submitTransaction = async (
    transaction: InputSubmitTransactionData
  ): Promise<PendingTransactionResponse> => {
    try {
      if (!walletCoreRef.current) {
        throw new Error("WalletCore is not initialized");
      }
      return await walletCoreRef?.current?.submitTransaction(transaction);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const signAndSubmitTransaction = async (
    transaction: InputTransactionData
  ) => {
    try {
      console.log("walletCoreRef?.current?", walletCoreRef?.current);
      return await walletCoreRef?.current?.signAndSubmitTransaction(
        transaction
      );
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const changeNetwork = async (
    network: Network
  ): Promise<AptosChangeNetworkOutput> => {
    try {
      if (!walletCoreRef.current) {
        throw new Error("WalletCore is not initialized");
      }
      return await walletCoreRef?.current?.changeNetwork(network);
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
      walletCoreRef?.current?.onAccountChange();
      walletCoreRef?.current?.onNetworkChange();
    }
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
