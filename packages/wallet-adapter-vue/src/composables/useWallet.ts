import {
  AccountAuthenticator,
  AccountInfo,
  AdapterWallet,
  AnyRawTransaction,
  InputTransactionData,
  NetworkInfo,
  AptosSignMessageInput,
  AptosSignMessageOutput,
  AdapterNotDetectedWallet,
  Network,
  AptosChangeNetworkOutput,
  PendingTransactionResponse,
  InputSubmitTransactionData,
  AvailableWallets,
  WalletCore,
  WalletCoreEvents,
} from "@aptos-labs/wallet-adapter-core";
import {
  ref,
  Ref,
  watch,
  onBeforeUnmount,
  MaybeRef,
  unref,
  computed,
  ComputedRef,
} from "vue";

export interface WalletContextState {
  connected: ComputedRef<boolean>;
  isLoading: ComputedRef<boolean>;
  account: ComputedRef<AccountInfo | null>;
  network: ComputedRef<NetworkInfo | null>;
  wallet: ComputedRef<AdapterWallet | null>;
  wallets?: Ref<ReadonlyArray<AdapterWallet>>;
  notDetectedWallets?: Ref<ReadonlyArray<AdapterNotDetectedWallet>>;
  autoConnect: Ref<boolean>;
  connect(walletName: string): void;
  disconnect(): void;
  signAndSubmitTransaction(transaction: InputTransactionData): Promise<any>;
  signTransaction(
    transactionOrPayload: AnyRawTransaction | InputTransactionData,
    asFeePayer?: boolean
  ): Promise<{
    authenticator: AccountAuthenticator;
    rawTransaction: Uint8Array;
  }>;
  submitTransaction(
    transaction: InputSubmitTransactionData
  ): Promise<PendingTransactionResponse>;
  signMessage(message: AptosSignMessageInput): Promise<AptosSignMessageOutput>;
  signMessageAndVerify(message: AptosSignMessageInput): Promise<boolean>;
  changeNetwork(network: Network): Promise<AptosChangeNetworkOutput>;
}

export interface AptosWalletProviderProps {
  disableTelemetry?: boolean;
  optInWallets?: ReadonlyArray<AvailableWallets>;
  dappConfig?: { network: Network };
  onError?: (error: any) => void;
}

const LOCAL_STORAGE_KEY = "AptosWalletName";

const initialState: {
  account: AccountInfo | null;
  network: NetworkInfo | null;
  connected: boolean;
  wallet: AdapterWallet | null;
} = {
  account: null,
  network: null,
  connected: false,
  wallet: null,
};

const walletCore = ref<WalletCore>();
const state = ref(initialState);
const wallets = ref<AdapterWallet[]>([]);
const notDetectedWallets = ref<AdapterNotDetectedWallet[]>([]);
const autoConnect = ref(false);
const isConnecting = ref(false);

function getWalletCoreInstance(
  optInWallets: readonly AvailableWallets[] | undefined,
  dappConfig: { network: Network } | undefined,
  disableTelemetry: boolean | undefined
) {
  if (!walletCore.value) {
    walletCore.value = new WalletCore(
      optInWallets ?? [],
      dappConfig,
      disableTelemetry
    );
    Object.assign(wallets.value, walletCore.value.wallets);
  }
  return walletCore.value;
}

/**
 *
 * @param {AptosWalletProviderProps} props - Optional object with properties for
 * configuring the wallet adapter.
 * @return {WalletContextState}
 */
