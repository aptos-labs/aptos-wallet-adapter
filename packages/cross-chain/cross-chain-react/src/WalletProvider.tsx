import { FC, ReactNode, useEffect, useState } from "react";
import {
  Chain,
  CrossChainCore,
  CrossChainDappConfig,
  WormholeQuoteResponse,
  WormholeInitiateTransferResponse,
  CrossChainProvider,
  AptosAccount,
  GasStationApiKey,
  AccountAddressInput,
  ChainsConfig,
  ChainConfig,
  NetworkToChainId,
  NetworkToNodeAPI,
} from "@aptos-labs/cross-chain-core";
import {
  AccountInfo,
  AptosSignInInput,
  NetworkInfo,
} from "@aptos-labs/wallet-standard";
import { getSolanaStandardWallets } from "@aptos-labs/wallet-adapter-aggregator-solana";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-aggregator-core";
import { fetchEthereumWallets as fetchEthereumWalletsAggregator } from "@aptos-labs/wallet-adapter-aggregator-eip6963";
import {
  getAptosWallets as getAptosStandardWallets,
  AptosNotDetectedWallet,
  getAptosNotDetectedWallets,
} from "@aptos-labs/wallet-adapter-aggregator-aptos";

export type { AptosNotDetectedWallet };

import { WalletContext } from "./useWallet";

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
  network: NetworkInfo | null;
} = {
  connected: false,
  account: null,
  wallet: null,
  sourceChain: null,
  setSourceChain: () => {},
  network: null,
};

export const AptosCrossChainWalletProvider: FC<
  AptosCrossChainWalletProviderProps
> = ({ children, dappConfig, disableTelemetry, onError }) => {
  const [{ connected, wallet, account, sourceChain, network }, setState] =
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

  const getSolanaWallets = (): ReadonlyArray<AdapterWallet> => {
    return getSolanaStandardWallets();
  };

  const getEthereumWallets = (): ReadonlyArray<AdapterWallet> => {
    return fetchEthereumWalletsAggregator();
  };

  const getAptosWallets = (): ReadonlyArray<AdapterWallet> => {
    return getAptosStandardWallets();
  };

  const fetchAptosNotDetectedWallets =
    (): ReadonlyArray<AptosNotDetectedWallet> => {
      return getAptosNotDetectedWallets();
    };

  useEffect(() => {
    if (!wallet) return;

    const handleAccountChange = (newAccount: AccountInfo | null) => {
      setState((prev) => ({ ...prev, account: newAccount }));
    };

    const handleNetworkChange = (newNetwork: NetworkInfo | null) => {
      //setState((prev) => ({ ...prev, sourceChain: newNetwork.name }));
      console.log("new network is", newNetwork);
    };

    // Register the listener
    wallet.on("accountChange", handleAccountChange);
    wallet.on("networkChange", handleNetworkChange);
    return () => {
      wallet.off("accountChange", handleAccountChange);
      wallet.off("networkChange", handleNetworkChange);
    };
  }, [wallet]);

  const getQuote = async <T extends QuoteResponse>(args: {
    amount: string;
    sourceChain: Chain;
  }): Promise<T> => {
    try {
      const { amount, sourceChain } = args;
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

  const initiateTransfer = async (args: {
    sourceChain: Chain;
    destinationAddress: AccountAddressInput;
    mainSigner: AptosAccount;
    sponsorAccount?: AptosAccount | GasStationApiKey;
  }): Promise<{ originChainTxnId: string; destinationChainTxnId: string }> => {
    try {
      const { sourceChain, mainSigner, sponsorAccount, destinationAddress } =
        args;
      if (!provider) {
        throw new Error("Provider is not set");
      }
      const { originChainTxnId, destinationChainTxnId } =
        await provider.initiateCCTPTransfer({
          sourceChain,
          wallet,
          destinationAddress,
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
        network: {
          name: dappConfig.aptosNetwork,
          chainId: NetworkToChainId[dappConfig.aptosNetwork],
          url: NetworkToNodeAPI[dappConfig.aptosNetwork],
        },
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
        network: null,
      }));
    } catch (error) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const signInWith = async (args: {
    wallet: AdapterWallet;
    input: Omit<AptosSignInInput, "nonce">;
  }) => {
    try {
      const { input, wallet } = args;
      if (!wallet.signIn) {
        throw new Error("Wallet does not support signIn").message;
      }
      const response = await wallet.signIn(input);
      console.log("WalletProvider signInWith response", response);
      setState((state) => ({
        ...state,
        connected: true,
        wallet: wallet,
        account: response.account,
        network: {
          name: dappConfig.aptosNetwork,
          chainId: NetworkToChainId[dappConfig.aptosNetwork],
          url: NetworkToNodeAPI[dappConfig.aptosNetwork],
        },
      }));
    } catch (error) {
      if (onError) onError(error);
      return Promise.reject(error);
    }
  };

  const getChainInfo = (chain: Chain): ChainConfig => {
    if (!crossChainCore) {
      throw new Error("CrossChainCore is not set");
    }
    const chainConfig = crossChainCore.CHAINS[chain];
    if (!chainConfig) {
      throw new Error(`Chain config not found for chain: ${chain}`);
    }
    return chainConfig;
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        account,
        network,
        isLoading: false,
        getSolanaWallets,
        getEthereumWallets,
        getAptosWallets,
        fetchAptosNotDetectedWallets,
        getChainInfo,
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
