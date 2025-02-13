import { FC, ReactNode, useCallback, useEffect, useRef, useState } from "react";
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
  AptosSignInInput,
} from "@aptos-labs/wallet-adapter-core";
import { DappConfig, WalletCore } from "@aptos-labs/wallet-adapter-core";

export interface AptosWalletProviderProps {
  children: ReactNode;
  plugins?: ReadonlyArray<Wallet>;
  optInWallets?: ReadonlyArray<AvailableWallets>;
  autoConnect?:
    | boolean
    | ((core: WalletCore, adapter: Wallet) => Promise<boolean>);
  dappConfig?: DappConfig;
  disableTelemetry?: boolean;
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
 * @param disableTelemetry A boolean flag to disable the adapter telemetry tool
 * @param onError A callback function to execute when there is an error in the adapter
 *
 */
export const AptosWalletAdapterProvider: FC<AptosWalletProviderProps> = ({
  children,
  plugins,
  optInWallets,
  autoConnect = false,
  dappConfig,
  disableTelemetry = false,
  onError,
}: AptosWalletProviderProps) => {
  const didAttemptAutoConnectRef = useRef(false);

  const [{ connected, account, network, wallet }, setState] =
    useState(initialState);

  // a local state to track whether wallet connect request is loading
  // https://github.com/aptos-labs/aptos-wallet-adapter/issues/94
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [walletCore, setWalletCore] = useState<WalletCore>();

  const [wallets, setWallets] = useState<
    ReadonlyArray<Wallet | AptosStandardSupportedWallet>
  >(plugins ?? []);

  // Initialize WalletCore on first load
  useEffect(() => {
    const walletCore = new WalletCore(
      plugins ?? [],
      optInWallets ?? [],
      dappConfig,
      disableTelemetry
    );
    setWalletCore(walletCore);
  }, []);

  // Update initial Wallets state once WalletCore has been initialized
  useEffect(() => {
    setWallets(walletCore?.wallets ?? []);
  }, [walletCore]);

  const connect = async (walletName: WalletName) => {
    try {
      setIsLoading(true);
      await walletCore?.connect(walletName);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (walletName: WalletName, input: AptosSignInInput) => {
    try {
      setIsLoading(true);
      return await walletCore?.signIn(walletName, input);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      await walletCore?.disconnect();
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
    if (!walletCore) {
      throw new Error("WalletCore is not initialized");
    }
    try {
      return await walletCore?.signTransaction(
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
    if (!walletCore) {
      throw new Error("WalletCore is not initialized");
    }
    try {
      return await walletCore?.signMessage(message);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const signMessageAndVerify = async (
    message: SignMessagePayload
  ): Promise<boolean> => {
    if (!walletCore) {
      throw new Error("WalletCore is not initialized");
    }
    try {
      return await walletCore?.signMessageAndVerify(message);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const submitTransaction = async (
    transaction: InputSubmitTransactionData
  ): Promise<PendingTransactionResponse> => {
    if (!walletCore) {
      throw new Error("WalletCore is not initialized");
    }
    try {
      return await walletCore?.submitTransaction(transaction);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const signAndSubmitTransaction = async (
    transaction: InputTransactionData
  ) => {
    try {
      return await walletCore?.signAndSubmitTransaction(transaction);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const changeNetwork = async (network: Network) => {
    if (!walletCore) {
      throw new Error("WalletCore is not initialized");
    }
    try {
      return await walletCore?.changeNetwork(network);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    // Only attempt to auto connect once per render and only if there are wallets
    if (didAttemptAutoConnectRef.current || !walletCore?.wallets.length) return;
    didAttemptAutoConnectRef.current = true;

    // If auto connect is not set, ignore the attempt
    if (!autoConnect) {
      setIsLoading(false);
      return;
    }

    // Make sure the user has a previously connected wallet
    const walletName = localStorage.getItem(
      "AptosWalletName"
    ) as WalletName | null;
    if (!walletName) {
      setIsLoading(false);
      return;
    }

    // Make sure the wallet is still installed
    const selectedWallet = walletCore?.wallets.find(
      (e) => e.name === walletName
    ) as Wallet | undefined;
    if (selectedWallet && walletCore && !connected) {
      (async () => {
        try {
          let shouldConnect = true;

          // Providing a function to autoConnect allows the dapp to determine
          // whether to attempt to connect to the wallet using the `signIn`
          // or `connect` method. If `signIn` is successful, the user can
          // return `false` and skip the `connect` method.
          if (typeof autoConnect === "function") {
            shouldConnect = await autoConnect(walletCore, selectedWallet);
          } else {
            shouldConnect = autoConnect;
          }

          if (shouldConnect) connect(walletName);
        } catch (error) {
          if (onError) onError(error);
          return Promise.reject(error);
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      setIsLoading(false);
    }
  }, [autoConnect, wallets]);

  useEffect(() => {
    if (connected) {
      walletCore?.onAccountChange();
      walletCore?.onNetworkChange();
    }
  }, [connected]);

  // Handle the adapter's connect event
  const handleConnect = () => {
    setState((state) => {
      return {
        ...state,
        connected: true,
        account: walletCore?.account || null,
        network: walletCore?.network || null,
        wallet: walletCore?.wallet || null,
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
        account: walletCore?.account || null,
        network: walletCore?.network || null,
        wallet: null,
      };
    });
  };

  // Handle the adapter's account change event
  const handleAccountChange = useCallback(() => {
    if (!connected) return;
    if (!walletCore?.wallet) return;
    setState((state) => {
      return {
        ...state,
        account: walletCore?.account || null,
      };
    });
  }, [connected]);

  // Handle the adapter's network event
  const handleNetworkChange = useCallback(() => {
    if (!connected) return;
    if (!walletCore?.wallet) return;
    setState((state) => {
      return {
        ...state,
        network: walletCore?.network || null,
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
    walletCore?.on("connect", handleConnect);
    walletCore?.on("disconnect", handleDisconnect);
    walletCore?.on("accountChange", handleAccountChange);
    walletCore?.on("networkChange", handleNetworkChange);
    walletCore?.on("readyStateChange", handleReadyStateChange);
    walletCore?.on("standardWalletsAdded", handleStandardWalletsAdded);
    return () => {
      walletCore?.off("connect", handleConnect);
      walletCore?.off("disconnect", handleDisconnect);
      walletCore?.off("accountChange", handleAccountChange);
      walletCore?.off("networkChange", handleNetworkChange);
      walletCore?.off("readyStateChange", handleReadyStateChange);
      walletCore?.off("standardWalletsAdded", handleStandardWalletsAdded);
    };
  }, [wallets, account]);

  return (
    <WalletContext.Provider
      value={{
        connect,
        signIn,
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
