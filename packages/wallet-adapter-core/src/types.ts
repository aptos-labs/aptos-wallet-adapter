import {
  InputGenerateTransactionOptions,
  AccountAddressInput,
  InputGenerateTransactionPayloadData,
} from "@aptos-labs/ts-sdk";
import { AccountInfo, NetworkInfo } from "@aptos-labs/wallet-standard";
import { IAptosWallet } from "./WalletCore";

export type {
  InputGenerateTransactionData,
  InputGenerateTransactionOptions,
  AnyRawTransaction,
  InputSubmitTransactionData,
  PendingTransactionResponse,
  AccountAuthenticator,
} from "@aptos-labs/ts-sdk";

export declare interface WalletCoreEvents {
  connect(account: AccountInfo): void;
  disconnect(): void;
  walletsAdded(wallets: IAptosWallet[]): void;
  networkChange(network: NetworkInfo): void;
  accountChange(account: AccountInfo): void;
}

export type InputTransactionData = {
  sender?: AccountAddressInput;
  data: InputGenerateTransactionPayloadData;
  options?: InputGenerateTransactionOptions;
};
