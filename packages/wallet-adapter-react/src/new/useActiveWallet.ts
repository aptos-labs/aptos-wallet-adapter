import { Network, WalletAdapter } from '@aptos-labs/wallet-adapter-core/new';
import {
  AccountInfo,
  AptosFeatures,
  AptosSignAndSubmitTransactionInput,
  AptosSignMessageInput,
  AptosSignTransactionInputV1_1,
  WalletIcon,
} from '@aptos-labs/wallet-standard';
import { useEffect, useMemo, useState } from 'react';
import { useActiveWalletId } from './useActiveWalletId';
import { useWalletManager } from './useWalletManager';

export interface UninitializedWallet {
  isInitialized: false;
  isConnected: false;
  activeAccount?: undefined;
  activeNetwork?: undefined;
}

export interface DisconnectedWallet {
  isInitialized: true;
  isConnected: false;
  activeAccount?: undefined;
  activeNetwork?: undefined;
}

export interface ConnectedWallet {
  isInitialized: true;
  isConnected: true;
  activeAccount: AccountInfo;
  activeNetwork: Network;
  name: string;
  icon: WalletIcon;
  features: AptosFeatures;
  disconnect: () => Promise<void>;
  signMessage: (input: AptosSignMessageInput)
    => ReturnType<WalletAdapter['signMessage']>;
  signTransaction: (input: Omit<AptosSignTransactionInputV1_1, 'signerAddress'>)
    => ReturnType<WalletAdapter['signTransaction']>;
  signAndSubmitTransaction: (input: AptosSignAndSubmitTransactionInput)
    => ReturnType<WalletAdapter['signAndSubmitTransaction']>;
}

type UseActiveWalletResult =
  | UninitializedWallet
  | DisconnectedWallet
  | ConnectedWallet;

export function useActiveWallet(): UseActiveWalletResult {
  const { registeredWallets } = useWalletManager();
  const activeWalletId = useActiveWalletId();
  const activeWallet = registeredWallets.find((w) => w.name === activeWalletId);

  const [isInitialized, setIsInitialized] = useState(activeWallet === undefined);
  const [activeAccount, setActiveAccount] = useState<AccountInfo>();
  const [activeNetwork, setActiveNetwork] = useState<Network>();

  useEffect(() => {
    if (!activeWallet) {
      setIsInitialized(true);
      return;
    }

    setIsInitialized(false);
    Promise.all([
      activeWallet.getActiveAccount(),
      activeWallet.getActiveNetwork(),
    ]).then(([newAccount, newNetwork]) => {
      setActiveAccount(newAccount);
      setActiveNetwork(newNetwork);
      setIsInitialized(true);
    });

    const listeners = [
      activeWallet.on('activeAccountChanged', setActiveAccount),
      activeWallet.on('activeNetworkChanged', setActiveNetwork),
      activeWallet.on('accountConnected', setActiveAccount),
      activeWallet.on('accountDisconnected', () => {
        setActiveAccount(undefined);
      }),
    ];

    return () => {
      for (const unsubscribe of listeners) {
        unsubscribe();
      }
    };
  }, [activeWallet]);

  return useMemo<UseActiveWalletResult>(() => {
    if (!isInitialized) {
      return {
        isInitialized: false,
        isConnected: false,
      } satisfies UninitializedWallet;
    }

    if (!activeWallet || !activeAccount || !activeNetwork) {
      return {
        isInitialized: true,
        isConnected: false,
      } satisfies DisconnectedWallet;
    }

    return {
      isInitialized: true,
      isConnected: true,
      activeAccount,
      activeNetwork,
      name: activeWallet.name,
      icon: activeWallet.icon,
      features: activeWallet.features,
      disconnect: async () => activeWallet.disconnect(),
      signMessage: async (input) => activeWallet.signMessage(input),
      signTransaction: async (input) => activeWallet.signTransaction(input),
      signAndSubmitTransaction: async (input) => activeWallet.signAndSubmitTransaction(input),
    } satisfies ConnectedWallet;
  }, [activeAccount, activeNetwork, activeWallet, isInitialized]);
}