export function useWallet(
  props?: AptosWalletProviderProps
): WalletContextState {
  const { disableTelemetry, optInWallets, dappConfig, onError } = props ?? {};

  const walletCoreInstance = getWalletCoreInstance(
    optInWallets,
    dappConfig,
    disableTelemetry
  );

  const connect = async (walletName: string) => {
    try {
      isConnecting.value = true;
      await walletCoreInstance.connect(walletName);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    } finally {
      isConnecting.value = false;
    }
  };

  const disconnect = async () => {
    try {
      await walletCoreInstance.disconnect();
    } catch (error) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const signTransaction = async (
    transaction: AnyRawTransaction | InputTransactionData,
    asFeePayer?: boolean
  ): Promise<{
    authenticator: AccountAuthenticator;
    rawTransaction: Uint8Array;
  }> => {
    try {
      return await walletCoreInstance.signTransaction({
        transactionOrPayload: transaction,
        asFeePayer,
      });
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const signMessage = async (
    message: AptosSignMessageInput
  ): Promise<AptosSignMessageOutput> => {
    try {
      return await walletCoreInstance.signMessage(message);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const signMessageAndVerify = async (
    message: AptosSignMessageInput
  ): Promise<boolean> => {
    try {
      return await walletCoreInstance.signMessageAndVerify(message);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const submitTransaction = async (
    transaction: InputSubmitTransactionData
  ): Promise<PendingTransactionResponse> => {
    try {
      return await walletCoreInstance.submitTransaction(transaction);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const signAndSubmitTransaction = async (
    transaction: InputTransactionData
  ) => {
    try {
      return await walletCoreInstance.signAndSubmitTransaction(transaction);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const changeNetwork = async (network: Network) => {
    try {
      return await walletCoreInstance.changeNetwork(network);
    } catch (error: any) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const handleReadyStateChange = (updatedWallet: MaybeRef<AdapterWallet>) => {
    const _updatedWallet = unref(updatedWallet);
    const wallet = wallets.value.find(
      (wallet) => wallet.name === _updatedWallet.name
    );
    if (wallet) {
      wallet.readyState = _updatedWallet.readyState;
    }
  };

  const handleStandardWalletsAdded = (
    standardWallet: MaybeRef<AdapterWallet>
  ) => {
    const _standardWallet = unref(standardWallet);

    const existingWallet = wallets.value.find(
      (wallet) => wallet.name == _standardWallet.name
    );

    if (existingWallet) {
      Object.assign(existingWallet, _standardWallet);
    } else {
      wallets.value.push(_standardWallet);
    }
  };

  const handleStandardNotDetectedWalletsAdded = (
    notDetectedWallet: MaybeRef<AdapterNotDetectedWallet>
  ): void => {
    const _notDetectedWallet = unref(notDetectedWallet);
    // Manage current wallet state by removing optional duplications
    // as new wallets are coming
    const existingWallet = wallets.value.find(
      (wallet) => wallet.name == _notDetectedWallet.name
    );
    if (existingWallet) {
      Object.assign(existingWallet, _notDetectedWallet);
    } else {
      notDetectedWallets.value.push(_notDetectedWallet);
    }
  };

  const handleConnect = () => {
    const newState = {
      ...state.value,
      connected: true,
      account: walletCoreInstance.account || null,
      network: walletCoreInstance.network || null,
      wallet: walletCoreInstance.wallet || null,
    };
    Object.assign(state.value, newState);
  };

  const handleDisconnect = () => {
    if (!state.value.connected) {
      return;
    }
    const newState = {
      ...state.value,
      connected: false,
      account: null,
      network: null,
      wallet: null,
    };
    Object.assign(state.value, newState);
  };

  const handleAccountChange = () => {
    if (!state.value.connected) {
      return;
    }
    if (!walletCoreInstance.wallet) {
      return;
    }
    const newState = {
      ...state.value,
      account: walletCoreInstance.account,
    };

    Object.assign(state.value, newState);
  };

  const handleNetworkChange = () => {
    if (!state.value.connected) {
      return;
    }
    if (!walletCoreInstance.wallet) {
      return;
    }

    const newState = {
      ...state.value,
      network: walletCoreInstance.network,
    };

    Object.assign(state.value, newState);
  };

  const eventHandlers: Record<
    keyof WalletCoreEvents,
    (args?: MaybeRef<any>) => void
  > = {
    connect: handleConnect,
    disconnect: handleDisconnect,
    accountChange: handleAccountChange,
    networkChange: handleNetworkChange,
    standardWalletsAdded: handleStandardWalletsAdded,
    standardNotDetectedWalletAdded: handleStandardNotDetectedWalletsAdded,
  };

  onBeforeUnmount(() => {
    if (walletCoreInstance) {
      Object.keys(eventHandlers).forEach((event) => {
        walletCoreInstance.off(
          event as keyof WalletCoreEvents,
          eventHandlers[event as keyof WalletCoreEvents]
        );
      });
    }
    walletCore.value = undefined;
    wallets.value = [];
    Object.assign(state.value, initialState);
  });

  watch(
    () => walletCoreInstance,
    (newWalletCore) => {
      if (newWalletCore) {
        Object.keys(eventHandlers).forEach((event) => {
          walletCoreInstance.on(
            event as keyof WalletCoreEvents,
            eventHandlers[event as keyof WalletCoreEvents]
          );
        });
      }
    },
    {
      immediate: true,
    }
  );

  watch(
    autoConnect,
    async (newAutoConnect) => {
      if (newAutoConnect) {
        if (localStorage.getItem(LOCAL_STORAGE_KEY) && !state.value.connected) {
          await connect(localStorage.getItem(LOCAL_STORAGE_KEY) as string);
        } else {
          isConnecting.value = false;
        }
      }
    },
    {
      immediate: true,
    }
  );

  watch(
    () => state.value.connected,
    (connected) => {
      if (connected) {
        walletCoreInstance.onAccountChange();
        walletCoreInstance.onNetworkChange();
      }
    },
    {
      immediate: true,
    }
  );

  return {
    connected: computed(() => state.value.connected),
    isLoading: computed(() => isConnecting.value),
    account: computed(() => state.value.account),
    network: computed(() => state.value.network),
    wallet: computed(() => state.value.wallet),
    wallets,
    autoConnect,
    connect,
    disconnect,
    signAndSubmitTransaction,
    signTransaction,
    submitTransaction,
    signMessage,
    signMessageAndVerify,
    changeNetwork,
  };
}
