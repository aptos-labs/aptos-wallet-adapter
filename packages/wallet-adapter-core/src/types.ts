import { TxnBuilderTypes, Types } from "aptos";
import { NetworkName, WalletReadyState } from "./constants";

export { TxnBuilderTypes, Types } from "aptos";
export type { InputGenerateTransactionData } from "@aptos-labs/ts-sdk";
// WalletName is a nominal type that wallet adapters should use, e.g. `'MyCryptoWallet' as WalletName<'MyCryptoWallet'>`
export type WalletName<T extends string = string> = T & {
  __brand__: "WalletName";
};
export type NetworkInfo = {
  name: NetworkName;
  chainId?: string;
  url?: string;
};

export type AccountInfo = {
  address: string;
  publicKey: string | string[];
  minKeysRequired?: number;
  ansName?: string | null;
};

export interface AptosWalletErrorResult {
  code: number;
  name: string;
  message: string;
}

export type OnNetworkChange = (
  callBack: (networkInfo: NetworkInfo) => Promise<void>
) => Promise<void>;

export interface PluginProvider {
  connect: () => Promise<AccountInfo>;
  account: () => Promise<AccountInfo>;
  disconnect: () => Promise<void>;
  signAndSubmitTransaction: (
    transaction: any,
    options?: any
  ) => Promise<{ hash: Types.HexEncodedBytes } | AptosWalletErrorResult>;
  signMessage: (message: SignMessagePayload) => Promise<SignMessageResponse>;
  network: () => Promise<NetworkName>;
  onAccountChange: (
    listener: (newAddress: AccountInfo) => Promise<void>
  ) => Promise<void>;
  onNetworkChange: OnNetworkChange;
  signMultiAgentTransaction: (
      rawTxn: TxnBuilderTypes.MultiAgentRawTransaction | TxnBuilderTypes.FeePayerRawTransaction
  ) => Promise<string>;
}

export interface AdapterPluginEvents {
  onNetworkChange: OnNetworkChange;
  onAccountChange(callback: any): Promise<any>;
}

export interface AdapterPluginProps<Name extends string = string> {
  name: WalletName<Name>;
  url: string;
  icon: `data:image/${"svg+xml" | "webp" | "png" | "gif"};base64,${string}`;
  providerName?: string;
  provider: any;
  deeplinkProvider?: (data: { url: string }) => string;
  connect(): Promise<any>;
  disconnect: () => Promise<any>;
  network: () => Promise<any>;
  signAndSubmitTransaction<T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ): Promise<{ hash: Types.HexEncodedBytes }>;
  signMessage<T extends SignMessagePayload>(
    message: T
  ): Promise<SignMessageResponse>;
}

export type AdapterPlugin<Name extends string = string> =
  AdapterPluginProps<Name> & AdapterPluginEvents;

export type Wallet<Name extends string = string> = AdapterPlugin<Name> & {
  readyState?: WalletReadyState;
};

export type WalletInfo = {
  name: WalletName;
  icon: string;
  url: string;
};

export declare interface WalletCoreEvents {
  connect(account: AccountInfo | null): void;
  disconnect(): void;
  readyStateChange(wallet: Wallet): void;
  networkChange(network: NetworkInfo | null): void;
  accountChange(account: AccountInfo | null): void;
}

export interface SignMessagePayload {
  address?: boolean; // Should we include the address of the account in the message
  application?: boolean; // Should we include the domain of the dapp
  chainId?: boolean; // Should we include the current chain id the wallet is connected to
  message: string; // The message to be signed and displayed to the user
  nonce: string; // A nonce the dapp should generate
}

export interface SignMessageResponse {
  address?: string;
  application?: string;
  chainId?: number;
  fullMessage: string; // The message that was generated to sign
  message: string; // The message passed in by the user
  nonce: string;
  prefix: "APTOS"; // Should always be APTOS
  signature: string | string[]; // The signed full message
  bitmap?: Uint8Array; // a 4-byte (32 bits) bit-vector of length N
}

export interface TransactionOptions {
  max_gas_amount?: bigint;
  gas_unit_price?: bigint;
}
