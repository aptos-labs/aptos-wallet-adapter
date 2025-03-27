import {
  AvailableWallets,
  DappConfig,
  AccountInfo,
  AdapterWallet,
  NetworkInfo,
  InputTransactionData,
  AptosSignAndSubmitTransactionOutput,
  AnyRawTransaction,
  InputGenerateTransactionOptions,
  AccountAuthenticator,
  AptosSignMessageInput,
  AptosSignMessageOutput,
  AdapterNotDetectedWallet,
  WalletCore,
  Network,
  InputSubmitTransactionData,
  PendingTransactionResponse,
  WalletReadyState,
  AptosSignInInput,
  AptosSignInOutput,
  AnyPublicKey as AptosAnyPublicKey,
  AccountAddress,
} from "@aptos-labs/wallet-adapter-core";
import { ReactNode, FC, useState, useEffect, useCallback, useRef } from "react";
import { WalletContext } from "./useWallet";
import {
  SolanaDerivedWallet,
  SolanaPublicKey,
} from "@aptos-labs/derived-wallet-solana";
import { EIP1193DerivedWallet } from "@aptos-labs/derived-wallet-ethereum";

export interface AptosWalletProviderProps {
  children: ReactNode;
  optInWallets?: ReadonlyArray<AvailableWallets>;
  autoConnect?:
    | boolean
    | ((core: WalletCore, adapter: AdapterWallet) => Promise<boolean>);
  dappConfig?: DappConfig;
  disableTelemetry?: boolean;
  onError?: (error: any) => void;
}

export type OriginWalletDetails =
  | {
      address: string | AccountAddress;
      publicKey?: SolanaPublicKey | AptosAnyPublicKey | undefined;
    }
  | AccountInfo
  | null;

const initialState: {
  account: AccountInfo | null;
  network: NetworkInfo | null;
  connected: boolean;
  wallet: AdapterWallet | null;
} = {
  connected: false,
  account: null,
  network: null,
  wallet: null,
};

