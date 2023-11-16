import { Types } from "aptos";
import {
  Network,
  InputGenerateTransactionData,
  InputGenerateTransactionOptions,
  InputSubmitTransactionData,
  PendingTransactionResponse,
} from "@aptos-labs/ts-sdk";
import { WalletReadyState } from "./constants";

export { TxnBuilderTypes, Types } from "aptos";
export type {
  InputGenerateTransactionData,
  InputGenerateTransactionOptions,
  AnyRawTransaction,
  InputSubmitTransactionData,
  PendingTransactionResponse,
  AccountAuthenticator,
} from "@aptos-labs/ts-sdk";

// WalletName is a nominal type that wallet adapters should use, e.g. `'MyCryptoWallet' as WalletName<'MyCryptoWallet'>`
export type WalletName<T extends string = string> = T & {
  __brand__: "WalletName";
};

export type NetworkInfo = {
  name: Network;
  chainId?: string;
  url?: string;
};

export type WalletInfo = {
  name: WalletName;
  icon: string;
  url: string;
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

export type OnNetworkChange = (
  callBack: (networkInfo: NetworkInfo) => Promise<void>
) => Promise<void>;

export type OnAccountChange = (
  callBack: (accountInfo: AccountInfo) => Promise<any>
) => Promise<void>;

export interface AdapterPluginEvents {
  onNetworkChange: OnNetworkChange;
  onAccountChange: OnAccountChange;
}

// TODO add signTransaction()
export interface AdapterPluginProps<Name extends string = string> {
  name: WalletName<Name>;
  url: string;
  icon: `data:image/${"svg+xml" | "webp" | "png" | "gif"};base64,${string}`;
  version?: "v1" | "v2";
  providerName?: string;
  provider: any;
  deeplinkProvider?: (data: { url: string }) => string;
  connect(): Promise<any>;
  disconnect: () => Promise<any>;
  network: () => Promise<any>;
  signAndSubmitTransaction<V>(
    transaction: Types.TransactionPayload | InputGenerateTransactionData,
    options?: InputGenerateTransactionOptions
  ): Promise<
    { hash: Types.HexEncodedBytes; output?: any } | PendingTransactionResponse
  >;
  submitTransaction?(
    transaction: InputSubmitTransactionData
  ): Promise<PendingTransactionResponse>;
  signMessage<T extends SignMessagePayload>(
    message: T
  ): Promise<SignMessageResponse>;
}

export type AdapterPlugin<Name extends string = string> =
  AdapterPluginProps<Name> & AdapterPluginEvents;

export type Wallet<Name extends string = string> = AdapterPlugin<Name> & {
  readyState?: WalletReadyState;
};

export interface TransactionOptions {
  max_gas_amount?: bigint;
  gas_unit_price?: bigint;
}
