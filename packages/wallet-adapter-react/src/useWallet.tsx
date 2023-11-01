import {
  AccountInfo,
  NetworkInfo,
  WalletInfo,
  WalletName,
  SignMessagePayload,
  SignMessageResponse,
  Wallet,
  WalletReadyState,
  NetworkName,
  isInAppBrowser,
  isRedirectable,
  isMobile,
  TransactionOptions,
  TxnBuilderTypes,
  Types,
  InputGenerateTransactionData,
} from "@aptos-labs/wallet-adapter-core";
import { createContext, useContext } from "react";

export type { WalletName, Wallet };
export {
  WalletReadyState,
  NetworkName,
  isInAppBrowser,
  isRedirectable,
  isMobile,
};

export interface WalletContextState {
  connected: boolean;
  isLoading: boolean;
  account: AccountInfo | null;
  network: NetworkInfo | null;
  connect(walletName: WalletName): void;
  disconnect(): void;
  wallet: WalletInfo | null;
  wallets: ReadonlyArray<Wallet>;
  signAndSubmitTransaction<T extends Types.TransactionPayload>(
    transaction: T,
    options?: TransactionOptions
  ): Promise<any>;
  signAndSubmitBCSTransaction<T extends TxnBuilderTypes.TransactionPayload>(
    transaction: T,
    options?: TransactionOptions
  ): Promise<any>;
  signTransaction<T extends Types.TransactionPayload>(
    transaction: T,
    options?: TransactionOptions
  ): Promise<any>;
  signMessage(message: SignMessagePayload): Promise<SignMessageResponse | null>;
  signMessageAndVerify(message: SignMessagePayload): Promise<boolean>;
  submitTransaction(transaction: InputGenerateTransactionData): Promise<any>;
  signMultiAgentTransaction(
      transaction: TxnBuilderTypes.MultiAgentRawTransaction | TxnBuilderTypes.FeePayerRawTransaction,
  ): Promise<any>;
}

const DEFAULT_COUNTEXT = {
  connected: false,
};

export const WalletContext = createContext<WalletContextState>(
  DEFAULT_COUNTEXT as WalletContextState
);

export function useWallet(): WalletContextState {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletContextState");
  }
  return context;
}
