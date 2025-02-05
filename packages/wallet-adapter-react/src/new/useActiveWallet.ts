import { AdaptedWallet, NewNetwork as Network, StandardNetwork } from '@aptos-labs/wallet-adapter-core';
import {
  AccountInfo,
  AptosSignAndSubmitTransactionInput,
  AptosSignMessageInput,
  AptosSignTransactionInputV1_1,
} from '@aptos-labs/wallet-standard';
import { useEffect, useMemo, useState } from 'react';
import { useActiveWalletId } from './useActiveWalletId';
import { useAvailableWallets } from './useAvailableWallets';

export interface UseActiveWalletUninitializedResult {
  isInitialized: false;
  isConnected: false;
  account?: undefined;
  network?: undefined;
  wallet?: undefined;
}

export interface UseActiveWalletDisconnectedResult {
  isInitialized: true;
  isConnected: false;
  account?: undefined;
  network?: undefined;
  wallet?: undefined;
}

export interface UseActiveWalletConnectedResult {
  isInitialized: true;
  isConnected: true;
  account: AccountInfo;
  network: Network;
  // wallet: Wallet;
  disconnect: () => Promise<void>;
  signMessage: (input: AptosSignMessageInput)
    => ReturnType<AdaptedWallet['signMessage']>;
  signTransaction: (input: Omit<AptosSignTransactionInputV1_1, 'signerAddress'>)
    => ReturnType<AdaptedWallet['signTransaction']>;
  signAndSubmitTransaction: (input: AptosSignAndSubmitTransactionInput)
    => ReturnType<AdaptedWallet['signAndSubmitTransaction']>;
}

type UseActiveWalletResult =
  UseActiveWalletUninitializedResult
  | UseActiveWalletDisconnectedResult
  | UseActiveWalletConnectedResult;

export function useActiveWallet(): UseActiveWalletResult {
  const availableWallets = useAvailableWallets();
  const activeWalletId = useActiveWalletId();
  const activeWallet = activeWalletId
    ? availableWallets.find((w) => w.name === activeWalletId)
    : undefined;

  const [isInitialized, setIsInitialized] = useState(activeWallet === undefined);
  const [activeAccount, setActiveAccount] = useState<AccountInfo>();
  const [activeNetwork, setActiveNetwork] = useState<Network>(StandardNetwork.MAINNET);

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
      } satisfies UseActiveWalletUninitializedResult;
    }

    if (!activeWallet || !activeAccount) {
      return {
        isInitialized: true,
        isConnected: false,
      } satisfies UseActiveWalletDisconnectedResult;
    }

    return {
      isInitialized: true,
      isConnected: true,
      // todo: pass other useful info
      // wallet: activeWallet,
      account: activeAccount,
      network: activeNetwork,
      disconnect: async () => activeWallet.disconnect(),
      signMessage: async (input) => activeWallet.signMessage(input),
      signTransaction: async (input) => activeWallet.signTransaction(input),
      signAndSubmitTransaction: async (input) => activeWallet.signAndSubmitTransaction(input),
    } satisfies UseActiveWalletConnectedResult;
  }, [activeAccount, activeNetwork, activeWallet, isInitialized]);
}
