import { Types } from "aptos";
import {
  Network,
  InputGenerateTransactionOptions,
  InputSubmitTransactionData,
  PendingTransactionResponse,
  AccountAddressInput,
  InputGenerateTransactionPayloadData,
  AnyRawTransaction,
  Signature,
  AccountAuthenticator,
} from "@aptos-labs/ts-sdk";
import { WalletReadyState } from "../constants";
import {
  AptosSignAndSubmitTransactionOutput,
  AptosSignMessageOutput,
  UserResponse,
  AccountInfo as StandardAccountInfo,
  NetworkInfo as StandardNetworkInfo,
  AptosChangeNetworkMethod,
  AptosSignAndSubmitTransactionInput,
} from "@aptos-labs/wallet-standard";
import { AptosStandardSupportedWallet } from "../AIP62StandardWallets/types";

export { TxnBuilderTypes, Types } from "aptos";
export type {
  InputGenerateTransactionData,
  InputGenerateTransactionOptions,
  AnyRawTransaction,
  InputSubmitTransactionData,
  PendingTransactionResponse,
  AccountAuthenticator,
  Network,
} from "@aptos-labs/ts-sdk";

export type {
  NetworkInfo as StandardNetworkInfo,
  AptosChangeNetworkOutput,
} from "@aptos-labs/wallet-standard";

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
  standardWalletsAdded(wallets: Wallet | AptosStandardSupportedWallet): void;
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
  signature: string | string[] | Signature; // The signed full message
  bitmap?: Uint8Array; // a 4-byte (32 bits) bit-vector of length N
}

export type OnNetworkChange = (
  callBack: (networkInfo: NetworkInfo | StandardNetworkInfo) => Promise<void>
) => Promise<void>;

export type OnAccountChange = (
  callBack: (accountInfo: AccountInfo | StandardAccountInfo) => Promise<any>
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
  providerName?: string;
  provider: any;
  // Compatible with legacy wallet plugin
  deeplinkProvider?: (data: { url: string }) => string;
  // Comaptible with AIP-62 standard wallet
  openInMobileApp?: () => void;
  connect(): Promise<any>;
  disconnect: () => Promise<any>;
  network: () => Promise<any>;
  signAndSubmitTransaction?(
    transaction:
      | Types.TransactionPayload
      | InputTransactionData
      | AnyRawTransaction
      | AptosSignAndSubmitTransactionInput,
    options?: InputGenerateTransactionOptions
  ): Promise<
    | { hash: Types.HexEncodedBytes; output?: any }
    | PendingTransactionResponse
    | UserResponse<AptosSignAndSubmitTransactionOutput>
  >;
  submitTransaction?(
    transaction: InputSubmitTransactionData
  ): Promise<PendingTransactionResponse>;
  signMessage<T extends SignMessagePayload>(
    message: T
  ): Promise<SignMessageResponse | UserResponse<AptosSignMessageOutput>>;
  signTransaction?( // `any` type for backwards compatibility, especially for identity connect
    transactionOrPayload: any,
    optionsOrAsFeePayer?: any
  ): Promise<any>;
  account?: () => Promise<AccountInfo | StandardAccountInfo>;
  changeNetwork?: AptosChangeNetworkMethod;
}

export type AdapterPlugin<Name extends string = string> =
  AdapterPluginProps<Name> & AdapterPluginEvents;

export type Wallet<Name extends string = string> = AdapterPlugin<Name> & {
  readyState?: WalletReadyState;
  isAIP62Standard?: boolean;
};

export interface TransactionOptions {
  max_gas_amount?: bigint;
  gas_unit_price?: bigint;
}

export type InputTransactionData = {
  sender?: AccountAddressInput;
  data: InputGenerateTransactionPayloadData;
  options?: InputGenerateTransactionOptions;
};

// To be used by a wallet plugin
export interface PluginProvider {
  connect: () => Promise<AccountInfo>;
  account: () => Promise<AccountInfo>;
  disconnect: () => Promise<void>;
  signAndSubmitTransaction: (
    transaction: any,
    options?: any
  ) => Promise<{ hash: Types.HexEncodedBytes } | AptosWalletErrorResult>;
  signMessage: (message: SignMessagePayload) => Promise<SignMessageResponse>;
  network: () => Promise<NetworkInfo>;
  onAccountChange: (
    listener: (newAddress: AccountInfo) => Promise<void>
  ) => Promise<void>;
  onNetworkChange: OnNetworkChange;
}