export const AptosWalletAdapterProvider: FC<AptosWalletProviderProps> = ({
  children,
  optInWallets,
  autoConnect = false,
  dappConfig,
  disableTelemetry = false,
  onError,
}: AptosWalletProviderProps) => {
  const didAttemptAutoConnectRef = useRef(false);

  const [{ account, network, connected, wallet }, setState] =
    useState(initialState);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [walletCore, setWalletCore] = useState<WalletCore>();

  const [wallets, setWallets] = useState<ReadonlyArray<AdapterWallet>>([]);
  const [notDetectedWallets, setNotDetectedWallets] = useState<
    ReadonlyArray<AdapterNotDetectedWallet>
  >([]);
  // Initialize WalletCore on first load
  useEffect(() => {
    const walletCore = new WalletCore(
      optInWallets,
      dappConfig,
      disableTelemetry
    );
    setWalletCore(walletCore);
  }, []);

  // Update initial Wallets state once WalletCore has been initialized
  useEffect(() => {
    setWallets(walletCore?.wallets ?? []);
    setNotDetectedWallets(walletCore?.notDetectedWallets ?? []);
  }, [walletCore]);

  useEffect(() => {
    // Only attempt to auto connect once per render and only if there are wallets
    if (didAttemptAutoConnectRef.current || !walletCore?.wallets.length) {
      return;
    }
    didAttemptAutoConnectRef.current = true;

    // If auto connect is not set or is false, ignore the attempt
    if (!autoConnect) {
      setIsLoading(false);
      return;
    }

    // Make sure the user has a previously connected wallet
    const walletName = localStorage.getItem("AptosWalletName");
    if (!walletName) {
      setIsLoading(false);
      return;
    }

    // Make sure the wallet is installed
    const selectedWallet = walletCore.wallets.find(
      (e) => e.name === walletName
    ) as AdapterWallet | undefined;
    if (
      !selectedWallet ||
      selectedWallet.readyState !== WalletReadyState.Installed
    ) {
      setIsLoading(false);
      return;
    }

    if (!connected) {
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

          if (shouldConnect) await connect(walletName);
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

  const connect = async (walletName: string): Promise<void> => {
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

  const signIn = async (args: {
    walletName: string;
    input: AptosSignInInput;
  }): Promise<void | AptosSignInOutput> => {
    try {
      setIsLoading(true);
      return await walletCore?.signIn(args);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async (): Promise<void> => {
    try {
      await walletCore?.disconnect();
    } catch (error) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const signAndSubmitTransaction = async (
    transaction: InputTransactionData
  ): Promise<AptosSignAndSubmitTransactionOutput> => {
    try {
      if (!walletCore) {
        throw new Error("WalletCore is not initialized");
      }
      return await walletCore.signAndSubmitTransaction(transaction);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const signTransaction = async (args: {
    transactionOrPayload: AnyRawTransaction | InputTransactionData;
    asFeePayer?: boolean;
    options?: InputGenerateTransactionOptions & {
      expirationSecondsFromNow?: number;
      expirationTimestamp?: number;
    };
  }): Promise<{
    authenticator: AccountAuthenticator;
    rawTransaction: Uint8Array;
  }> => {
    const { transactionOrPayload, asFeePayer, options } = args;
    if (!walletCore) {
      throw new Error("WalletCore is not initialized");
    }
    try {
      return await walletCore.signTransaction({
        transactionOrPayload,
        asFeePayer,
      });
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

  const signMessage = async (
    message: AptosSignMessageInput
  ): Promise<AptosSignMessageOutput> => {
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
    message: AptosSignMessageInput
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

  // Handle the adapter's connect event
  const handleConnect = (): void => {
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

  // Handle the adapter's account change event
  const handleAccountChange = useCallback((): void => {
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
  const handleNetworkChange = useCallback((): void => {
    if (!connected) return;
    if (!walletCore?.wallet) return;
    setState((state) => {
      return {
        ...state,
        network: walletCore?.network || null,
      };
    });
  }, [connected]);

  useEffect(() => {
    if (connected) {
      walletCore?.onAccountChange();
      walletCore?.onNetworkChange();
    }
  }, [connected]);

  // Handle the adapter's disconnect event
  const handleDisconnect = (): void => {
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

  const handleStandardWalletsAdded = (standardWallet: AdapterWallet): void => {
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

  const handleStandardNotDetectedWalletsAdded = (
    notDetectedWallet: AdapterNotDetectedWallet
  ): void => {
    // Manage current wallet state by removing optional duplications
    // as new wallets are coming
    const existingWalletIndex = wallets.findIndex(
      (wallet) => wallet.name == notDetectedWallet.name
    );
    if (existingWalletIndex !== -1) {
      // If wallet exists, replace it with the new wallet
      setNotDetectedWallets((wallets) => [
        ...wallets.slice(0, existingWalletIndex),
        notDetectedWallet,
        ...wallets.slice(existingWalletIndex + 1),
      ]);
    } else {
      // If wallet doesn't exist, add it to the array
      setNotDetectedWallets((wallets) => [...wallets, notDetectedWallet]);
    }
  };

  useEffect(() => {
    walletCore?.on("connect", handleConnect);
    walletCore?.on("accountChange", handleAccountChange);
    walletCore?.on("networkChange", handleNetworkChange);
    walletCore?.on("disconnect", handleDisconnect);
    walletCore?.on("standardWalletsAdded", handleStandardWalletsAdded);
    walletCore?.on(
      "standardNotDetectedWalletAdded",
      handleStandardNotDetectedWalletsAdded
    );
    return () => {
      walletCore?.off("connect", handleConnect);
      walletCore?.off("accountChange", handleAccountChange);
      walletCore?.off("networkChange", handleNetworkChange);
      walletCore?.off("disconnect", handleDisconnect);
      walletCore?.off("standardWalletsAdded", handleStandardWalletsAdded);
      walletCore?.off(
        "standardNotDetectedWalletAdded",
        handleStandardNotDetectedWalletsAdded
      );
    };
  }, [wallets, account]);

  // Define specific return types based on wallet type
  type SolanaWalletDetails = { address: string; publicKey: SolanaPublicKey };
  type EVMWalletDetails = { address: string; publicKey?: undefined };
  type AptosWalletDetails = AccountInfo | null;

  // Function overloads
  function getOriginWalletDetails(
    wallet: SolanaDerivedWallet
  ): Promise<SolanaWalletDetails>;
  function getOriginWalletDetails(
    wallet: EIP1193DerivedWallet
  ): Promise<EVMWalletDetails>;

  // Implementation
  async function getOriginWalletDetails(
    wallet: AdapterWallet
  ): Promise<OriginWalletDetails | undefined> {
    if (isSolanaDerivedWallet(wallet)) {
      const publicKey = wallet.solanaWallet.publicKey;
      return {
        publicKey: publicKey ?? undefined,
        address: publicKey?.toBase58() ?? "",
      };
    } else if (isEIP1193DerivedWallet(wallet)) {
      const [activeAccount] = await wallet.eip1193Ethers.listAccounts();
      return {
        publicKey: undefined, // No public key for EVM wallets
        address: activeAccount.address,
      };
    } else {
      // Assume Aptos Wallet
      return undefined;
    }
  }

  function isSolanaDerivedWallet(
    wallet: AdapterWallet
  ): wallet is SolanaDerivedWallet {
    return wallet instanceof SolanaDerivedWallet;
  }

  function isEIP1193DerivedWallet(
    wallet: AdapterWallet
  ): wallet is EIP1193DerivedWallet {
    return wallet instanceof EIP1193DerivedWallet;
  }

  return (
    <WalletContext.Provider
      value={{
        connect,
        signIn,
        disconnect,
        signAndSubmitTransaction,
        signTransaction,
        signMessage,
        signMessageAndVerify,
        changeNetwork,
        submitTransaction,
        getOriginWalletDetails,
        isSolanaDerivedWallet,
        isEIP1193DerivedWallet,
        account,
        network,
        connected,
        wallet,
        wallets,
        notDetectedWallets,
        isLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
