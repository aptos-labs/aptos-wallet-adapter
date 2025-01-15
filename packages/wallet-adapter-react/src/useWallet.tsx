import { useContext, createContext } from "react";
import {
  AccountAuthenticator,
  AccountInfo,
  AdapterWallet,
  AnyRawTransaction,
  AptosSignAndSubmitTransactionOutput,
  InputGenerateTransactionOptions,
  InputTransactionData,
  NetworkInfo,
  AptosSignMessageInput,
  AptosSignMessageOutput,
  AdapterNotDetectedWallet,
  Network,
  AptosChangeNetworkOutput,
  PendingTransactionResponse,
  InputSubmitTransactionData,
} from "@aptos-labs/wallet-adapter-core";

export interface WalletContextState {
  connected: boolean;
  isLoading: boolean;
  account: AccountInfo | null;
  network: NetworkInfo | null;
  connect(walletName: string): void;
  signAndSubmitTransaction(
    transaction: InputTransactionData
  ): Promise<AptosSignAndSubmitTransactionOutput>;
  signTransaction(
    transaction: AnyRawTransaction | InputTransactionData,
    asFeePayer?: boolean,
    options?: InputGenerateTransactionOptions & {
      expirationSecondsFromNow?: number;
      expirationTimestamp?: number;
    }
  ): Promise<AccountAuthenticator>;
  signMessage(message: AptosSignMessageInput): Promise<AptosSignMessageOutput>;
  signMessageAndVerify(message: AptosSignMessageInput): Promise<boolean>;
  disconnect(): void;
  changeNetwork(network: Network): Promise<AptosChangeNetworkOutput>;
  submitTransaction(
    transaction: InputSubmitTransactionData
  ): Promise<PendingTransactionResponse>;
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
