import { AccountAddressInput, Account } from "@aptos-labs/ts-sdk";
import { AdapterWallet } from "@aptos-labs/wallet-adapter-aggregator-core";
import { routes, AttestationReceipt } from "@wormhole-foundation/sdk/dist/cjs";
import { Chain, AptosAccount } from "../..";

export type WormholeRouteResponse = routes.Route<
  "Mainnet" | "Testnet",
  routes.Options,
  routes.ValidatedTransferParams<routes.Options>,
  routes.Receipt
>;

export type WormholeRequest = routes.RouteTransferRequest<
  "Mainnet" | "Testnet"
>;

export type WormholeQuoteResponse = routes.Quote<
  routes.Options,
  routes.ValidatedTransferParams<routes.Options>,
  any
>;

export interface WormholeQuoteRequest {
  amount: string;
  sourceChain: Chain;
}

export type GasStationApiKey = string;

export interface WormholeInitiateTransferRequest {
  sourceChain: Chain;
  wallet: AdapterWallet;
  destinationAddress: AccountAddressInput;
  mainSigner: Account;
  amount?: string;
  sponsorAccount?: Account | GasStationApiKey;
}

export interface WormholeSubmitTransferRequest {
  sourceChain: Chain;
  wallet: AdapterWallet;
  destinationAddress: AccountAddressInput;
}

export interface WormholeClaimTransferRequest {
  receipt: routes.Receipt<AttestationReceipt>;
  mainSigner: AptosAccount;
  sponsorAccount?: AptosAccount | GasStationApiKey;
}

export interface WormholeInitiateTransferResponse {
  destinationChainTxnId: string;
  originChainTxnId: string;
}

export interface WormholeStartTransferResponse {
  originChainTxnId: string;
  receipt: routes.Receipt<AttestationReceipt>;
}
