import { FC, ReactNode, useEffect, useState } from "react";
import { WalletContext } from "./useWallet";
import {
  Chain,
  Connection,
  CrossChainCore,
  CrossChainDappConfig,
  Eip6963Wallet,
  getSolanaStandardWallets,
  Network,
  UsdcBalance,
  WormholeQuote,
  WormholeRequest,
  WormholeRouteResponse,
  AptosSolanaWallet,
  AptosCrossChainWallet,
  fetchEthereumWallets,
} from "@aptos-labs/cross-chain-core";
export interface AptosCrossChainWalletProviderProps {
  children: ReactNode;
  dappConfig: CrossChainDappConfig;
  disableTelemetry?: boolean;
}

const initialState: {
  connected: boolean;
  wallet: AptosCrossChainWallet | null;
  sourceChain: Chain | null;
} = {
  connected: false,
  wallet: null,
  sourceChain: null,
};

export const AptosCrossChainWalletProvider: FC<
  AptosCrossChainWalletProviderProps
> = ({ children, dappConfig, disableTelemetry }) => {
  const [{ connected, wallet }, setState] = useState(initialState);

  const [crossChainCore, setCrossChainCore] = useState<CrossChainCore>();

  const [wormholeRoute, setWormholeRoute] = useState<
    WormholeRouteResponse | undefined
  >(undefined);
  const [wormholeRequest, setWormholeRequest] = useState<
    WormholeRequest | undefined
  >(undefined);
  const [wormholeQuote, setWormholeQuote] = useState<WormholeQuote | undefined>(
    undefined
  );

  useEffect(() => {
    const crossChainCore = new CrossChainCore({ dappConfig });
    setCrossChainCore(crossChainCore);
  }, []);

  // TODO fix me, on first load I get an empty array
  const getSolanaWallets = (): ReadonlyArray<AptosSolanaWallet> => {
    const connection =
      // TODO: do we really need it?
      // https://github.com/XLabs/wallet-aggregator-sdk/blob/master/packages/wallets/solana/src/utils.ts#L21
      // https://github.com/anza-xyz/wallet-standard/blob/master/packages/wallet-adapter/base/src/adapter.ts#L103

      // const cluster = "mainnet-beta";
      // const url = clusterApiUrl(cluster);
      // solana rpc should come from the dappConfig
      dappConfig?.network === Network.MAINNET
        ? "https://solana-mainnet.rpc.extrnode.com/eb370d10-948a-4f47-8017-a80241a5c7fc"
        : "https://api.devnet.solana.com";
    return getSolanaStandardWallets(new Connection(connection));
  };

  const getEthereumWallets = (): ReadonlyArray<Eip6963Wallet> => {
    return fetchEthereumWallets();
  };

  const getQuote = async (
    amount: string,
    sourceChain: Chain
  ): Promise<WormholeQuote> => {
    try {
      if (!crossChainCore) {
        throw new Error("CrossChainCore not initialized");
      }
      if (!crossChainCore.wormholeContext) {
        await crossChainCore.setWormholeContext(sourceChain);
      }
      const { route, request } =
        await crossChainCore.getWormholeCctpRoute(sourceChain);
      const quote = await crossChainCore?.getQuote(amount, route, request);
      setWormholeQuote(quote);
      setWormholeRequest(request);
      setWormholeRoute(route);
      return quote;
    } catch (error) {
      console.error("Error getting quote", error);
      throw error;
    }
  };

  const initiateTransfer = async (
    sourceChain: Chain
  ): Promise<{ originChainTxnId: string; destinationChainTxnId: string }> => {
    try {
      if (!crossChainCore) {
        throw new Error("CrossChainCore not initialized");
      }
      if (!wormholeRoute || !wormholeRequest || !wormholeQuote || !wallet) {
        throw new Error(
          "Wormhole route, request, wallet, or quote not initialized"
        );
      }
      const { originChainTxnId, receipt } = await wallet.CCTPTransfer(
        sourceChain,
        wormholeRoute,
        wormholeRequest,
        wormholeQuote
      );
      const { destinationChainTxnId } =
        await crossChainCore.completeCCTPTransfer(wormholeRoute, receipt);

      return { originChainTxnId, destinationChainTxnId };
    } catch (error) {
      console.error("Error initiating transfer", error);
      throw error;
    }
  };

  const getUsdcBalance = async (
    wallet: AptosCrossChainWallet
  ): Promise<UsdcBalance> => {
    return await wallet.getUsdcBalance();
  };

  const connect = async (wallet: AptosCrossChainWallet): Promise<string[]> => {
    try {
      await wallet.connect();
      setState((state) => ({
        ...state,
        connected: true,
        wallet: wallet,
      }));
      return wallet.getAddresses();
    } catch (error) {
      console.error("Error connecting wallet", error);
      throw error;
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
      console.error("Error disconnecting wallet", error);
      throw error;
    }
  };
  return (
    <WalletContext.Provider
      value={{
        connected,
        isLoading: false,
        getSolanaWallets,
        getEthereumWallets,
        connect,
        disconnect,
        wallet,
        getQuote,
        initiateTransfer,
        getUsdcBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
