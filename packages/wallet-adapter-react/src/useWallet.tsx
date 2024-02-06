import {
  AccountInfo,
  NetworkInfo,
  AnyRawTransaction,
  InputTransactionData,
  InputSubmitTransactionData,
  PendingTransactionResponse,
  AccountAuthenticator,
  IAptosWallet,
  AptosSignMessageInput,
  AptosSignMessageOutput,
} from "@aptos-labs/wallet-adapter-core";
import { createContext, useContext } from "react";

export interface WalletContextState {
  connected: boolean;
  isLoading: boolean;
  account: AccountInfo | undefined;
  network: NetworkInfo | undefined;
  connect(walletName: string): void;
  disconnect(): void;
  wallet: IAptosWallet | undefined;
  wallets: ReadonlyArray<IAptosWallet>;
  signAndSubmitTransaction(
    transaction: InputTransactionData
  ): Promise<PendingTransactionResponse>;
  signTransaction(
    transactionOrPayload: AnyRawTransaction,
    asFeePayer?: boolean
  ): Promise<AccountAuthenticator>;
  submitTransaction(
    transaction: InputSubmitTransactionData
  ): Promise<PendingTransactionResponse>;
  signMessage(message: AptosSignMessageInput): Promise<AptosSignMessageOutput>;
  signMessageAndVerify(message: AptosSignMessageInput): Promise<boolean>;
}

const DEFAULT_CONTEXT = {
  connected: false,
};

export const WalletContext = createContext<WalletContextState>(
  DEFAULT_CONTEXT as WalletContextState
);

export function useWallet(): WalletContextState {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletContextState");
  }
  return context;
}
