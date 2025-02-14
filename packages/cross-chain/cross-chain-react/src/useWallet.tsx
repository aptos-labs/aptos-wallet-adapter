import {
  Chain,
  Network,
  UsdcBalance,
  WormholeQuoteResponse,
  AptosAccount,
} from "@aptos-labs/cross-chain-core";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-aggregator-core";
import { AccountInfo } from "@aptos-labs/wallet-standard";
import { createContext, useContext } from "react";

const DEFAULT_CONTEXT = {
  connected: false,
};

export interface WalletContextState {
  connected: boolean;
  isLoading: boolean;
  wallet: AdapterWallet | null;
  account: AccountInfo | null;
  getSolanaWallets: () => ReadonlyArray<AdapterWallet>;
  getEthereumWallets: () => ReadonlyArray<AdapterWallet>;
  getAptosWallets: () => ReadonlyArray<AdapterWallet>;
  connect: (wallet: AdapterWallet) => Promise<void>;
  disconnect: () => Promise<void>;
  signInWith: () => Promise<void>;
  getQuote: (
    amount: string,
    sourceChain: Chain
  ) => Promise<WormholeQuoteResponse>;
  initiateTransfer: (
    sourceChain: Chain,
    mainSigner: AptosAccount,
    sponsorAccount?: AptosAccount | Partial<Record<Network, string>>
  ) => Promise<{ originChainTxnId: string; destinationChainTxnId: string }>;
  sourceChain: Chain | null;
  setSourceChain: (chain: Chain) => void;
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
