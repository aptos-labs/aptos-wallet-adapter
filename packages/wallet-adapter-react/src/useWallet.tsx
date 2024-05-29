import {
  AccountInfo,
  NetworkInfo,
  WalletInfo,
  SignMessagePayload,
  SignMessageResponse,
  Wallet,
  InputGenerateTransactionOptions,
  AnyRawTransaction,
  InputTransactionData,
  InputSubmitTransactionData,
  PendingTransactionResponse,
  AccountAuthenticator,
  Types,
  WalletName,
  AptosChangeNetworkOutput,
  Network,
  AptosStandardSupportedWallet,
} from "@aptos-labs/wallet-adapter-core";
import { createContext, useContext } from "react";

export interface WalletContextState {
  connected: boolean;
  isLoading: boolean;
  account: AccountInfo | null;
  network: NetworkInfo | null;
  connect(walletName: WalletName): void;
  disconnect(): void;
  wallet: WalletInfo | null;
  wallets?: ReadonlyArray<Wallet | AptosStandardSupportedWallet>;
  signAndSubmitTransaction(transaction: InputTransactionData): Promise<any>;
  signTransaction(
    transactionOrPayload: AnyRawTransaction | Types.TransactionPayload,
    asFeePayer?: boolean,
    options?: InputGenerateTransactionOptions
  ): Promise<AccountAuthenticator>;
  submitTransaction(
    transaction: InputSubmitTransactionData
  ): Promise<PendingTransactionResponse>;
  signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
  signMessageAndVerify(message: SignMessagePayload): Promise<boolean>;
  changeNetwork(network: Network): Promise<AptosChangeNetworkOutput>;
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
