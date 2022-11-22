import {
  AccountInfo,
  NetworkInfo,
  WalletInfo,
  WalletName,
  SignMessagePayload,
  SignMessageResponse,
} from "@aptos/wallet-adapter-core/src/types";
import { createContext, useContext } from "react";
import { Types } from "aptos";

export type { WalletName };

export interface WalletContextState {
  connected: boolean;
  account: AccountInfo | null;
  network: NetworkInfo | null;
  connect(walletName: WalletName): void;
  disconnect(): void;
  getWallet(): WalletInfo | null;
  signAndSubmitTransaction<T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ): Promise<any>;
  signTransaction<T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ): Promise<any>;
  signMessage(message: SignMessagePayload): Promise<SignMessageResponse | null>;
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
