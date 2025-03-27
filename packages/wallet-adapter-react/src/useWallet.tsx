import { useContext, createContext } from "react";
import {
  AccountAuthenticator,
  AccountInfo,
  AdapterWallet,
  AnyRawTransaction,
  AptosSignAndSubmitTransactionOutput,
  InputTransactionData,
  NetworkInfo,
  AptosSignMessageInput,
  AptosSignMessageOutput,
  AdapterNotDetectedWallet,
  Network,
  AptosChangeNetworkOutput,
  PendingTransactionResponse,
  InputSubmitTransactionData,
  AptosSignInInput,
  AptosSignInOutput,
} from "@aptos-labs/wallet-adapter-core";
import { OriginWalletDetails } from "./WalletProvider";

export interface WalletContextState {
  connected: boolean;
  isLoading: boolean;
  account: AccountInfo | null;
  network: NetworkInfo | null;
  connect(walletName: string): void;
  signIn(args: {
    walletName: string;
    input: AptosSignInInput;
  }): Promise<AptosSignInOutput | void>;
  signAndSubmitTransaction(
    transaction: InputTransactionData
  ): Promise<AptosSignAndSubmitTransactionOutput>;
  signTransaction(args: {
    transactionOrPayload: AnyRawTransaction | InputTransactionData;
    asFeePayer?: boolean;
  }): Promise<{
    authenticator: AccountAuthenticator;
    rawTransaction: Uint8Array;
  }>;
  signMessage(message: AptosSignMessageInput): Promise<AptosSignMessageOutput>;
  signMessageAndVerify(message: AptosSignMessageInput): Promise<boolean>;
  disconnect(): void;
  changeNetwork(network: Network): Promise<AptosChangeNetworkOutput>;
  submitTransaction(
    transaction: InputSubmitTransactionData
  ): Promise<PendingTransactionResponse>;
  getOriginWalletDetails(
    wallet: AdapterWallet
  ): Promise<OriginWalletDetails | undefined>;
  isSolanaDerivedWallet(wallet: AdapterWallet): boolean;
  isEIP1193DerivedWallet(wallet: AdapterWallet): boolean;
  wallet: AdapterWallet | null;
  wallets: ReadonlyArray<AdapterWallet>;
  notDetectedWallets: ReadonlyArray<AdapterNotDetectedWallet>;
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
