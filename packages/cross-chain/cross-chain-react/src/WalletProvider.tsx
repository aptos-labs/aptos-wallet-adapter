import { FC, ReactNode, useEffect, useState } from "react";
import { WalletContext } from "./useWallet";
import {
  Chain,
  CrossChainCore,
  CrossChainDappConfig,
  Network,
  WormholeQuoteResponse,
  WormholeInitiateTransferResponse,
  CrossChainProvider,
  AptosAccount,
} from "@aptos-labs/cross-chain-core";
import { AccountInfo, NetworkInfo } from "@aptos-labs/wallet-standard";
import { getSolanaStandardWallets } from "@aptos-labs/wallet-adapter-aggregator-solana";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-aggregator-core";
import { fetchEthereumWallets as fetchEthereumWalletsAggregator } from "@aptos-labs/wallet-adapter-aggregator-eip6963";
import { getAptosWallets as getAptosStandardWallets } from "@aptos-labs/wallet-adapter-aggregator-aptos";

export interface AptosCrossChainWalletProviderProps {
  children: ReactNode;
  dappConfig: CrossChainDappConfig;
  disableTelemetry?: boolean;
  onError?: (error: any) => void;
}

export type { AdapterWallet };

export type QuoteResponse = WormholeQuoteResponse;

export type InitiateTransferResponse = WormholeInitiateTransferResponse;

const initialState: {
  connected: boolean;
  account: AccountInfo | null;
  wallet: AdapterWallet | null;
  sourceChain: Chain | null;
  setSourceChain: (chain: Chain) => void;
} = {
  connected: false,
  account: null,
  wallet: null,
  sourceChain: null,
  setSourceChain: () => {},
};

export const AptosCrossChainWalletProvider: FC<
  AptosCrossChainWalletProviderProps
> = ({ children, dappConfig, disableTelemetry, onError }) => {
  const [{ connected, wallet, account, sourceChain }, setState] =
    useState(initialState);

  const [provider, setProvider] = useState<CrossChainProvider>();

  const setSourceChain = (chain: Chain) => {
    setState((prev) => ({ ...prev, sourceChain: chain }));
  };

  const [crossChainCore, setCrossChainCore] = useState<CrossChainCore>();

  useEffect(() => {
    const crossChainCore = new CrossChainCore({ dappConfig });
    setCrossChainCore(crossChainCore);
  }, []);

  // TODO fix me, on first load I get an empty array
  const getSolanaWallets = (): ReadonlyArray<AdapterWallet> => {
    return getSolanaStandardWallets();
  };

  const getEthereumWallets = (): ReadonlyArray<AdapterWallet> => {
    return fetchEthereumWalletsAggregator();
  };

  const getAptosWallets = (): ReadonlyArray<AdapterWallet> => {
    return getAptosStandardWallets();
  };

  useEffect(() => {
    if (!wallet) return;

    const handleAccountChange = (newAccount: AccountInfo | null) => {
      setState((prev) => ({ ...prev, account: newAccount }));
    };

    const handleNetworkChange = (newNetwork: NetworkInfo | null) => {
      //setState((prev) => ({ ...prev, sourceChain: newNetwork.name }));
      console.log("handleNetworkChange not implemented");
    };

    // Register the listener
    wallet.on("accountChange", handleAccountChange);
    wallet.on("networkChange", handleNetworkChange);
    return () => {
      wallet.off("accountChange", handleAccountChange);
      wallet.off("networkChange", handleNetworkChange);
    };
  }, [wallet]);

  const getQuote = async <T extends QuoteResponse>(
    amount: string,
    sourceChain: Chain
  ): Promise<T> => {
    try {
      const provider = crossChainCore?.getProvider("Wormhole");

      if (!provider) {
        throw new Error("Provider not found");
      }
      setProvider(provider);

      const quote = await provider?.getQuote({
        amount,
        sourceChain,
      });

      return quote;
    } catch (error) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const initiateTransfer = async (
    sourceChain: Chain,
    mainSigner: AptosAccount,
    sponsorAccount?: AptosAccount | Partial<Record<Network, string>>
  ): Promise<{ originChainTxnId: string; destinationChainTxnId: string }> => {
    try {
      if (!provider) {
        throw new Error("Provider is not set");
      }
      const { originChainTxnId, destinationChainTxnId } =
        await provider.initiateCCTPTransfer({
          sourceChain,
          wallet,
          // TODO: should be set by the dapp, ideally it is be the DAA address
          destinationAddress:
            "0x38383091fdd9325e0b8ada990c474da8c7f5aa51580b65eb477885b6ce0a36b7",
          mainSigner,
          sponsorAccount,
        });

      return { originChainTxnId, destinationChainTxnId };
    } catch (error) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const connect = async (wallet: AdapterWallet): Promise<void> => {
    try {
      const response = await wallet.connect();
      setState((state) => ({
        ...state,
        connected: true,
        wallet: wallet,
        account: response,
      }));
    } catch (error) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const disconnect = async () => {
    try {
      await wallet?.disconnect();
      setState((state) => ({
        ...state,
        connected: false,
        wallet: null,
      }));
    } catch (error) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const signInWith = async (wallet: AdapterWallet) => {
    try {
      if (!wallet.signIn) {
        throw new Error("Wallet does not support signIn").message;
      }
      const response = await wallet.signIn();
      setState((state) => ({
        ...state,
        connected: true,
        wallet: wallet,
        account: response.account,
      }));
      console.log("WalletProvider signInWithWallet response", response);
    } catch (error) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        account,
        isLoading: false,
        getSolanaWallets,
        getEthereumWallets,
        getAptosWallets,
        connect,
        disconnect,
        signInWith,
        wallet,
        getQuote,
        initiateTransfer,
        sourceChain,
        setSourceChain,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
