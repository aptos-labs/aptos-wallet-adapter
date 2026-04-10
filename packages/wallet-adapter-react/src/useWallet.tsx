import type {
  AccountAuthenticator,
  AccountInfo,
  AdapterNotDetectedWallet,
  AdapterWallet,
  AnyRawTransaction,
  AptosChangeNetworkOutput,
  AptosSignAndSubmitTransactionOutput,
  AptosSignInInput,
  AptosSignInOutput,
  AptosSignMessageInput,
  AptosSignMessageOutput,
  InputSubmitTransactionData,
  InputTransactionData,
  Network,
  NetworkInfo,
  PendingTransactionResponse,
} from "@aptos-labs/wallet-adapter-core";
import { createContext, useContext } from "react";

export interface WalletContextState {
  connected: boolean;
  isLoading: boolean;
  account: AccountInfo | null;
  network: NetworkInfo | null;
  connect(walletName: string): void;
  signIn(args: {
    walletName: string;
    input: AptosSignInInput;
  }): Promise<AptosSignInOutput | undefined>;
  signAndSubmitTransaction(
    transaction: InputTransactionData,
  ): Promise<AptosSignAndSubmitTransactionOutput>;
  signTransaction(args: {
    transactionOrPayload: AnyRawTransaction | InputTransactionData;
    asFeePayer?: boolean;
    masterDomain?: string;
  }): Promise<{
    authenticator: AccountAuthenticator;
    rawTransaction: Uint8Array;
  }>;
  signMessage(message: AptosSignMessageInput): Promise<AptosSignMessageOutput>;
  signMessageAndVerify(message: AptosSignMessageInput): Promise<boolean>;
  disconnect(): void;
  changeNetwork(network: Network): Promise<AptosChangeNetworkOutput>;
  submitTransaction(
    transaction: InputSubmitTransactionData,
  ): Promise<PendingTransactionResponse>;
  wallet: AdapterWallet | null;
  wallets: ReadonlyArray<AdapterWallet>;
  hiddenWallets: ReadonlyArray<AdapterWallet>;
  notDetectedWallets: ReadonlyArray<AdapterNotDetectedWallet>;
}

const DEFAULT_CONTEXT = {
  connected: false,
};

export const WalletContext = createContext<WalletContextState>(
  DEFAULT_CONTEXT as WalletContextState,
);

export function useWallet(): WalletContextState {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletContextState");
  }
  return context;
}
