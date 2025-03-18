import {
  Chain,
  WormholeQuoteResponse,
  AptosAccount,
  GasStationApiKey,
  AccountAddressInput,
  ChainConfig,
} from "@aptos-labs/cross-chain-core";

import { AdapterWallet } from "@aptos-labs/wallet-adapter-aggregator-core";
import { AccountInfo, AptosSignInInput } from "@aptos-labs/wallet-standard";
import { createContext, useContext } from "react";
import { AptosNotDetectedWallet } from "@aptos-labs/wallet-adapter-aggregator-aptos";
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
  fetchAptosNotDetectedWallets: () => ReadonlyArray<AptosNotDetectedWallet>;
  connect: (wallet: AdapterWallet) => Promise<void>;
  signInWith: (args: {
    wallet: AdapterWallet;
    input: Omit<AptosSignInInput, "nonce">;
  }) => Promise<void>;
  disconnect: () => Promise<void>;
  getQuote: (args: {
    amount: string;
    sourceChain: Chain;
  }) => Promise<WormholeQuoteResponse>;
  initiateTransfer: (args: {
    sourceChain: Chain;
    destinationAddress: AccountAddressInput;
    mainSigner: AptosAccount;
    sponsorAccount?: AptosAccount | GasStationApiKey;
  }) => Promise<{ originChainTxnId: string; destinationChainTxnId: string }>;
  sourceChain: Chain | null;
  setSourceChain: (chain: Chain) => void;
  getChainInfo: (chain: Chain) => ChainConfig;
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
