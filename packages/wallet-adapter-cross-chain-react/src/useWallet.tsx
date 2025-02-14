import {
  AptosSolanaWallet,
  Chain,
  AptosCrossChainWallet,
  UsdcBalance,
  WormholeQuote,
} from "@aptos-labs/cross-chain-core";
import { Eip6963Wallet } from "@aptos-labs/cross-chain-core";
import { createContext, useContext } from "react";

const DEFAULT_CONTEXT = {
  connected: false,
};

export interface WalletContextState {
  connected: boolean;
  isLoading: boolean;
  wallet: AptosCrossChainWallet | null;
  getSolanaWallets: () => ReadonlyArray<AptosSolanaWallet>;
  getEthereumWallets: () => ReadonlyArray<Eip6963Wallet>;
  connect: (wallet: AptosCrossChainWallet) => Promise<string[]>;
  disconnect: () => Promise<void>;
  getQuote: (amount: string, sourceChain: Chain) => Promise<WormholeQuote>;
  initiateTransfer: (
    sourceChain: Chain
  ) => Promise<{ originChainTxnId: string; destinationChainTxnId: string }>;
  getUsdcBalance: (
    wallet: AptosCrossChainWallet,
    chain: Chain
  ) => Promise<UsdcBalance>;
}

export const WalletContext = createContext<WalletContextState>(
  DEFAULT_CONTEXT as WalletContextState
);

export function useCrossChainWallet(): WalletContextState {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletContextState");
  }
  return context;
}
